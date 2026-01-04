import { WordSearch } from '@/components/playground/board/word-search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/arena/playground/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <WordSearch />
}
