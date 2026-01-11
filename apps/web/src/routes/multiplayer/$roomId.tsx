import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useCallback, useState, useRef } from "react";
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { MultiplayerWordSearch } from "@/components/playground/board/multiplayer-word-search";
import { MultiplayerResultDialog } from "@/components/multiplayer-result-dialog";
import { MultiplayerGameHeader } from "@/components/playground/multiplayer-game-header";
import { Loader } from "@/components/loader";
import { toast } from "sonner";
import { SideMenu } from "@/components/ui/side-menu";
import { ChatPanel } from "@/components/playground/chat/chat-panel";
import { WordListPanel, GameActionsPanelMultiplayer } from "@/components/layouts/playground-layout";
import { CountdownOverlay } from "@/components/playground/countdown-overlay";
import { GameConnectionError } from "@/components/playground/game-connection-error";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChatPanelMobile } from "@/components/playground/chat/chat-panel-mobile";
import { sleep } from "@/lib/utils";

export const Route = createFileRoute("/multiplayer/$roomId")({
  component: MultiplayerGamePage,
});

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
    leaveRoom,
    gameStartTime,
    countdown,
    isRematch,
    chatMessages,
    sendChatMessage,
    sendTyping,
    isOpponentTyping,
  } = useMultiplayerGame({ roomId });

  const [showResultDialog, setShowResultDialog] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(settings?.timeLimit || 600);
  const isResigningRef = useRef(false);

  useEffect(() => {
    if (roomId) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [roomId, connect, disconnect]);

  useEffect(() => {
    if (phase === "finished") {
      setShowResultDialog(true);
    } else {
      setShowResultDialog(false);
    }
  }, [phase]);

  useEffect(() => {
    if ((phase === "waiting" || phase === "ready") && countdown === null && !isRematch) {
      navigate({ to: "/lobby/$roomId", params: { roomId } });
    }
  }, [phase, roomId, navigate, countdown, isRematch]);

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

  const handleResign = useCallback(() => {
    isResigningRef.current = true;
    toast.success("You resigned from the game");
    navigate({ to: "/arena/lessons" });
    sleep(1);
    leaveRoom();
  }, [leaveRoom, navigate]);

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

  if (error && !isResigningRef.current) {
    return <GameConnectionError error={error} onBack={handleBack} />;
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

  if (countdown !== null && countdown > 0) {
    return <CountdownOverlay countdown={countdown} />;
  }

  return (
    <>
      <div className="flex">
        <SideMenu />
        <div className="min-h-screen w-full bg-slate-50 overflow-x-hidden">
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

                <div className="lg:hidden w-full flex flex-col gap-3 mb-14">
                  <WordListPanel
                    words={puzzle.words.map((w) => w.word)}
                    foundWords={foundWordsSet}
                  />
                  <GameActionsPanelMultiplayer onResign={handleResign} />
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="default" className="w-full">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2" />
                        Live Chat
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-[95%] ">
                      <ChatPanelMobile
                        messages={chatMessages.map((msg) => ({
                          id: msg.id,
                          message: msg.content,
                          sender: {
                            name: msg.senderName,
                            avatar: msg.senderAvatar,
                          },
                          isOwn: msg.senderId === myPlayerId,
                          timestamp: new Date(msg.timestamp),
                        }))}
                        currentUser={{
                          name: currentPlayer?.name || "Player",
                          avatar: currentPlayer?.avatar,
                        }}
                        opponent={{
                          name: opponent?.name || "Guest",
                          avatar: opponent?.avatar,
                        }}
                        isOpponentTyping={isOpponentTyping}
                        onSendMessage={sendChatMessage}
                        onTyping={sendTyping}
                        disabled={phase !== "playing"}
                      />
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>

              <div className="hidden lg:flex flex-2 flex-col gap-3">
                <WordListPanel words={puzzle.words.map((w) => w.word)} foundWords={foundWordsSet} />

                <ChatPanel
                  messages={chatMessages.map((msg) => ({
                    id: msg.id,
                    message: msg.content,
                    sender: {
                      name: msg.senderName,
                      avatar: msg.senderAvatar,
                    },
                    isOwn: msg.senderId === myPlayerId,
                    timestamp: new Date(msg.timestamp),
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
                  isOpponentTyping={isOpponentTyping}
                  onSendMessage={sendChatMessage}
                  onTyping={sendTyping}
                  disabled={phase !== "playing"}
                />

                <GameActionsPanelMultiplayer onResign={handleResign} />
              </div>
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
    </>
  );
}
