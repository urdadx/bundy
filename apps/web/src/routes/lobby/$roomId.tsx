import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { AvatarDisplay } from "@/components/avatar-selector";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { authClient, useSession } from "@/lib/auth-client";
import { Swords, LogOutIcon } from "lucide-react";
import { getInviteLink } from "@/lib/multiplayer/api";
import { cn } from "@/lib/utils";
import type { AvatarId } from "@/lib/avatars";
import { normalizeAvatar } from "@/lib/avatars";
import backgroundImage from "@/assets/background/backgroundCastles.png";
import { CountdownOverlay } from "@/components/playground/countdown-overlay";
import { GameConnectionError } from "@/components/playground/game-connection-error";
import { LobbyAuthForm } from "@/components/lobby-auth-form";

export const Route = createFileRoute("/lobby/$roomId")({
  component: LobbyPage,
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    return {
      session,
      isAuthenticated: !!session,
    };
  },
});

function LobbyPage() {
  const { roomId } = Route.useParams();
  const { isAuthenticated, session: initialSession } = Route.useRouteContext();
  const navigate = useNavigate();
  const { data: session } = useSession();

  const currentSession = session || initialSession;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const {
    connect,
    disconnect,
    leaveRoom,
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
  const avatarSrc = currentSession?.user?.image || "";
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>(
    avatarSrc.includes("marie-avatar") ? "marie-avatar.png" : "jack-avatar.png",
  );

  useEffect(() => {
    if (roomId && currentSession?.user?.id && isAuthenticated) {
      connect();
      const newAvatar = avatarSrc.includes("marie-avatar") ? "marie-avatar.png" : "jack-avatar.png";
      setSelectedAvatar(newAvatar);
    }
    return () => disconnect();
  }, [roomId, currentSession?.user?.id, isAuthenticated, connect, disconnect]);

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

  const _handleAvatarChange = useCallback(
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
    leaveRoom();
    disconnect();
    navigate({ to: "/choose" });
  }, [leaveRoom, disconnect, navigate]);

  const myPlayer = players.find((p: { id: string }) => p.id === myPlayerId);
  const opponent = players.find((p: { id: string }) => p.id !== myPlayerId);

  if (isConnecting) {
    return (
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="flex items-center justify-center min-h-screen "
      >
        <div className="flex flex-col items-center gap-2 sm:gap-4">
          <Loader />
          <p className="text-slate-500 font-medium">Connecting to room...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
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
        <LobbyAuthForm open={true} onOpenChange={() => {}} />
      </div>
    );
  }

  if (error) {
    return <GameConnectionError error={error} onBack={handleBack} />;
  }

  if (countdown !== null && countdown > 0) {
    return <CountdownOverlay countdown={countdown} />;
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
      <header className="flex items-center justify-between p-2 sm:p-4">
        <Button variant="incorrect" onClick={handleBack} className="gap-2">
          <LogOutIcon className="w-4 h-4  scale-x-[-1]" />
          Leave
        </Button>
        <h1 className="font-black text-slate-500 uppercase text-xl sm:text-3xl tracking-wide">
          LOBBY
        </h1>
        <div className="w-10 sm:w-20" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 gap-8 max-w-2xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
          <div className="flex-1 flex flex-col items-center gap-2 sm:gap-4">
            <div
              className={cn(
                "w-20 h-20 sm:w-40 sm:h-40 flex items-center justify-center p-2 transition-all",
              )}
            >
              <AvatarDisplay
                avatarId={normalizeAvatar(selectedAvatar || myPlayer?.avatar)}
                size={isMobile ? "lg" : "xl"}
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
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-linear-to-br from-green-500 to-green-600 border-4 border-white shadow-xl flex items-center justify-center">
              <Swords className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <p className="font-black text-lg sm:text-xl text-transparent bg-clip-text bg-linear-to-r from-green-500 to-green-600">
              VS
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center gap-2 sm:gap-4">
            <div
              className={cn(
                "w-24 h-24 sm:w-40 sm:h-40 flex items-center justify-center transition-all overflow-hidden",
              )}
            >
              {opponent ? (
                <AvatarDisplay
                  avatarId={normalizeAvatar(opponent.avatar)}
                  size={isMobile ? "lg" : "xl"}
                  showBorder={false}
                />
              ) : (
                <div className="text-blue-500 text-2xl sm:text-6xl font-black">?</div>
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
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center bg-white border-2 border-green-500 rounded-xl px-4 py-2 overflow-hidden">
                  <span className="text-base font-medium text-slate-500 truncate">
                    {getInviteLink(roomId)}
                  </span>
                </div>
                <Button variant="primary" size="default" onClick={handleCopyLink}>
                  {copiedLink ? "Link Copied" : "Copy Invite Link"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="w-full">
          {myPlayer?.isReady ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-green-600">
                <span className="font-bold uppercase text-lg sm:text-2xl">You're Ready!</span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-slate-500">
                {opponent?.isReady ? "Starting game..." : "Waiting for opponent to ready up..."}
              </p>
            </div>
          ) : (
            <Button
              variant="primary"
              className="w-full text-base sm:text-lg h-12 sm:h-14"
              onClick={handleReady}
              disabled={!opponent}
            >
              {opponent ? "Click to start!" : "Waiting for Opponent..."}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
