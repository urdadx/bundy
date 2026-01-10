// components/ui/side-menu.tsx
import { Link } from "@tanstack/react-router";
import { SideMenuItem } from "./side-menu-item";
import { SideMenuThemeButton } from "./side-menu-theme-button";

export function SideMenu() {
  return (
    <>
      <div className="hidden lg:flex flex-col justify-between w-64 border-r-2 pt-6 pb-4 bg-white">
        <nav className="flex flex-col gap-6 px-4">
          <Link to="/" className="focus-visible self-start rounded-xl">
            <span className="flex items-center gap-2 px-4">
              <span className="font-display text-primary-depth text-3xl font-bold">bundycrush</span>
            </span>
          </Link>

          <div className="flex flex-col gap-2">
            <SideMenuItem href="/arena/lessons" icon="learn" label="learn" />
            <SideMenuItem href="/arena/leaderboard" icon="leaderboard" label="Leaderboard" />
            <SideMenuItem href="/arena/shop" icon="shop" label="Shop" />
            <SideMenuItem href="/arena/profile" label="Profile" isProfile={true} />
          </div>
        </nav>

        <div className="border-t-2 px-4 pt-4">
          <SideMenuThemeButton />
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 py-2 flex justify-around z-50">
        <SideMenuItem href="/arena/lessons" icon="learn" label="home" hideLabel />
        <SideMenuItem href="/arena/leaderboard" icon="leaderboard" label="Leaderboard" hideLabel />
        <SideMenuItem href="/arena/quests" icon="quests" label="Quests" hideLabel />
        <SideMenuItem href="/arena/shop" icon="shop" label="Shop" hideLabel />
        <SideMenuItem href="/arena/profile" label="Profile" hideLabel isProfile={true} />
      </div>
    </>
  );
}
