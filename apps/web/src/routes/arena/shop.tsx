import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/arena/shop')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/arena/shop"!</div>
}
