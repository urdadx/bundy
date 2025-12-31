import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { DifficultyBar } from './difficulty-bar'
import { GameCard } from './game-card'
import { Dialog, DialogTrigger } from './ui/dialog'
import { ThemeSelectionDialog } from './theme-selection-dialog'

export function GameSettingsUI() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-md mx-auto p-4 ">
      <h1 className="text-3xl font-black text-slate-700 uppercase tracking-widest mb-8">
        Game Settings
      </h1>

      <GameCard className="w-full p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-black text-slate-700 uppercase text-sm tracking-wide">Difficulty</p>
            <DifficultyBar level={difficulty} />
          </div>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map((d) => (
              <Button
                key={d}
                variant="ghost"
                size="sm"
                onClick={() => setDifficulty(d)}
                className={cn(
                  "uppercase font-bold text-xs",
                  difficulty === d ? "text-green-600 bg-green-50" : "text-slate-400"
                )}
              >
                {d}
              </Button>
            ))}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Theme Selection */}
        <div className="flex items-center justify-between">
          <p className="font-black text-slate-700 uppercase text-sm tracking-wide">Theme</p>
          <Dialog>
            <DialogTrigger >
              <Button variant="ghost" className="font-bold text-slate-500 hover:text-primary">
                🐶 Animals
              </Button>
            </DialogTrigger>
            <ThemeSelectionDialog />
          </Dialog>
        </div>

        {/* Game Sound Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="font-black text-slate-700 uppercase text-sm tracking-wide">Game Sound</p>
            <p className="text-xs text-slate-400 font-bold">SFX & Voiceovers</p>
          </div>
          <Switch defaultChecked />
        </div>

        {/* Game Music Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="font-black text-slate-700 uppercase text-sm tracking-wide">Game Music</p>
            <p className="text-xs text-slate-400 font-bold">Background Melodies</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="pt-4">
          <Button variant="primary" size="lg" className="w-full h-16 text-xl shadow-xl">
            Start Game
          </Button>
        </div>
      </GameCard>

      <p className="mt-6 text-xs font-bold text-slate-300 uppercase tracking-widest">
        Bundy is waiting for your command
      </p>
    </div>
  )
}