import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface HealthBarProps {
  value: number;
  max: number;
  label?: string;
  avatar?: string;
  className?: string;
}

export const HealthBar = ({ value, max, label, avatar, className }: HealthBarProps) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  // Determine color based on health percentage
  const getBarColor = () => {
    if (percentage > 50) return "#58cc02"; // green
    if (percentage > 20) return "#ffc800"; // yellow
    return "#ff4b4b"; // red
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-end mb-1 px-2">
        <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
          {label || "Health"}
        </span>
        <span className="text-sm font-black text-slate-500">
          {value} / {max}
        </span>
      </div>

      <div className="flex items-center">
        {avatar && (
          <div className="relative z-20 -mr-6 shrink-0">
            <div className="rounded-full bg-white p-1 shadow-[4px_0_8px_rgba(0,0,0,0.1)] border-2 border-slate-200">
              <Avatar className="size-12 border-2 border-white">
                <AvatarImage src={avatar} alt={label} />
                <AvatarFallback className="bg-slate-100 text-slate-500 font-bold">
                  {label?.charAt(0) || "H"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        )}

        {/* The Outer Container (The Groove) */}
        <div
          className={cn(
            "relative h-8 w-full rounded-2xl bg-neutral-200 border-b-4 border-neutral-300 overflow-hidden z-10",
            avatar && "pl-6",
          )}
        >
          {/* The Animated Fill */}
          <div
            className={cn(
              "relative h-full transition-all duration-500 ease-out",
              percentage < 20 && "animate-pulse-soft",
              !avatar && "rounded-l-xl",
            )}
            style={{
              width: `${percentage}%`,
              backgroundColor: getBarColor(),
            }}
          >
            {/* The 3D "Glint" - Lighter highlight on the top half */}
            <div className="absolute top-1 left-2 right-2 h-[25%] bg-white/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
