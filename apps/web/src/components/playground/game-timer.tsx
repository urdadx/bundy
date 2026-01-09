import { useGameTimer } from "@/hooks/use-game-timer";
import { cn } from "@/lib/utils";

interface GameTimerProps {
  duration?: number;
  onTimeUp?: () => void;
  autoStart?: boolean;
  className?: string;
}

export function GameTimer({
  duration = 600,
  onTimeUp,
  autoStart = true,
  className,
}: GameTimerProps) {
  const { formattedTime, timeLeft, isRunning, start } = useGameTimer({
    initialTime: duration,
    onTimeUp,
  });

  if (autoStart && !isRunning && timeLeft === duration) {
    start();
  }

  const isLowTime = timeLeft <= 60 && timeLeft > 0;
  const isTimeUp = timeLeft === 0;

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <span
        className={cn(
          "text-2xl font-bold",
          isTimeUp
            ? "text-red-500"
            : isLowTime
              ? "text-orange-400 animate-pulse"
              : "text-slate-700",
        )}
      >
        {formattedTime}
      </span>
    </div>
  );
}
