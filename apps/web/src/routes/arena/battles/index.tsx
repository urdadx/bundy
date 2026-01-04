// routes/arena/battles.index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { WorldProgressCard } from '@/components/world-progress-card'

export const Route = createFileRoute('/arena/battles/')({
  component: BattlesIndex,
})

function BattlesIndex() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-black text-slate-700 uppercase tracking-tight">
        Battles
      </h1>

      <WorldProgressCard />
      <WorldProgressCard />
      <WorldProgressCard />
    </section>
  )
}