import { MoveLeftIcon, NotebookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type BattleBanner = {
  name: string;
  color: string;
  description?: string;
  stageId?: string;
  order?: number;
};

export function BattleBanner({ name, color, description, stageId, order }: BattleBanner) {
  const bgClass =
    {
      primary: "bg-[#58cc02]",
      secondary: "bg-[#1cb0f6]",
      danger: "bg-[#ff4b4b]",
      super: "bg-[#ce82ff]",
      highlight: "bg-[#ff9600]",
      golden: "bg-[#ffc800]",
      locked: "bg-[#e5e5e5]",
    }[color || "primary"] || "bg-[#58cc02]";

  return (
    <header
      className={cn(
        "flex w-full gap-3 items-center justify-between rounded-xl p-5 text-white",
        bgClass,
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <MoveLeftIcon onClick={() => window.history.back()} className="size-6" />
          <h3 className="text-xl font-bold ">
            World {order || 1}: <span className="capitalize">{name}</span>
          </h3>
        </div>
        {description && <p className="text-base sm:text-lg ">{description}</p>}
      </div>
      <Button variant="immersive" className="max-xl:px-4" size="lg" asChild disabled={!stageId}>
        <Link to="/arena/playground" search={{ stageId }}>
          <NotebookText className="" />
          <span className="ml-2 max-xl:hidden">Continue</span>
        </Link>
      </Button>
    </header>
  );
}
