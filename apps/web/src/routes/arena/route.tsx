import { SideMenu } from '@/components/ui/side-menu'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/arena')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <SideMenu />
    </>
  )
}
