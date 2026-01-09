import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useCallback, useState } from "react";
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { MultiplayerWordSearch } from "@/components/playground/board/multiplayer-word-search";
import { MultiplayerResultDialog } from "@/components/multiplayer-result-dialog";
import { AvatarDisplay } from "@/components/avatar-selector";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { ArrowLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

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
  } = useMultiplayerGame({ roomId });

  const [showResultDialog, setShowResultDialog] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(settings?.timeLimit || 600);

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
    }
  }, [phase]);

  // Navigate back to lobby if game resets (e.g. rematch)
  useEffect(() => {
    if (phase === "waiting" || phase === "ready") {
      navigate({ to: "/lobby/$roomId", params: { roomId } });
    }
  }, [phase, roomId, navigate]);

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

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

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

  const myColor = currentPlayer?.isHost ? PLAYER_COLORS.host : PLAYER_COLORS.guest;
  const opponentColor = currentPlayer?.isHost ? PLAYER_COLORS.guest : PLAYER_COLORS.host;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="flex items-center justify-between p-4 bg-white border-b-2 border-slate-100">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Leave
        </Button>

        <div
          className={cn(
            "flex items-center gap-2",
            timeRemaining <= 60 ? "text-red-500" : "text-slate-700",
          )}
        >
          <Clock className="w-5 h-5" />
          <span className="font-bold text-lg">{formatTime(timeRemaining)}</span>
        </div>

        {/* Theme indicator */}
        <div className="text-sm text-slate-500">{settings?.theme || "Word Search"}</div>
      </header>

      {/* Score bar */}
      <div className="flex items-center justify-center gap-8 p-4 bg-white border-b border-slate-100">
        {/* My score */}
        <div className="flex items-center gap-3 min-w-[140px] justify-end">
          <div className="text-right">
            <p className="text-sm font-black text-slate-700 leading-[1.1] truncate max-w-[100px]">
              {currentPlayer?.name || "Player"}
            </p>

            <p className="text-2xl font-black leading-none" style={{ color: myColor }}>
              {myScore}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center p-1 border-2"
            style={{ backgroundColor: `${myColor}20`, borderColor: myColor }}
          >
            <AvatarDisplay
              avatarId={currentPlayer?.avatar || "jack-avatar.png"}
              size="sm"
              showBorder={false}
            />
          </div>
        </div>

        {/* VS */}
        <div className="text-slate-400 font-bold text-sm shrink-0">VS</div>

        {/* Opponent score */}
        <div className="flex items-center gap-3 min-w-[140px] justify-start">
          <div
            className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center p-1 border-2"
            style={{
              backgroundColor: `${opponentColor}20`,
              borderColor: opponentColor,
            }}
          >
            <AvatarDisplay
              avatarId={opponent?.avatar || "jack-avatar.png"}
              size="sm"
              showBorder={false}
            />
          </div>
          <div className="text-left">
            <p className="text-sm font-black text-slate-700 leading-[1.1] truncate max-w-[100px]">
              {opponent?.name || "Guest"}
            </p>

            <p className="text-2xl font-black leading-none" style={{ color: opponentColor }}>
              {opponentScore}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
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

      {/* Word list */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex flex-wrap gap-2 justify-center">
          {puzzle.words.map(({ word }) => {
            const found = foundWords.find((f) => f.word === word);
            const foundByMe = found?.foundBy === myPlayerId;
            const wordColor = found ? (foundByMe ? myColor : opponentColor) : undefined;

            return (
              <span
                key={word}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-bold transition-all",
                  found ? "line-through opacity-75" : "bg-slate-100 text-slate-600",
                )}
                style={
                  found
                    ? {
                        backgroundColor: `${wordColor}20`,
                        color: wordColor,
                      }
                    : undefined
                }
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Game Result Dialog */}
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
