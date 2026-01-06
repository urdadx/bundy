import type { ComponentProps } from 'react'
import { LearnButton } from './duolingo-buttons'


type UnitProps = {
  unit: any
  lessons: (any & { id: string; completed: boolean })[]
  activeLessonId: string
  activeLessonPercentage: number
  variant?: ComponentProps<typeof LearnButton>['variant']
}

export function BattleMap({
  variant = 'primary',
  lessons,
  activeLessonId,
  activeLessonPercentage,
}: UnitProps) {

  const title = "The Great Battle of Words"

  return (
    <section className="space-y-10 py-10">
      <ul className="flex flex-col items-center">
        {lessons.map(({ id, completed }, idx, _lessons) => {
          return (
            <li key={id}>
              <LearnButton
                id={id}
                index={idx}
                totalCount={_lessons.length}
                title={title}
                current={id === activeLessonId}
                completed={completed}
                percentage={activeLessonPercentage}
                variant={variant}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
