import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { GameCard } from '@/components/game-card'
import maleIdle from '@/assets/characters/male-idle.png'
import multiplayerImg from '@/assets/characters/multiplayer.png'

export const Route = createFileRoute('/choose')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const handleChoose = (_mode: 'single' | 'multi') => {
    navigate({
      to: '/worlds',
      search: {
        world: 'Meadow',
      },
    } as any)
  }

  return (
    <div className="bg-[#fffcf2] min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <h1 className="text-2xl md:text-3xl font-black text-slate-700 mb-8 text-center uppercase tracking-widest">
          Choose Game Mode
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GameCard
            onClick={() => handleChoose('single')}
            className="cursor-pointer group flex flex-col items-center justify-center gap-4 py-6 hover:bg-slate-50 transition-all active:translate-y-1 active:border-b-4"
          >
            <div className="relative">
              <img
                src={maleIdle}
                alt="Single Player"
                className="w-32 h-32 object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-lg font-black uppercase tracking-widest text-slate-700 group-hover:text-blue-500 transition-colors">
              Single Player
            </span>
          </GameCard>

          <GameCard
            onClick={() => handleChoose('multi')}
            className="cursor-pointer group flex flex-col items-center justify-center gap-4 py-6 hover:bg-slate-50 transition-all active:translate-y-1 active:border-b-4"
          >
            <div className="relative">
              <img
                src={multiplayerImg}
                alt="Multiplayer"
                className="w-32 h-32 object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-lg font-black uppercase tracking-widest text-slate-700 group-hover:text-purple-500 transition-colors">
              Multiplayer
            </span>
          </GameCard>
        </div>
      </div>
    </div>
  )
}
