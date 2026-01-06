import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { ActiveButton } from './active-button'
import { LockedButton } from './locked-button'

type LearnButtonProps = {
  id: number
  title: string
  index: number
  totalCount: number
  percentage: number
  locked?: boolean
  current?: boolean
  completed?: boolean
  variant?: ComponentProps<typeof ActiveButton>['variant']
}

export function LearnButton({
  id,
  title,
  index,
  totalCount,
  percentage,
  current,
  completed,
  variant = 'primary',
}: LearnButtonProps) {
  const cycleLength = 8
  const cycleIndex = index % cycleLength

  let indentationLevel
  if (cycleIndex <= 2) indentationLevel = cycleIndex
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex
  else indentationLevel = cycleIndex - 8

  const leftPosition = indentationLevel * 45

  const isLast = index === totalCount - 1
  const isCheckPoint = (index + 1) % 5 === 0
  const label = `Lesson ${index + 1}`

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        marginLeft: `${leftPosition}px`,
        marginBottom: '2.5rem'
      }}
    >
      {!isLast && (
        <div
          className={cn(
            "absolute top-16 h-12 w-1 border-r-4 border-dashed -z-10",
            completed ? "border-green-400" : "border-slate-200"
          )}
          style={{
            transform: `rotate(${indentationLevel * -5}deg)`,
            left: '50%'
          }}
        />
      )}

      <div className="relative">
        {current || completed ? (
          <ActiveButton
            title={title}
            variant={isCheckPoint ? 'secondary' : variant}
            current={current}
            completed={completed}
            percentage={Number.isNaN(percentage) ? 0 : percentage}
            href="/arena/playground"
            hrefText={completed ? 'Practice' : 'Start'}
            prompt={completed ? 'Level Up!' : label}
            ariaLabel={label}
          />
        ) : (
          <LockedButton
            icon={isCheckPoint ? 'crown' : isLast ? 'last' : 'star'}
            title={title}
            prompt="Locked"
            ariaLabel="Locked Lesson"
          />
        )}


      </div>
    </div>
  )
}