import { Button } from '@/components/ui/button'
import { Link, useLocation, } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  isProfile?: boolean
  profileImage?: string
  profileInitials?: string
}

export function SideMenuItem({ href, icon, label, hideLabel, isProfile, profileImage, profileInitials }: SideMenuItemProps) {
  const { pathname } = useLocation()
  const isActive = pathname === href
  return (
    <div>
      <Button
        variant={isActive ? 'active' : 'ghost'}
        className={`h-14 w-full justify-start py-2 border-b-2 sm:max-lg:w-auto sm:max-lg:px-2 ${isActive ? '' : 'border-transparent text-foreground/85'} ${hideLabel ? 'h-12 w-12 justify-center border-none py-1 p-0' : ''}`}
        asChild
      >
        <Link to={href} title={label} {...(hideLabel && { 'aria-label': label })}>
          {isProfile ? (
            <Avatar size="default">
              <AvatarImage src={profileImage} alt={label} />
              <AvatarFallback className="border-2 rounded-full">
                {profileInitials || label.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <span className="relative block size-10">
              <img
                loading="lazy"
                className="object-cover"
                src={iconMap[icon as keyof typeof iconMap]}
                alt={`${label} icon`}
              />
            </span>
          )}
          {!hideLabel && <span className="ml-5 truncate sm:max-lg:sr-only">{label}</span>}
        </Link>
      </Button>
    </div>
  )
}
