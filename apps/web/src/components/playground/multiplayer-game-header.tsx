import { cn } from "@/lib/utils";
import { getAvatarSrc, normalizeAvatar } from "@/lib/avatars";

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
  timeRemaining?: number;
  onTimerEnd?: () => void;
  theme?: string;
}

export function MultiplayerGameHeader({ player1, player2, timeRemaining }: GameHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeRemaining !== undefined && timeRemaining <= 60;



  return (
    <div className="w-full bg-white border-2 border-b-4 border-slate-200 rounded-xl p-3 sm:p-5">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-[#1cb0f6] bg-[#ddf4ff] p-1 shrink-0">
            <img
              src={getAvatarSrc(normalizeAvatar(player1.avatar))}
              alt={player1.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-xs uppercase font-bold text-slate-600 leading-tight truncate">
              {player1.name}
            </p>
            <p className="text-2xl  font-black text-[#1cb0f6] leading-none text-center">
              {player1.score}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div
            className={cn(
              "bg-slate-100 px-4 py-1 rounded-lg border-2 border-slate-200 flex items-center gap-2",
              isLowTime && "border-red-300 bg-red-50",
            )}
          >
            <>
              <span
                className={cn(
                  "text-2xl font-bold",
                  isLowTime ? "text-red-500 animate-pulse" : "text-slate-700",
                )}
              >
                {formatTime(timeRemaining ?? 0)}
              </span>
            </>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <p className="text-xs truncate uppercase font-bold text-slate-600 leading-tight">
              {player2.name}
            </p>
            <p className="text-2xl font-black text-hp-red leading-none text-center self-center">
              {player2.score}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-hp-red bg-[#ffdfe0] p-1 shrink-0">
            <img
              src={getAvatarSrc(normalizeAvatar(player2.avatar))}
              alt={player2.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
