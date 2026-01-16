import { WordSearch } from "@/components/playground/board/word-search";
import { WordListPanel, GameActionsPanel } from "@/components/layouts/playground-layout";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/utils/trpc";
import { useSession } from "@/lib/auth-client";
import { Loader } from "@/components/loader";
import { PuzzleCompletionDialog } from "@/components/puzzle-completion-dialog";
import { PuzzleInCompletionDialog } from "@/components/puzzle-incomplete-dialog";
import { useGameTimer } from "@/hooks/use-game-timer";
import { useUnmount } from "@/hooks/use-unmount";
import { useHint } from "@/hooks/use-hint";
import { ColorThemeProvider, useColorTheme } from "@/contexts/color-theme-context";

import jackAvatar from "@/assets/avatars/jack-avatar.png";
import backgroundMusic from "@/assets/sounds/background.mp3";
import { CareerGameHeader } from "@/components/playground/career-game-header";
import { GameTips } from "@/components/game-tips";
import { useBackgroundAudio } from "@/hooks/use-background-audio";

const playgroundSearchSchema = z.object({
  stageId: z.string().optional(),
});

export const Route = createFileRoute("/arena/playground/")({
  validateSearch: (search) => playgroundSearchSchema.parse(search),
  component: () => (
    <ColorThemeProvider>
      <RouteComponent />
    </ColorThemeProvider>
  ),
});

function RouteComponent() {
  const { stageId } = Route.useSearch();
  const { data: session } = useSession();
  const { colorTheme } = useColorTheme();
  const queryClient = useQueryClient();

  const [gameKey, setGameKey] = useState(0);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [placedWordsData, setPlacedWordsData] = useState<
    Array<{
      word: string;
      start: { r: number; c: number };
      end: { r: number; c: number };
    }>
  >([]);

  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [incompleteDialogOpen, setIncompleteDialogOpen] = useState(false);
  const [completionData, setCompletionData] = useState<{
    xpEarned: number;
    diamondsEarned: number;
    nextStage: any;
  } | null>(null);

  const navigate = Route.useNavigate();

  const { data: stage, isLoading: stageLoading } = useQuery({
    ...trpc.stages.getById.queryOptions({ id: stageId || "" }),
    enabled: !!stageId,
  });

  const { data: world, isLoading: worldLoading } = useQuery({
    ...trpc.worlds.getById.queryOptions({ id: stage?.worldId || "" }),
    enabled: !!stage?.worldId,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    ...trpc.user.getStats.queryOptions(),
    enabled: !!session?.user,
  });

  const completeStage = useMutation({
    mutationFn: async (params: { stageId: string; completionTime: number; stars: number }) => {
      return trpcClient.stages.completeStage.mutate(params);
    },
    onSuccess: (data) => {
      setCompletionData(data);
      setCompletionDialogOpen(true);

      queryClient.invalidateQueries({ queryKey: trpc.user.getStats.queryKey() });
      queryClient.invalidateQueries({ queryKey: trpc.stages.getProgress.queryKey() });
      queryClient.invalidateQueries({ queryKey: trpc.worlds.getAll.queryKey() });
    },
    onError: (error) => {
      console.error("Failed to complete stage:", error);
      if (typeof window !== "undefined") {
        alert(`Failed to complete stage: ${error.message || "Unknown error"}`);
      }
    },
  });

  const updateDiamonds = useMutation({
    mutationFn: async (params: { diamonds: number; operation: "add" | "subtract" | "set" }) => {
      return trpcClient.user.updateDiamonds.mutate(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.user.getStats.queryKey() });
    },
    onError: (error) => {
      console.error("Failed to update diamonds:", error);
      if (typeof window !== "undefined") {
        alert(`Failed to update diamonds: ${error.message || "Unknown error"}`);
      }
    },
  });

  const hint = useHint({
    diamonds: stats?.diamonds || 0,
    foundWords,
    placedWords: placedWordsData,
    onDiamondsChange: () => {
      updateDiamonds.mutate({ diamonds: 5, operation: "subtract" });
    },
  });

  const handleTimeUp = () => {
    if (foundWords.size < placedWords.length) {
      setIncompleteDialogOpen(true);
    }
  };

  const { timeLeft, start, pause, reset } = useGameTimer({
    initialTime: stage?.timeLimit || 300,
    onTimeUp: handleTimeUp,
  });

  const stageWords = useMemo(() => {
    return stage?.words ? stage.words.split(",") : [];
  }, [stage?.words]);

  const player1 = {
    name: session?.user?.name || "You",
    avatar: session?.user?.image || jackAvatar,
    score: foundWords.size,
    isCurrentTurn: true,
  };

  const handleWordFound = (word: string) => {
    setFoundWords((prev) => new Set([...prev, word]));
  };

  const handlePuzzleGenerated = (words: string[]) => {
    setPlacedWords(words);
    start();
  };

  const handlePuzzleDataGenerated = (
    wordsData: Array<{
      word: string;
      start: { r: number; c: number };
      end: { r: number; c: number };
    }>,
  ) => {
    setPlacedWordsData(wordsData);
  };

  const handlePuzzleComplete = () => {
    console.log("Puzzle completed!");
    pause();

    if (stageId && stage) {
      const elapsedTime = (stage.timeLimit || 300) - timeLeft;
      console.log(`Completing stage ${stageId} with time ${elapsedTime}s`);
      completeStage.mutate({ stageId, completionTime: elapsedTime, stars: 3 });
    } else {
      console.error("Cannot complete stage: missing stageId or stage data");
    }
  };

  const handleReplayLevel = () => {
    setGameKey((prev) => prev + 1);
    setFoundWords(new Set());
    setIncompleteDialogOpen(false);
    reset();
  };

  useUnmount(() => {
    pause();
  });

  const handleNextStage = () => {
    setCompletionDialogOpen(false);
    setGameKey((prev) => prev + 1);

    if (completionData?.nextStage) {
      navigate({
        to: "/arena/playground",
        search: { stageId: completionData.nextStage.id },
      });
      reset();
      setFoundWords(new Set());
    } else {
      navigate({ to: "/arena/lessons" });
    }
  };

  const isPlaying =
    timeLeft > 0 && timeLeft < (stage?.timeLimit || 300) && foundWords.size < placedWords.length;
  const { play } = useBackgroundAudio(backgroundMusic, isPlaying);

  useEffect(() => {
    const handleUserInteraction = async () => {
      await play();

      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, [play]);

  if (stageLoading || statsLoading || worldLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Loader />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="text-center space-y-4">
          <p className="text-lg">Please log in to play</p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!stageId || !stage) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="text-center space-y-4">
          <p className="text-lg">No stage selected</p>
          <button
            onClick={() => navigate({ to: "/worlds", search: { world: "meadow" } })}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Select a Stage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 overflow-x-hidden">
      <div className="flex justify-center items-start w-full min-h-screen py-6 px-4 overflow-x-hidden">
        <div className="flex gap-6 max-w-7xl w-full overflow-x-hidden" key={gameKey}>
          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="w-full max-w-175">
              <CareerGameHeader
                user={{
                  name: player1.name,
                  avatar: player1.avatar,
                  xp: stats?.totalXp ?? 10,
                  diamonds: stats?.diamonds ?? 0,
                }}
                timerDuration={stage?.timeLimit || 300}
                onTimerEnd={handleTimeUp}
              />
            </div>

            <div className="shrink-0">
              <WordSearch
                size={stage?.gridSize}
                difficulty={stage?.difficulty as any}
                words={stageWords}
                onWordFound={(word) => handleWordFound(word)}
                onPuzzleGenerated={handlePuzzleGenerated}
                onPuzzleDataGenerated={handlePuzzleDataGenerated}
                onPuzzleComplete={handlePuzzleComplete}
                hint={hint.hint}
                colorTheme={colorTheme}
              />
            </div>

            <div className="lg:hidden flex flex-col gap-3 max-w-md">
              <WordListPanel
                words={placedWords.length > 0 ? placedWords : stageWords}
                foundWords={foundWords}
              />
              <GameActionsPanel
                diamonds={stats?.diamonds}
                foundWords={foundWords}
                placedWords={placedWordsData}
                onDiamondsChange={() =>
                  updateDiamonds.mutate({ diamonds: 5, operation: "subtract" })
                }
                onRequestHint={hint.requestHint}
                canUseHint={hint.canUseHint}
              />
            </div>
          </div>

          <div className="hidden lg:flex w-full  flex-col gap-3">
            <WordListPanel
              words={placedWords.length > 0 ? placedWords : stageWords}
              foundWords={foundWords}
            />
            <GameTips worldTheme={world?.theme} />
            <GameActionsPanel
              diamonds={stats?.diamonds}
              foundWords={foundWords}
              placedWords={placedWordsData}
              onDiamondsChange={() => updateDiamonds.mutate({ diamonds: 5, operation: "subtract" })}
              onRequestHint={hint.requestHint}
              canUseHint={hint.canUseHint}
            />
          </div>
        </div>
      </div>

      <PuzzleCompletionDialog
        open={completionDialogOpen}
        onOpenChange={setCompletionDialogOpen}
        xpEarned={completionData?.xpEarned ?? 0}
        diamondsEarned={completionData?.diamondsEarned ?? 0}
        onNextStage={handleNextStage}
      />

      <PuzzleInCompletionDialog
        open={incompleteDialogOpen}
        onOpenChange={setIncompleteDialogOpen}
        onReplayLevel={handleReplayLevel}
      />
    </div>
  );
}
