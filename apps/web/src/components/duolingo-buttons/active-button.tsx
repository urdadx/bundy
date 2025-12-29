
import { type ComponentProps, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { ButtonBase } from './button-base'
import { CurrentButton } from './current-buttons'
import { Link } from '@tanstack/react-router'
import { Popover as BasePopover } from "@radix-ui/react-popover";

type RenderTriggerProps = {
  variant: ComponentProps<typeof ButtonBase>['variant']
  current?: boolean
  completed?: boolean
  percentage?: number
  ariaLabel?: string
}

const renderTrigger = ({
  percentage,
  current,
  completed,
  variant,
  ariaLabel,
}: RenderTriggerProps) => {
  if (completed) {
    return (
      <ButtonBase
        icon={variant === 'golden' ? 'crown' : 'check'}
        variant={variant}
        aria-label="Completed Lesson"
      />
    )
  }
  if (current) {
    return (
      <CurrentButton icon="star" percentage={percentage} variant={variant} ariaLabel={ariaLabel} />
    )
  }
}

type ActiveButtonContentProps = {
  title: string
  prompt: string
  href: any
  hrefText: string
  variant: ComponentProps<typeof ButtonBase>['variant']
}

function ActiveButtonContent({ variant, title, prompt, href, hrefText }: ActiveButtonContentProps) {
  return (
    <div className="p-2">
      <h3 className="mb-2 text-xl font-bold" style={{ color: `hsl(var(--${variant}))` }}>
        {title}
      </h3>
      <p className="mb-3 text-lg">{prompt}</p>
      <Button variant={variant} className="w-full" asChild>
        <Link to={href}>{hrefText}</Link>
      </Button>
    </div>
  )
}

type ActiveButtonProps = RenderTriggerProps & ActiveButtonContentProps

export function ActiveButton({
  title,
  prompt,
  variant,
  current,
  completed,
  percentage,
  href,
  hrefText,
  ariaLabel,
}: ActiveButtonProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 640px)')

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          {renderTrigger({ variant, current, completed, percentage, ariaLabel })}
        </PopoverTrigger>
        <PopoverContent className="border-2 rounded-lg shadow-none">
          <ActiveButtonContent
            variant={variant}
            title={title}
            href={href}
            hrefText={hrefText}
            prompt={prompt}
          />

        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {renderTrigger({ variant, current, completed, percentage, ariaLabel })}
      </DrawerTrigger>
      <DrawerContent>
        <ActiveButtonContent
          variant={variant}
          title={title}
          href={href}
          hrefText={hrefText}
          prompt={prompt}
        />
      </DrawerContent>
    </Drawer>
  )
}
