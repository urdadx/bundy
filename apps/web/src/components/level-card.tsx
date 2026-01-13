import { cn } from "@/lib/utils";
import { MoveRight, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface LevelCardProps {
  number: number;
  title: string;
  status: "completed" | "current" | "locked";
  battleName: string;
  level: string;
}

export function LevelCard({ number, title, status, battleName, level }: LevelCardProps) {
  const isLocked = status === "locked";

  const content = (
    <>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "size-10 rounded-xl flex items-center justify-center font-black text-white shadow-[0_4px_0_rgba(0,0,0,0.2)]",
            status === "completed"
              ? "bg-green-500"
              : status === "current"
                ? "bg-sky-500"
                : "bg-slate-300",
          )}
        >
          {status === "completed" ? <Check className="size-6" /> : number}
        </div>

        <div className="text-left">
          <p
            className={cn(
              "font-black uppercase text-sm tracking-tight",
              status === "current" ? "text-sky-700" : "text-slate-600",
            )}
          >
            {title}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            {status === "completed"
              ? "Perfect Score!"
              : status === "current"
                ? "Ready to Start"
                : "Locked"}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "transition-transform group-hover:translate-x-1",
          status === "current" ? "text-sky-400" : "text-slate-300",
        )}
      >
        {isLocked ? "🔒" : <MoveRight />}
      </div>
    </>
  );

  if (isLocked) {
    return (
      <div
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group",
          "border-slate-200 bg-white opacity-60 grayscale cursor-not-allowed",
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      to="/arena/battles/$battleName/$level"
      params={{ battleName, level }}
      className={cn(
        "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group",
        status === "current"
          ? "border-sky-400 bg-sky-50 shadow-[0_4px_0_#bae6fd]"
          : "border-slate-200 bg-white",
      )}
    >
      {content}
    </Link>
  );
}
