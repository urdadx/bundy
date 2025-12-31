import { GameSettingsUI } from '@/components/game-settings-ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/game-settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='bg-[#fffcf2]'>
      <GameSettingsUI />
    </div>
  )
}
