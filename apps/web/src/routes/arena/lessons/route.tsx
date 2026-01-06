// routes/arena/battles.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ArenaLayout } from '@/components/layouts/arena-layout'

export const Route = createFileRoute('/arena/lessons')({
  component: BattlesLayout,
})

function BattlesLayout() {
  return (
    <ArenaLayout sidebar={<ProgressSidebar />}>
      <Outlet />
    </ArenaLayout>
  )
}

function ProgressSidebar() {
  return (
    <div className="space-y-6 w-100">
      <div className="p-6 rounded-2xl border-2 border-slate-200 bg-white">
        <h2 className="text-xl font-black text-slate-700 uppercase mb-6 text-center">
          Your Progress
        </h2>
        <div className="space-y-4">
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[60%]" />
          </div>
          <p className="text-xs font-bold text-slate-400 text-center">
            60% TO NEXT WORLD
          </p>
        </div>
      </div>
    </div>
  )
}