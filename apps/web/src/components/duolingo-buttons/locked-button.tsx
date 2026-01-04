import type { ComponentProps } from 'react'
import { Popover, PopoverContent, PopoverTrigger, Arrow } from '@radix-ui/react-popover'
import { Button } from '@/components/ui/button'
import { ButtonBase } from './button-base'

type LockedButtonProps = {
  title: string
  prompt: string
  icon: ComponentProps<typeof ButtonBase>['icon']
  ariaLabel?: string
}

export function LockedButton({
  icon,
  title,
  prompt,
  ariaLabel = 'Locked Lesson',
}: LockedButtonProps) {
  return (
    <Popover>
      <PopoverTrigger >
        <ButtonBase icon={icon} variant="locked" aria-label={ariaLabel} />
      </PopoverTrigger>
      <PopoverContent className="border-2 p-0 text-disabled-foreground shadow-none">
        <div className="space-y-2 rounded-inherit bg-disabled/30 p-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-lg">{prompt}</p>
          <Button className="w-full" disabled>
            Locked
          </Button>
        </div>
        <Arrow className="fill-border" />
      </PopoverContent>
    </Popover>
  )
}
