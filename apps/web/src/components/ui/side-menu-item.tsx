import { Button } from '@/components/ui/button'
import { Link, useLocation, } from '@tanstack/react-router'
import heartIcon from '@/assets/icons/heart.svg'
import leaderboardIcon from '@/assets/icons/leaderboard.svg'
import learnIcon from '@/assets/icons/learn.svg'
import loaderIcon from '@/assets/icons/loader.svg'
import questsIcon from '@/assets/icons/quests.svg'
import shopIcon from '@/assets/icons/shop.svg'
import superIcon from '@/assets/icons/super.svg'
import xpIcon from '@/assets/icons/xp.svg'

const iconMap = {
  heart: heartIcon,
  leaderboard: leaderboardIcon,
  learn: learnIcon,
  loader: loaderIcon,
  quests: questsIcon,
  shop: shopIcon,
  super: superIcon,
  xp: xpIcon,
}

type SideMenuItemProps = {
  label: string
  icon: string
  href: any
  hideLabel?: boolean
}

export function SideMenuItem({ href, icon, label, hideLabel }: SideMenuItemProps) {
  const { pathname } = useLocation()
  const isActive = pathname === href
  return (
    <li>
      <Button
        variant={isActive ? 'active' : 'ghost'}
        className={`h-14 w-full justify-start py-2 border-b-2 sm:max-lg:w-auto sm:max-lg:px-2 ${isActive ? '' : 'border-transparent text-foreground/85'}`}
        asChild
      >
        <Link to={href} title={label} {...(hideLabel && { 'aria-label': label })}>
          <span className="relative block size-10">
            <img
              className="object-cover"
              src={iconMap[icon as keyof typeof iconMap]}
              alt={`${label} icon`}
            />
          </span>
          {!hideLabel && <span className="ml-5 truncate sm:max-lg:sr-only">{label}</span>}
        </Link>
      </Button>
    </li>
  )
}
