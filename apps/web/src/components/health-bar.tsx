import { cn } from "@/lib/utils";

interface HealthBarProps {
  value: number;
  max: number;
  label?: string;
  className?: string;
}

export const HealthBar = ({ value, max, label, className }: HealthBarProps) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  // Determine color based on health percentage
  const getBarColor = () => {
    if (percentage > 50) return "#58cc02"; // green
    if (percentage > 20) return "#ffc800"; // yellow
    return "#ff4b4b"; // red
  };

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="flex justify-between items-end px-1">
        <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
          {label || "Health"}
        </span>
        <span className="text-sm font-black text-slate-500">
          {value} / {max}
        </span>
      </div>

      {/* The Outer Container (The Groove) */}
      <div className="relative h-6 w-full rounded-2xl bg-neutral-200 border-b-4 border-neutral-300">

        {/* The Animated Fill */}
        <div
          className={cn(
            "relative h-full rounded-2xl transition-all duration-500 ease-out",
            percentage < 20 && "animate-pulse-soft"
          )}
          style={{
            width: `${percentage}%`,
            backgroundColor: getBarColor()
          }}
        >
          {/* The 3D "Glint" - Lighter highlight on the top half */}
          <div className="absolute top-1 left-2 right-2 h-[25%] bg-white/30 rounded-full" />
        </div>
      </div>
    </div>
  );
};