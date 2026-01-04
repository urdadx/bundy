import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { GameTimer } from './game-timer';

interface GameHeaderProps {
  player1: {
    score: number;
    name: string;
    avatar: string;
  };
  player2: {
    score: number;
    name: string;
    avatar: string;
  };
  timerDuration?: number;
  onTimerEnd?: () => void;
}

export function GameHeader({ player1, player2, timerDuration, onTimerEnd }: GameHeaderProps) {
  const totalScore = player1.score + player2.score;
  const player1Percentage = totalScore === 0 ? 50 : (player1.score / totalScore) * 100;
  const player2Percentage = totalScore === 0 ? 50 : (player2.score / totalScore) * 100;

  return (
    <div className="w-full px-4 p-0">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <Avatar className="w-10 h-10 border-2 border-blue-500">
            <AvatarImage src={player1.avatar} alt={player1.name} />
            <AvatarFallback>{player1.name[0]}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 relative h-4 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-linear-to-r from-blue-500 to-blue-400 transition-all duration-500 ease-out"
            style={{ width: `${player1Percentage}%` }}
          />

          <div
            className="absolute right-0 top-0 h-full bg-linear-to-l from-red-500 to-red-400 transition-all duration-500 ease-out"
            style={{ width: `${player2Percentage}%` }}
          />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-xl font-bold text-white bg-blue-400 px-1.5 py-0.5 rounded">

          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Avatar className="w-10 h-10 border-2 border-red-500">
            <AvatarImage src={player2.avatar} alt={player2.name} />
            <AvatarFallback>{player2.name[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <GameTimer duration={timerDuration} onTimeUp={onTimerEnd} />
    </div>
  );
}
