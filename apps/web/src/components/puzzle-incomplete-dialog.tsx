import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import maleSad from "@/assets/characters/male-sad.png";
import femaleSad from "@/assets/characters/female-sad.png";
import RobotSad from "@/assets/characters/robot_sad.png";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { useSession } from "@/lib/auth-client";
import { normalizeAvatar } from "@/lib/avatars";
import { Link } from "@tanstack/react-router";
import { useSoundEffect } from "@/hooks/use-sound-effect";
import levelLostSound from "@/assets/sounds/level_lost.mp3";

interface PuzzleInCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReplayLevel: () => void;
}

export function PuzzleInCompletionDialog({
  open,
  onOpenChange,
  onReplayLevel,
}: PuzzleInCompletionDialogProps) {
  const { data: session } = useSession();
  useSoundEffect(levelLostSound, open);

  const normalizedAvatar = normalizeAvatar(session?.user?.image || "");

  let profileImage;

  if (normalizedAvatar.includes("rudeus-avatar.png")) {
    profileImage = RobotSad;
  } else if (normalizedAvatar.includes("jack-avatar.png")) {
    profileImage = maleSad;
  } else {
    profileImage = femaleSad;
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-200! p-4 border-none bg-white">
        <AlertDialogHeader className="flex flex-col mx-auto items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="w-48 h-48 mb-4 mx-auto"
          >
            <img
              src={profileImage}
              alt="Celebration"
              className="w-full h-full object-contain "
              loading="lazy"
            />
          </motion.div>

          <AlertDialogTitle className="text-3xl text-center font-black text-slate-700 uppercase tracking-tight">
            OOPSie...TIME UP!
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2 flex flex-row sm:flex-col gap-2">
          <Button variant="primary" className="w-full" onClick={onReplayLevel}>
            Try again
          </Button>
          <Link to="/arena/lessons">
            <Button variant="ghost" className="w-full text-slate-400 hover:text-slate-600">
              Go to Menu
            </Button>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
