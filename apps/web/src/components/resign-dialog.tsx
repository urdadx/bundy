import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import maleSad from "@/assets/characters/male-sad.png";
import RobotSad from "@/assets/characters/robot_sad.png";
import femaleSad from "@/assets/characters/female-sad.png";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { useSession } from "@/lib/auth-client";
import { normalizeAvatar } from "@/lib/avatars";

interface ResignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isMultiplayer?: boolean;
}

export function ResignDialog({ open, onOpenChange, onConfirm }: ResignDialogProps) {
  const { data: session } = useSession();

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
      <AlertDialogContent className="sm:max-w-md! w-200! p-3 sm:p-4 border-none bg-white">
        <AlertDialogHeader className="flex flex-col mx-auto items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="w-32 h-32 sm:w-48 sm:h-48 mb-4 mx-auto"
          >
            <img
              src={profileImage}
              alt="Sad Character"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </motion.div>

          <AlertDialogTitle className="text-2xl sm:text-3xl text-center font-black text-slate-700 uppercase tracking-tight">
            ARE YOU SURE?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex flex-col gap-2 sm:flex-col">
          <Button variant="primary" className="w-full" onClick={onConfirm}>
            Yes, Quit
          </Button>
          <Button
            variant="ghost"
            className="w-full text-slate-400 hover:text-slate-600"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
