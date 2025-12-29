import { SideMenuThemeButton } from '@/components/ui/side-menu-button'
import { Link } from '@tanstack/react-router'
import { SideMenuItem } from './side-menu-item'

export function SideMenu() {
  return (
    <div className="flex h-screen flex-col justify-between pt-6 w-64 border-r-2 pb-4 sm:max-lg:w-20 sm:max-lg:pb-6">
      <nav className="flex flex-col gap-6 px-4 sm:max-lg:px-2">
        <Link
          href="/learn"
          className="focus-visible self-start rounded-xl max-sm:ml-4 sm:max-lg:self-center lg:ml-4" to={'.'}        >
          <span className="hidden sm:max-lg:block">
            <img src="logo" alt="bundy-logo" />
          </span>
          <span className="sm:max-lg:hidden">
            <span className="font-display text-3xl font-bold -tracking-wide text-primary">
              Bundy
            </span>
          </span>
        </Link>
        <ul className="flex flex-col gap-y-2">
          <SideMenuItem href="/arena/learn" icon="learn" label="Learn" />
          <SideMenuItem href="/arena/leaderboard" icon="leaderboard" label="Leaderboard" />
          <SideMenuItem href="/arena/quests" icon="quests" label="Quests" />
          <SideMenuItem href="/arena/shop" icon="shop" label="Shop" />
        </ul>
      </nav>
      <div className="space-y-2 border-t-2 px-4 pb-2 pt-2 sm:max-lg:px-2">
        <SideMenuThemeButton />
      </div>
    </div>
  )
}
