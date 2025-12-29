import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/arena/learn')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(admin)/learn"!</div>
}
