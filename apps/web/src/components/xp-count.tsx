import { cn } from "@/lib/utils";
import xpIcon from "@/assets/xp.svg";

interface XPCountProps {
  count: number;
  className?: string;
}

export const XPCount = ({ count, className }: XPCountProps) => {
  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border-2 border-b-4 border-slate-200 hover:bg-slate-50 transition-colors cursor-default w-fit", className)}>
      <img src={xpIcon} alt="XP" className="w-7 h-7 object-contain" />
      <div className="flex flex-col -space-y-1">
        <span className="text-lg font-black text-[#ffc800] leading-none">
          {count.toLocaleString()}
        </span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">
          Total XP
        </span>
      </div>
    </div>
  );
};
