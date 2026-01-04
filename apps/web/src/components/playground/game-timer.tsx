import { useGameTimer } from '@/hooks/use-game-timer';

interface GameTimerProps {
  duration?: number;
  onTimeUp?: () => void;
  autoStart?: boolean;
}

export function GameTimer({ duration = 600, onTimeUp, autoStart = true }: GameTimerProps) {
  const { formattedTime, timeLeft, isRunning, start, pause, reset } = useGameTimer({
    initialTime: duration,
    onTimeUp,
  });

  if (autoStart && !isRunning && timeLeft === duration) {
    start();
  }

  const isLowTime = timeLeft <= 60 && timeLeft > 0;
  const isTimeUp = timeLeft === 0;

  return (
    <div className="flex items-center justify-center ">
      <span
        className={`text-3xl font-bold  ${isTimeUp
          ? 'text-red-600'
          : isLowTime
            ? 'text-orange-500 animate-pulse'
            : 'text-slate-700'
          }`}
      >
        {formattedTime}
      </span>
    </div>
  );
}
