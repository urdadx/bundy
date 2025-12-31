import { useNavigate, useSearch } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { GameCard } from './game-card'
import planet01 from '@/assets/planets/planet01.png'
import planet02 from '@/assets/planets/planet02.png'
import planet03 from '@/assets/planets/planet03.png'
import planet04 from '@/assets/planets/planet04.png'
import planet05 from '@/assets/planets/planet05.png'
import planet06 from '@/assets/planets/planet06.png'

const WORLDS = [
  { name: 'Meadow', icon: planet01, id: 1 },
  { name: 'Relic', icon: planet02, id: 2 },
  { name: 'Volcano', icon: planet06, id: 3 },
  { name: 'Cyber', icon: planet04, id: 4 },
  { name: 'Void', icon: planet05, id: 5 },
  { name: 'Malyka', icon: planet03, id: 6 },

]

export function WorldSelector() {
  const navigate = useNavigate({ from: '/worlds' })
  const { world: selectedWorld } = useSearch({ from: '/worlds' })

  const handleSelect = (name: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        world: name,
      }),
    })
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-black text-slate-700 mb-8 uppercase tracking-widest">Choose your world</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full place-items-center">
        {WORLDS.map((world) => {
          const isSelected = selectedWorld === world.name

          return (
            <div key={world.name} className="relative group w-full max-w-50">
              <div className={cn(
                "absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border-2 transition-all",
                isSelected
                  ? "bg-green-500 border-green-600 text-white"
                  : "bg-white border-slate-200 text-slate-400"
              )}>
                World {world.id}
              </div>

              <GameCard
                depth={isSelected ? "4" : "8"}
                onClick={() => handleSelect(world.name)}
                className={cn(
                  "cursor-pointer flex flex-col items-center justify-center gap-4 transition-all hover:bg-slate-50 active:translate-y-1 active:border-b-4",
                  isSelected && "border-green-500 ring-2 ring-green-500/20 bg-green-50/30"
                )}
              >
                <img
                  src={world.icon}
                  alt={world.name}
                  className="w-24 h-24 drop-shadow-md select-none object-cover"
                />

                <span className={cn(
                  "text-sm font-black uppercase tracking-widest transition-colors",
                  isSelected ? "text-green-600" : "text-slate-500"
                )}>
                  {world.name}
                </span>
              </GameCard>
            </div>
          )
        })}
      </div>

      <div className="mt-12 w-full max-w-md">
        <Button
          variant="primary"
          size="lg"
          className="w-full text-xl h-16 shadow-xl"
          disabled={!selectedWorld}
          onClick={() => console.log("Navigating to game with:", selectedWorld)}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}