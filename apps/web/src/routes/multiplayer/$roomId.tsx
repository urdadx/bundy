import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useCallback, useState } from "react";
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { MultiplayerWordSearch } from "@/components/playground/board/multiplayer-word-search";
import { MultiplayerResultDialog } from "@/components/multiplayer-result-dialog";
import { MultiplayerGameHeader } from "@/components/playground/multiplayer-game-header";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { SideMenu } from "@/components/ui/side-menu";
import { ChatPanel } from "@/components/playground/chat/chat-panel";
import { WordListPanel, GameActionsPanel } from "@/components/layouts/playground-layout";

export const Route = createFileRoute("/multiplayer/$roomId")({
  component: MultiplayerGamePage,
});

const PLAYER_COLORS = {
  host: "#1cb0f6",
  guest: "#ff4b4b",
};

function MultiplayerGamePage() {
  const { roomId } = Route.useParams();
  const navigate = useNavigate();

  const {
    room,
    connect,
    disconnect,
    moveCursor,
    leaveCursor,
    claimWord,
    isConnecting,
    players,
    myPlayerId,
    myScore,
    opponentScore,
    puzzle,
    foundWords,
    opponentCursor,
    winner,
    error,
    phase,
    settings,
    currentPlayer,
    opponent,
    isHost,
    rematchRequestedBy,
    requestRematch,
    gameStartTime,
    countdown,
    isRematch,
  } = useMultiplayerGame({ roomId });

  const [showResultDialog, setShowResultDialog] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(settings?.timeLimit || 600);
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      content: string;
      senderId: string;
      senderName: string;
      timestamp: Date;
    }>
  >([]);

  // Connect to WebSocket on mount
  useEffect(() => {
    if (roomId) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [roomId, connect, disconnect]);

  // Show result dialog when game finishes
  useEffect(() => {
    if (phase === "finished") {
      setShowResultDialog(true);
    } else {
      setShowResultDialog(false);
    }
  }, [phase]);

  // Navigate back to lobby if game resets (e.g. rematch), but not if countdown is active or during rematch
  useEffect(() => {
    if ((phase === "waiting" || phase === "ready") && countdown === null && !isRematch) {
      navigate({ to: "/lobby/$roomId", params: { roomId } });
    }
  }, [phase, roomId, navigate, countdown, isRematch]);

  // Game timer countdown
  useEffect(() => {
    if (phase !== "playing" || !gameStartTime || !settings?.timeLimit) {
      return;
    }

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
      const remaining = Math.max(0, settings.timeLimit - elapsed);
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [phase, gameStartTime, settings?.timeLimit]);

  const getGameResult = useCallback(() => {
    if (room?.isDraw) return "draw";
    if (winner?.player.id === myPlayerId) return "win";
    return "lose";
  }, [room?.isDraw, winner, myPlayerId]);

  const handleRematch = useCallback(() => {
    requestRematch();
  }, [requestRematch]);

  const handleWordFound = useCallback(
    (word: string, start: { r: number; c: number }, end: { r: number; c: number }) => {
      claimWord(word, start, end);
    },
    [claimWord],
  );

  const handleCursorMove = useCallback(
    (x: number, y: number) => {
      moveCursor(x, y);
    },
    [moveCursor],
  );

  const handleCursorLeave = useCallback(() => {
    leaveCursor();
  }, [leaveCursor]);

  const handleBack = useCallback(() => {
    disconnect();
    navigate({ to: "/choose" });
  }, [disconnect, navigate]);

  const handleSendMessage = useCallback(
    (message: string) => {
      // TODO: Implement chat message sending via WebSocket
      const newMessage = {
        id: Date.now().toString(),
        content: message,
        senderId: myPlayerId || "",
        senderName: currentPlayer?.name || "Player",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, newMessage]);
    },
    [myPlayerId, currentPlayer?.name],
  );

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader />
          <p className="text-slate-500 font-medium">Connecting to game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-3xl">😵</span>
          </div>
          <h2 className="text-xl font-black text-slate-700">Connection Error</h2>
          <p className="text-slate-500">{error}</p>
          <Button variant="primary" onClick={handleBack}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader />
          <p className="text-slate-500 font-medium">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  const foundWordsSet = new Set(foundWords.map((f) => f.word));

  // Show countdown overlay when game is about to start (e.g., rematch)
  if (countdown !== null && countdown > 0) {
    return (
      <div className="flex items-center justify-center min-h-screen backdrop-blur-xs bg-slate-900">
        <div className="flex flex-col items-center gap-6">
          <p className="text-white text-xl font-bold uppercase tracking-wide">Game Starting In</p>
          <div className="w-40 h-40 rounded-full bg-linear-to-br from-green-400 to-green-600 border-8 border-white shadow-2xl flex items-center justify-center animate-pulse">
            <span className="text-white text-7xl font-black">{countdown}</span>
          </div>
          <p className="text-slate-400 text-base">Get ready!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SideMenu />
      <div className="min-h-screen w-full bg-slate-50">
        <div className="flex justify-center items-start w-full min-h-screen py-6 px-4">
          <div className="flex gap-6 max-w-7xl w-full">
            <div className="flex-3 flex flex-col items-center gap-4">
              <div className="w-full">
                <MultiplayerGameHeader
                  player1={{
                    score: myScore,
                    name: currentPlayer?.name || "Player",
                    avatar: currentPlayer?.avatar,
                  }}
                  player2={{
                    score: opponentScore,
                    name: opponent?.name || "Guest",
                    avatar: opponent?.avatar,
                  }}
                  timeRemaining={timeRemaining}
                />
              </div>

              <div className="shrink-0">
                <MultiplayerWordSearch
                  puzzle={puzzle}
                  players={players}
                  myPlayerId={myPlayerId || ""}
                  foundWords={foundWords}
                  opponentCursor={opponentCursor}
                  onWordFound={handleWordFound}
                  onCursorMove={handleCursorMove}
                  onCursorLeave={handleCursorLeave}
                />
              </div>
            </div>

            <div className="hidden lg:flex flex-2 flex-col gap-3">
              <WordListPanel words={puzzle.words.map((w) => w.word)} foundWords={foundWordsSet} />

              <ChatPanel
                messages={chatMessages.map((msg) => ({
                  id: msg.id,
                  content: msg.content,
                  senderId: msg.senderId,
                  senderName: msg.senderName,
                  timestamp: msg.timestamp,
                  isOwn: msg.senderId === myPlayerId,
                }))}
                currentUser={{
                  name: currentPlayer?.name || "Player",
                  avatar: currentPlayer?.avatar,
                }}
                opponent={{
                  name: opponent?.name || "Guest",
                  avatar: opponent?.avatar,
                  isOnline: true,
                }}
                onSendMessage={handleSendMessage}
                disabled={phase !== "playing"}
              />

              <GameActionsPanel />
            </div>
          </div>
        </div>
      </div>

      <MultiplayerResultDialog
        open={showResultDialog}
        onOpenChange={setShowResultDialog}
        result={getGameResult()}
        myScore={myScore}
        opponentScore={opponentScore}
        currentPlayer={currentPlayer}
        opponent={opponent}
        isHost={isHost}
        onRematch={handleRematch}
        onExit={handleBack}
        rematchRequestedBy={rematchRequestedBy}
        myPlayerId={myPlayerId}
      />
    </div>
  );
}
