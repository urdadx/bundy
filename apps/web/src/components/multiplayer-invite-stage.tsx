import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, ArrowLeft, Swords, Link } from "lucide-react";
import { getInviteLink } from "@/lib/multiplayer/api";
import { AvatarDisplay } from "./avatar-selector";
import { useSession } from "@/lib/auth-client";

interface MultiplayerInviteStageProps {
  handleBack: () => void;
  roomId?: string | null;
  player1Avatar?: string;
  player2Avatar?: string;
}

export const MultiplayerInviteStage = ({
  handleBack,
  roomId,
  player1Avatar,
  player2Avatar,
}: MultiplayerInviteStageProps) => {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const gameCode = roomId || "------";
  const inviteLink = useMemo(() => (roomId ? getInviteLink(roomId) : ""), [roomId]);
  const hostAvatar = player1Avatar || (session?.user as any)?.avatar || "jack-avatar.png";

  const handleCopyCode = async () => {
    if (!roomId) return;
    try {
      await navigator.clipboard.writeText(gameCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyLink = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-1 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex-1 flex flex-col items-center gap-3">
          <div className="w-28 h-28 rounded-xl bg-linear-to-br from-blue-400 to-blue-600 border-4 border-blue-700 shadow-lg flex items-center justify-center p-2">
            <AvatarDisplay avatarId={hostAvatar} size="lg" showBorder={false} />
          </div>
          <div className="text-center">
            <p className="font-black text-slate-700 text-sm uppercase tracking-wide">
              {session?.user?.name || "Player 1"}
            </p>
            <p className="text-xs text-slate-500">You (Host)</p>
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

        <div className="flex-1 flex flex-col items-center gap-3">
          <div className="w-28 h-28 rounded-xl bg-linear-to-br from-red-400 to-red-600 border-4 border-red-700 shadow-lg flex items-center justify-center">
            {player2Avatar ? (
              <AvatarDisplay avatarId={player2Avatar} size="lg" showBorder={false} />
            ) : (
              <div className="text-white text-5xl font-black">?</div>
            )}
          </div>
          <div className="text-center">
            <p className="font-black text-slate-700 text-sm uppercase tracking-wide">Player 2</p>
            <p className="text-xs text-slate-500">Waiting...</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Room Code */}
        <div className="space-y-2">
          <p className="font-black text-slate-700 uppercase text-xs tracking-wide text-center">
            Room Code
          </p>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center justify-center bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3">
              <span className="text-2xl font-black text-slate-700 tracking-widest">{gameCode}</span>
            </div>
            <Button
              variant="default"
              size="icon"
              onClick={handleCopyCode}
              className="shrink-0 h-auto w-12"
            >
              {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Invite Link */}
        <div className="space-y-2">
          <p className="font-black text-slate-700 uppercase text-xs tracking-wide text-center">
            Or Share Invite Link
          </p>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 overflow-hidden">
              <span className="text-sm font-medium text-slate-500 truncate">
                {inviteLink || "Generating..."}
              </span>
            </div>
            <Button
              variant="default"
              size="icon"
              onClick={handleCopyLink}
              className="shrink-0 h-auto w-12"
            >
              {copiedLink ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Link className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-row gap-2">
        <Button variant="default" onClick={handleBack} className="flex w-full items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button variant="primary" className="w-full" disabled={!roomId}>
          Waiting for Player...
        </Button>
      </div>
    </div>
  );
};
