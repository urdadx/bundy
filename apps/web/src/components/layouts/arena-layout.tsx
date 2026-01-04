import type { ReactNode } from 'react'
import { UserStats } from '../user-stats'

interface ArenaLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
}

export function ArenaLayout({ children, sidebar }: ArenaLayoutProps) {
  return (
    <div className="flex justify-center w-full min-h-screen">
      <div className="flex w-full max-w-5xl gap-6 px-6 py-4">
        <main className="flex-1 flex flex-col gap-4 ">
          {children}
        </main>

        {sidebar && (
          <div className="hidden lg:flex w-96 pl-10 flex-col gap-5">
            <UserStats points={134} diamonds={56} league={"Silver"} />
            <div className="sticky top-8 w-full flex justify-center">
              {sidebar}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}