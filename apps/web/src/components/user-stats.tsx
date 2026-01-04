import { Button } from '@/components/ui/button'
import diamondIcon from '@/assets/icons/diamond.svg'
import xpIcon from '@/assets/xp.svg'
import medalIcon from '@/assets/medals/flatshadow_medal3.png'

type UserStatsProps = {
  points: number
  diamonds: number
  league: string
}

export function UserStats({ points, diamonds, league }: UserStatsProps) {
  return (
    <div className="flex items-center w-full justify-between">
      <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
        <img src={medalIcon} alt="League" className="w-7 h-7 object-contain" />
        <span className="text-lg font-semibold">{league}</span>
      </Button>
      <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
        <img src={xpIcon} alt="XP" className="w-6 h-6 object-cover" />
        <span className="text-lg font-semibold">{points}</span>
      </Button>
      <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
        <img src={diamondIcon} alt="Diamonds" className="w-6 h-6 object-cover" />
        <span className="text-lg font-semibold">{diamonds}</span>
      </Button>

    </div>
  )
}