import * as React from "react";
import { cn } from "@/lib/utils";

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** The thickness of the bottom border. Defaults to '8' (32px) */
  depth?: "2" | "4" | "8";
}

export const GameCard = React.forwardRef<HTMLDivElement, GameCardProps>(
  ({ className, children, depth = "8", ...props }, ref) => {
    const depthClasses = {
      "2": "border-b-2",
      "4": "border-b-4",
      "8": "border-b-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-3xl border-2 border-slate-200",
          depthClasses[depth],
          "p-4 md:p-6",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

GameCard.displayName = "GameCard";
