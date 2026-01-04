import { BattleBanner } from '@/components/battle-banner'
import { GoBackHeader } from '@/components/go-back-header'
import { LevelCard } from '@/components/level-card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/arena/battles/$battleName/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { battleName } = Route.useParams()

  return (
    <div className="flex w-full gap-x-12">
      <div className="flex-1 space-y-5">

        <BattleBanner title="World 1: Nebula" color="primary" description='
          '/>

        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase text-slate-700">Select a Level</h2>
          <div className="grid grid-cols-1 gap-3">
            <LevelCard number={1} title="Basic Greetings" status="completed" battleName={battleName} level="1" />
            <LevelCard number={2} title="Common Animals" status="current" battleName={battleName} level="2" />
            <LevelCard number={3} title="Household Items" status="locked" battleName={battleName} level="3" />
          </div>
        </div>
      </div>
    </div>
  )
}
