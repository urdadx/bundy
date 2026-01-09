import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import maleSad from "@/assets/characters/male-sad.png";
import femaleSad from "@/assets/characters/female-sad.png";
import { motion } from "motion/react";
import { Button } from "./ui/button";

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
  const characterGender = localStorage.getItem("characterGender") as string;

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
              src={characterGender === "male" ? maleSad : femaleSad}
              alt="Celebration"
              className="w-full h-full object-contain "
              loading="lazy"
            />
          </motion.div>

          <AlertDialogTitle className="text-3xl text-center font-black text-slate-700 uppercase tracking-tight">
            OOPSie...TIME UP!
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2">
          <Button variant="primary" className="w-full mb-2" onClick={onReplayLevel}>
            Try again
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
