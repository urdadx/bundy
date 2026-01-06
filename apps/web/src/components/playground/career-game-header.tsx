import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { GameTimer } from './game-timer';
import { cn } from '@/lib/utils';
import jackAvatar from '@/assets/avatars/jack-avatar.png';
import xpIcon from '@/assets/icons/xp.svg';
import diamondIcon from '@/assets/icons/diamond.svg';

interface CareerGameHeaderProps {
  user: {
    name: string;
    avatar?: string;
    xp: number;
    diamonds: number;
  };
  timerDuration?: number;
  onTimerEnd?: () => void;
  className?: string;
}

export function CareerGameHeader({ user, timerDuration, onTimerEnd, className }: CareerGameHeaderProps) {
  return (
    <div className={cn("w-full bg-white border-2 border-b-4 border-slate-200 rounded-xl p-4", className)}>
      <div className="flex items-center justify-between gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-12 h-12 border-2 border-[#1cb0f6]">
              <AvatarImage src={user.avatar || jackAvatar} alt={user.name} />
              <AvatarFallback className="bg-[#ddf4ff] text-[#1cb0f6] font-bold">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-700 font-bold text-sm">{user.name}</span>
            <span className="text-[#1cb0f6] font-bold text-xs uppercase tracking-wider">Career Mode</span>
          </div>
        </div>

        {/* Timer */}
        <div className="flex-1 flex justify-center">
          <div className="bg-slate-100 px-6 py-1 rounded-lg border-2 border-slate-200">
            <GameTimer duration={timerDuration} onTimeUp={onTimerEnd} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img src={xpIcon} alt="XP" className="w-7 h-7 object-contain" />
            <div className="flex flex-col -space-y-1">
              <span className="text-lg font-black text-[#ffc800] leading-none">
                {user.xp.toLocaleString()}
              </span>

            </div>
          </div>

          <div className="flex items-center gap-2">
            <img src={diamondIcon} alt="Diamonds" className="w-7 h-7 object-contain" />
            <div className="flex flex-col -space-y-1">
              <span className="text-lg font-black text-[#1cb0f6] leading-none">
                {user.diamonds.toLocaleString()}
              </span>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
