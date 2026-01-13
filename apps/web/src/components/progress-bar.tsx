import { cn } from "@/lib/utils";
import xpIcon from "@/assets/icons/xp.svg";

const XPIcon = () => <img src={xpIcon} className="w-6 h-6" />;

interface ProgressBarProps {
  value: number;
  color?: string;
  showValue?: boolean;
  className?: string;
  flatEnd?: boolean;
  icon?: React.ReactNode;
}

export function ProgressBar({
  value,
  color = "bg-[#58cc02]",
  showValue = true,
  className,
  flatEnd = true,
  icon = <XPIcon />,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className="flex items-center">
      <div
        className={cn(
          "relative w-full h-3 overflow-hidden bg-black/15 border-b-2 border-white/10 shadow-inner rounded-full",
          className,
          flatEnd ? "rounded-r-none" : "rounded-r-full",
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-700 ease-out flex items-center justify-center relative rounded-l-none",
            color,
          )}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute top-0 left-0 w-full h-1/4 bg-white/20" />
          {showValue && percentage > 10 && !icon && (
            <span className="text-md font-black text-white italic drop-shadow-sm select-none z-10">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
      {icon && <div>{icon}</div>}
    </div>
  );
}
