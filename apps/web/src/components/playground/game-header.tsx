import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { GameTimer } from './game-timer';
import { cn } from '@/lib/utils';
import jackAvatar from '@/assets/avatars/jack-avatar.png';
import marieAvatar from '@/assets/avatars/marie-avatar.png';
import rudeusAvatar from '@/assets/avatars/rudeus-avatar.png';

interface GameHeaderProps {
  player1: {
    score: number;
    name: string;
    avatar?: string;
    isCurrentTurn?: boolean;
  };
  player2: {
    score: number;
    name: string;
    avatar?: string;
    isCurrentTurn?: boolean;
  };
  timerDuration?: number;
  onTimerEnd?: () => void;
}

export function GameHeader({ player1, player2, timerDuration, onTimerEnd }: GameHeaderProps) {
  const totalScore = player1.score + player2.score;
  const player1Percentage = totalScore === 0 ? 50 : (player1.score / totalScore) * 100;

  return (
    <div className="w-full bg-white border-2 border-b-4 border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className={cn(
              "w-12 h-12 border-2",
              player1.isCurrentTurn ? "border-[#58cc02] ring-2 ring-[#58cc02]/30" : "border-[#1cb0f6]"
            )}>
              <AvatarImage src={player1.avatar || jackAvatar} alt={player1.name} />
              <AvatarFallback className="bg-[#ddf4ff] text-[#1cb0f6] font-bold">
                {player1.name}
              </AvatarFallback>
            </Avatar>
            {player1.isCurrentTurn && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#58cc02] rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-slate-700 font-bold text-sm">{player1.name}</span>
            <span className="text-[#1cb0f6] font-bold text-lg">{player1.score}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-center">
            <div className="bg-slate-100 px-4 py-1 rounded-lg border-2 border-slate-200">
              <GameTimer duration={timerDuration} onTimeUp={onTimerEnd} />
            </div>
          </div>

          <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="absolute left-0 top-0 h-full bg-linear-to-r from-[#1cb0f6] to-[#20c4ff] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${player1Percentage}%` }}
            />
            <div
              className="absolute right-0 top-0 h-full bg-linear-to-l from-hp-red to-[#ff6b6b] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${100 - player1Percentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-slate-700 font-bold text-sm">{player2.name}</span>
            <span className="text-hp-red font-bold text-lg">{player2.score}</span>
          </div>
          <div className="relative">
            <Avatar className={cn(
              "w-12 h-12 border-2",
              player2.isCurrentTurn ? "border-[#58cc02] ring-2 ring-[#58cc02]/30" : "border-hp-red"
            )}>
              <AvatarImage src={player2.avatar || marieAvatar} alt={player2.name} />
              <AvatarFallback className="bg-[#ffdfe0] text-hp-red font-bold">
                {player2.name}
              </AvatarFallback>
            </Avatar>
            {player2.isCurrentTurn && (
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#58cc02] rounded-full border-2 border-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
