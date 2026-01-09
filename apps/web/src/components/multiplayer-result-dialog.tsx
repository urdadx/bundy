import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AvatarDisplay } from "@/components/avatar-selector";
import { motion } from "motion/react";
import { Trophy, Swords, HandshakeIcon, Crown, RotateCcw, LogOut, Loader2 } from "lucide-react";
import type { Player } from "@/lib/multiplayer/types";

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
  onExit,
  rematchRequestedBy,
  myPlayerId,
}: MultiplayerResultDialogProps) {
  const myColor = isHost ? PLAYER_COLORS.host : PLAYER_COLORS.guest;
  const opponentColor = isHost ? PLAYER_COLORS.guest : PLAYER_COLORS.host;

  const hasRequestedRematch = rematchRequestedBy === myPlayerId;
  const opponentRequestedRematch = rematchRequestedBy && rematchRequestedBy !== myPlayerId;

  const getResultConfig = () => {
    switch (result) {
      case "win":
        return {
          icon: <Crown className="w-12 h-12 text-yellow-500" />,
          title: "Victory!",
          subtitle: "You crushed it! 🎉",
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-300",
        };
      case "lose":
        return {
          icon: <Swords className="w-12 h-12 text-slate-400" />,
          title: "Defeat",
          subtitle: "Better luck next time!",
          bgColor: "bg-slate-100",
          borderColor: "border-slate-300",
        };
      case "draw":
        return {
          icon: <HandshakeIcon className="w-12 h-12 text-blue-500" />,
          title: "It's a Draw 🤝",
          subtitle: "Evenly matched! ",
          bgColor: "bg-blue-100",
          borderColor: "border-blue-300",
        };
    }
  };

  const config = getResultConfig();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full! max-w-lg! p-6 border-none bg-white overflow-hidden">
        <AlertDialogHeader className="w-full justify-center">
          <AlertDialogTitle className="text-3xl uppercase text-center font-black text-slate-800 tracking-tight">
            {config.title}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 text-center"
            >
              <div className="relative inline-block">
                <AvatarDisplay
                  avatarId={currentPlayer?.avatar || "avatar1"}
                  size="lg"
                  borderColor={myColor}
                />
                {result === "win" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-2 -right-2"
                  >
                    <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-200" />
                  </motion.div>
                )}
              </div>
              <p className="mt-2 text-center font-bold text-slate-700 truncate max-w-24 mx-auto">
                {currentPlayer?.name || "You"}
              </p>
              <motion.p
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-3xl font-black"
                style={{ color: myColor }}
              >
                {myScore}
              </motion.p>
            </motion.div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-lg font-black text-slate-400">VS</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 text-center"
            >
              <div className="relative inline-block">
                <AvatarDisplay
                  avatarId={opponent?.avatar || "avatar1"}
                  size="lg"
                  borderColor={opponentColor}
                />
                {result === "lose" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-2 -right-2"
                  >
                    <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-200" />
                  </motion.div>
                )}
              </div>
              <p className="mt-2 text-center font-bold text-slate-700 truncate max-w-24 mx-auto">
                {opponent?.name || "Opponent"}
              </p>
              <motion.p
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-3xl font-black"
                style={{ color: opponentColor }}
              >
                {opponentScore}
              </motion.p>
            </motion.div>
          </div>
        </div>

        {opponentRequestedRematch && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 p-3 bg-green-50 border border-green-200 rounded-xl text-center"
          >
            <p className="text-sm font-medium text-green-700">
              {opponent?.name || "Opponent"} wants a rematch! 🔥
            </p>
          </motion.div>
        )}

        <AlertDialogFooter className="p-6 pt-4 flex gap-2">
          <Button variant="default" className="w-full" onClick={onExit}>
            <LogOut className="w-4 h-4 mr-2" />
            Exit
          </Button>
          <Button
            variant="primary"
            className="w-full"
            onClick={onRematch}
            disabled={hasRequestedRematch}
          >
            {hasRequestedRematch ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Waiting...
              </>
            ) : opponentRequestedRematch ? (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Accept Rematch
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Rematch
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
