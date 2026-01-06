import { BattleMap } from '@/components/battle-map'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/arena/battles/$battleName/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { battleName } = Route.useParams();

  const dummyUnit = {
    id: 1,
    title: "Introduction to Words",
    description: "Learn basic vocabulary"
  };

  const dummyLessons = [
    { id: 1, title: "Lesson 1", completed: true },
    { id: 2, title: "Lesson 2", completed: true },
    { id: 3, title: "Lesson 3", completed: false },
    { id: 4, title: "Lesson 4", completed: false },
    { id: 5, title: "Lesson 5", completed: false },
  ];

  return (
    <div className="flex w-full gap-x-12">
      <div className="flex-1 space-y-5">
        <BattleMap
          unit={dummyUnit}
          lessons={dummyLessons}
          activeLessonId={3}
          activeLessonPercentage={45}
          variant="primary"
        />
      </div>
    </div>
  )
}
