import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/arena/lessons/$lessonName/$level')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/arena/battles/$battleName/$level"!</div>
}
