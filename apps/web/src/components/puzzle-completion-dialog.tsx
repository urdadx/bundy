import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import maleCheerImg from '@/assets/characters/male-cheer.png'
import diamondIcon from '@/assets/icons/diamond.svg'
import XpIcon from '@/assets/icons/xp.svg'
import { motion } from 'motion/react'
import { Button } from './ui/button'

interface PuzzleCompletionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  xpEarned: number
  diamondsEarned: number
  onNextStage: () => void
}

export function PuzzleCompletionDialog({
  open,
  onOpenChange,
  xpEarned,
  diamondsEarned,
  onNextStage,
}: PuzzleCompletionDialogProps) {
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
              src={maleCheerImg}
              alt="Celebration"
              className="w-full h-full object-contain "
              loading='lazy'
            />
          </motion.div>

          <AlertDialogTitle className="text-3xl text-center font-black text-slate-800 uppercase tracking-tight">
            Level Complete!
          </AlertDialogTitle>

          <AlertDialogDescription className="w-full">
            <div className="w-full grid grid-cols-2 gap-4 mt-3">

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center justify-center gap-1 bg-amber-50 rounded-2xl p-3 border-b-4 border-amber-200"
              >
                <img src={XpIcon} alt="XP" className="w-8 h-8 mb-1" />
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-amber-600">+</span>
                  <span className="text-2xl font-black text-amber-600">
                    {xpEarned}
                  </span>
                </div>
                <span className="text-xs font-black uppercase text-amber-400">Total XP</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center justify-center gap-1 bg-sky-50 rounded-2xl p-3 border-b-4 border-sky-200"
              >
                <img src={diamondIcon} alt="Diamond" className="w-8 h-8 mb-1" />
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-sky-600">+</span>
                  <span className="text-2xl font-black text-sky-600">
                    {diamondsEarned}
                  </span>
                </div>
                <span className="text-xs font-black uppercase text-sky-400">Diamonds</span>
              </motion.div>

            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2">
          <Button variant="primary" className="w-full mb-2" onClick={onNextStage}>
            Next Level
          </Button>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}