import { useState } from 'react'
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { cn } from "@/lib/utils"
import { Button } from './ui/button'
import { GameCard } from './game-card'

const THEMES = [
  { id: 'animals', name: 'Animals', icon: '🐾' },
  { id: 'plants', name: 'Plants', icon: '🌵' },
  { id: 'cities', name: 'Cities', icon: '🏙️' },
  { id: 'countries', name: 'Countries', icon: '🌍' },
  { id: 'foods', name: 'Foods', icon: '🍕' },
  { id: 'space', name: 'Space', icon: '🚀' },
]

export const ThemeSelectionDialog = ({
  currentTheme = 'animals',
  onSelect
}: {
  currentTheme?: string,
  onSelect?: (id: string) => void
}) => {
  const [selected, setSelected] = useState(currentTheme)

  const handleSelect = (id: string) => {
    setSelected(id)
    onSelect?.(id)
  }

  return (
    <DialogContent className="sm:max-w-md bg-white border-none p-0 overflow-hidden">
      <div className="p-6 pb-2">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-black uppercase text-slate-700">
            Select Theme
          </DialogTitle>
          <DialogDescription className="font-bold text-lg text-slate-400">
            You will be quizzed based on this theme
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="max-h-100  px-6 ">
        <div className="grid grid-cols-2 gap-4 pb-4">
          {THEMES.map((theme) => {
            const isSelected = selected === theme.id

            return (
              <GameCard
                key={theme.id}
                depth={"4"}
                onClick={() => handleSelect(theme.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-6 transition-all cursor-pointer",
                  isSelected
                    ? "border-green-500 bg-green-50/50 ring-2 ring-green-500/20"
                    : "border-slate-200 hover:bg-slate-50"
                )}
              >
                <span className="text-4xl mb-3 drop-shadow-sm select-none">
                  {theme.icon}
                </span>
                <span className={cn(
                  "font-black uppercase tracking-wider text-xs",
                  isSelected ? "text-green-600" : "text-slate-500"
                )}>
                  {theme.name}
                </span>
              </GameCard>
            )
          })}
        </div>
      </div>

      <div className="p-6 pt-2 ">
        <Button variant="primary" className="w-full" size="lg">
          Save
        </Button>
      </div>
    </DialogContent>
  )
}