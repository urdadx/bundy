import type { ReactNode } from "react";
import { UserStats } from "../user-stats";

interface ArenaLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export function ArenaLayout({ children, sidebar }: ArenaLayoutProps) {
  return (
    <div className="flex justify-center w-full min-h-screen">
      <div className="flex w-full max-w-6xl gap-6 px-4 sm:px-10 py-4">
        <main className="flex-1 flex flex-col gap-4 ">
          <div className="lg:hidden">
            <UserStats />
          </div>
          {children}
        </main>

        {sidebar && (
          <div className="hidden lg:flex w-110 pl-6 flex-col gap-5">
            <UserStats />
            <div className="sticky top-8 w-full flex justify-center">{sidebar}</div>
          </div>
        )}
      </div>
    </div>
  );
}
