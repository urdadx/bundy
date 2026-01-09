import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { AvatarDisplay } from "@/components/avatar-selector";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { useSession } from "@/lib/auth-client";
import { Swords, Check, ArrowLeft } from "lucide-react";
import { getInviteLink } from "@/lib/multiplayer/api";
import { cn } from "@/lib/utils";
import type { AvatarId } from "@/lib/avatars";
import backgroundImage from "@/assets/background/backgroundCastles.png";

export const Route = createFileRoute("/lobby/$roomId")({
  component: LobbyPage,
});

function LobbyPage() {
  const { roomId } = Route.useParams();
  const navigate = useNavigate();
  const { data: session } = useSession();

  const {
    connect,
    disconnect,
    setReady,
    updateAvatar,
    isConnecting,
    players,
    myPlayerId,
    isHost,
    error,
    phase,
    countdown,
  } = useMultiplayerGame({ roomId });

  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>("jack-avatar.png");

  useEffect(() => {
    if (roomId && session?.user?.id) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [roomId, session?.user?.id, connect, disconnect]);

  // Navigate to game when it starts
  useEffect(() => {
    if (phase === "playing") {
      navigate({ to: "/multiplayer/$roomId", params: { roomId } });
    }
  }, [phase, roomId, navigate]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getInviteLink(roomId));
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [roomId]);

  const handleAvatarChange = useCallback(
    (avatarId: AvatarId) => {
      setSelectedAvatar(avatarId);
      updateAvatar(avatarId);
    },
    [updateAvatar],
  );

  const handleReady = useCallback(() => {
    setReady(true);
  }, [setReady]);

  const handleBack = useCallback(() => {
    disconnect();
    navigate({ to: "/choose" });
  }, [disconnect, navigate]);

  const myPlayer = players.find((p: { id: string }) => p.id === myPlayerId);
  const opponent = players.find((p: { id: string }) => p.id !== myPlayerId);

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader />
          <p className="text-slate-500 font-medium">Connecting to room...</p>
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

  // Show countdown overlay when game is about to start
  if (countdown !== null && countdown > 0) {
    return (
      <div className="flex items-center justify-center min-h-screen backdrop-blur-xs bg-slate-900">
        <div className="flex flex-col items-center gap-6">
          <p className="text-white text-xl font-bold uppercase tracking-wide">Game Starting In</p>
          <div className="w-40 h-40 rounded-full bg-linear-to-br from-green-400 to-green-600 border-8 border-white shadow-2xl flex items-center justify-center animate-pulse">
            <span className="text-white text-7xl font-black">{countdown}</span>
          </div>
          <p className="text-slate-400 text-sm">Get ready!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <header className="flex items-center justify-between p-4">
        <Button variant="incorrect" onClick={handleBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Leave
        </Button>
        <h1 className="font-black text-slate-500 uppercase text-3xl tracking-wide">LOBBY</h1>
        <div className="w-20" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between gap-6 w-full">
          <div className="flex-1 flex flex-col items-center gap-4">
            <div className={cn("w-32 h-32 flex items-center justify-center p-2 transition-all")}>
              <AvatarDisplay
                avatarId={selectedAvatar || myPlayer?.avatar || "jack-avatar.png"}
                size="xl"
                showBorder={false}
              />
            </div>
            <div className="text-center">
              <p className="font-black text-slate-700 text-sm uppercase tracking-wide">
                {session?.user?.name || "Player 1"}
              </p>
              <p className="text-sm text-slate-500">
                {isHost ? "Host" : "You"} {myPlayer?.isReady && "Ready"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-linear-to-br from-green-500 to-green-600 border-4 border-white shadow-xl flex items-center justify-center">
              <Swords className="w-7 h-7 text-white" />
            </div>
            <p className="font-black text-xl text-transparent bg-clip-text bg-linear-to-r from-green-500 to-green-600">
              VS
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center gap-4">
            <div className={cn("w-32 h-32 flex items-center justify-center transition-all")}>
              {opponent ? (
                <AvatarDisplay
                  avatarId={opponent.avatar || "jack-avatar.png"}
                  size="xl"
                  showBorder={false}
                />
              ) : (
                <div className="text-blue-500 text-5xl font-black">?</div>
              )}
            </div>
            <div className="text-center">
              <p className="font-black text-slate-700 text-sm uppercase tracking-wide">
                {opponent?.name || "Waiting..."}
              </p>
              {opponent && (
                <p className="text-sm text-slate-500">
                  {opponent.isHost ? "Host" : "Guest"} {opponent.isReady && "Ready"}
                </p>
              )}
            </div>
          </div>
        </div>

        {isHost && !opponent && (
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-white border-2 border-slate-200 rounded-xl px-4 py-2 overflow-hidden">
                  <span className="text-base font-medium text-slate-500 truncate">
                    {getInviteLink(roomId)}
                  </span>
                </div>
                <Button variant="primary" size="default" onClick={handleCopyLink} className="">
                  {copiedLink ? "Copied" : "Copy Link"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="w-full">
          {myPlayer?.isReady ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-5 h-5" />
                <span className="font-bold text-xl">You're Ready!</span>
              </div>
              <p className="text-lg font-semibold text-slate-500">
                {opponent?.isReady ? "Starting game..." : "Waiting for opponent to ready up..."}
              </p>
            </div>
          ) : (
            <Button variant="primary" className="w-full" onClick={handleReady} disabled={!opponent}>
              {opponent ? "Ready!" : "Waiting for Opponent..."}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
