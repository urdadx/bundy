import type { ComponentProps } from 'react'
import { LearnButton } from './duolingo-buttons'
import { BattleBanner } from './battle-banner'


type UnitProps = {
  unit: any
  lessons: (any & { completed: boolean })[]
  // activeLesson: (LessonType & { unit: UnitType }) | null
  activeLessonId: number
  activeLessonPercentage: number
  variant?: ComponentProps<typeof LearnButton>['variant']
}

export function BattleMap({
  variant = 'primary',
  unit,
  lessons,
  activeLessonId,
  activeLessonPercentage,
}: UnitProps) {

  const title = "The Great Battle of Words"
  const description = "Master vocabulary and grammar to conquer"

  return (
    <section className="space-y-10 pb-16">
      <BattleBanner title={title} description={description} color={variant} />
      <ul className="flex flex-col items-center space-y-5">
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
