import { cn } from "@/lib/utils";

export const DifficultyBar = ({ level }: { level: "easy" | "medium" | "hard" }) => {
  const bars = [1, 2, 3];
  const activeCount = level === "easy" ? 1 : level === "medium" ? 2 : 3;

  return (
    <div className="flex items-end gap-1 h-5">
      {bars.map((bar) => (
        <div
          key={bar}
          className={cn(
            "w-1.5 rounded-full transition-colors",
            bar <= activeCount ? "bg-green-500" : "bg-slate-200",
          )}
          style={{ height: `${bar * 33}%` }}
        />
      ))}
    </div>
  );
};
