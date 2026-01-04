import { NotebookText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

type BattleBanner = {
  title: string
  description: string
  color?: string
}

export function BattleBanner({ title, description, color }: BattleBanner) {
  const bgClass = {
    primary: 'bg-[#58cc02]',
    secondary: 'bg-[#1cb0f6]',
    danger: 'bg-[#ff4b4b]',
    super: 'bg-[#ce82ff]',
    highlight: 'bg-[#ff9600]',
    golden: 'bg-[#ffc800]',
    locked: 'bg-[#e5e5e5]',
  }[color || 'primary'] || 'bg-[#58cc02]'

  return (
    <header
      className={cn("flex w-full gap-2 items-center justify-between rounded-xl p-5 text-white", bgClass)}
    >
      <div className="space-y-1">
        <h3 className="text-2xl font-bold ">{title}</h3>
        <p className="text-xl font-semibold">{description}</p>
      </div>
      <Button variant="immersive" className="max-xl:px-4" size="lg" asChild>
        <Link to="/arena/battles">
          <NotebookText className="" />
          <span className="ml-2 max-xl:hidden">Continue</span>
        </Link>
      </Button>
    </header>
  )
}
