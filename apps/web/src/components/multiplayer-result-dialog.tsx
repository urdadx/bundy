import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AvatarDisplay } from "@/components/avatar-selector";
import { motion } from "motion/react";
import { useNavigate } from "@tanstack/react-router";
import { RotateCcw, LogOut, Loader2 } from "lucide-react";
import type { Player } from "@/lib/multiplayer/types";
import { normalizeAvatar } from "@/lib/avatars";
import trophy from "@/assets/rewards/trophy.png";
import handshake from "@/assets/rewards/handshake.png";
import sadBunny from "@/assets/rewards/sad.png";
import { useSoundEffect } from "@/hooks/use-sound-effect";
import levelCompletedSound from "@/assets/sounds/level_completed.mp3";
import levelLostSound from "@/assets/sounds/level_lost.mp3";

const PLAYER_COLORS = {
  host: "#1cb0f6",
  guest: "#ff4b4b",
} as const;

interface MultiplayerResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: "win" | "lose" | "draw";
  myScore: number;
  opponentScore: number;
  currentPlayer: Player | null;
  opponent: Player | null;
  isHost: boolean;
  onRematch: () => void;
  onExit: () => void;
  rematchRequestedBy: string | null;
  myPlayerId: string | null;
}

export function MultiplayerResultDialog({
  open,
  onOpenChange,
  result,
  myScore,
  opponentScore,
  currentPlayer,
  opponent,
  isHost,
  onRematch,
  rematchRequestedBy,
  myPlayerId,
}: MultiplayerResultDialogProps) {
  const navigate = useNavigate();
  const myColor = isHost ? PLAYER_COLORS.host : PLAYER_COLORS.guest;
  const opponentColor = isHost ? PLAYER_COLORS.guest : PLAYER_COLORS.host;

  const hasRequestedRematch = rematchRequestedBy === myPlayerId;
  const opponentRequestedRematch = rematchRequestedBy && rematchRequestedBy !== myPlayerId;

  useSoundEffect(levelCompletedSound, open && result === "win");
  useSoundEffect(levelLostSound, open && result === "lose");

  const getResultConfig = () => {
    switch (result) {
      case "win":
        return {
          title: "YOU WON",
          bgGradient: "bg-gradient-to-b from-yellow-50 to-amber-50",
          accentColor: "text-yellow-600",
          icon: trophy,
        };
      case "lose":
        return {
          title: "YOU LOST ",
          bgGradient: "bg-gradient-to-b from-slate-50 to-gray-50",
          accentColor: "text-slate-600",
          icon: sadBunny,
        };
      case "draw":
        return {
          title: "IT'S A DRAW",
          bgGradient: "bg-gradient-to-b from-blue-50 to-cyan-50",
          accentColor: "text-blue-600",
          icon: handshake,
        };
    }
  };

  const config = getResultConfig();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-200! p-4 border-none bg-white">
        <div className="">
          <AlertDialogHeader className="w-full justify-center">
            <AlertDialogTitle className="text-2xl sm:text-3xl uppercase text-center font-black text-slate-800 tracking-tight">
              {config.title}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex justify-center">
            <motion.img
              src={config.icon}
              alt="Trophy"
              className="w-32 h-32 sm:w-44 sm:h-44 "
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
            />
          </div>
        </div>

        <div className=" bg-white">
          <div className="flex items-center justify-center gap-6 sm:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <AvatarDisplay
                avatarId={normalizeAvatar(currentPlayer?.avatar)}
                size="md"
                showBorder={false}
              />

              <p className="text-xl sm:text-2xl font-black" style={{ color: myColor }}>
                {myScore}
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl sm:text-2xl font-black text-slate-300"
            >
              VS
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <AvatarDisplay
                avatarId={normalizeAvatar(opponent?.avatar)}
                size="md"
                showBorder={false}
              />

              <p className="text-xl sm:text-2xl font-black" style={{ color: opponentColor }}>
                {opponentScore}
              </p>
            </motion.div>
          </div>
        </div>

        {opponentRequestedRematch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mx-6 sm:mx-8"
          >
            <div className="p-3 sm:p-4 bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl text-center">
              <p className="text-sm sm:text-base font-bold text-green-700">
                {opponent?.name || "Opponent"} wants a rematch! 🔥
              </p>
            </div>
          </motion.div>
        )}

        <AlertDialogFooter className=" flex gap-3">
          <Button
            variant="default"
            size="lg"
            className="w-full text-base font-semibold"
            onClick={() => {
              onOpenChange(false);
              navigate({
                to: "/arena/lessons",
              });
            }}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Exit
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="w-full text-base font-semibold"
            onClick={onRematch}
            disabled={hasRequestedRematch}
          >
            {hasRequestedRematch ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Waiting...
              </>
            ) : opponentRequestedRematch ? (
              <>
                <RotateCcw className="w-5 h-5 mr-2" />
                Accept Rematch
              </>
            ) : (
              <>
                <RotateCcw className="w-5 h-5 mr-2" />
                Rematch
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
