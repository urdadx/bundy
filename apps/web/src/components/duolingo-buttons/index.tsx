import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { ActiveButton } from "./active-button";
import { LockedButton } from "./locked-button";

type LearnButtonProps = {
  id: string;
  title: string;
  index: number;
  totalCount: number;
  percentage: number;
  locked?: boolean;
  current?: boolean;
  completed?: boolean;
  variant?: ComponentProps<typeof ActiveButton>["variant"];
};

export function LearnButton({
  id,
  title,
  index,
  totalCount,
  percentage,
  current,
  completed,
  variant = "primary",
}: LearnButtonProps) {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  // Smooth snake pattern: [0, 1, 2, 1, 0, -1, -2, -1]
  const pattern = [0, 0.8, 1.3, 0.8, 0, -0.8, -1.3, -0.8];
  const indentationLevel = pattern[cycleIndex];
  const leftPosition = indentationLevel * 50;

  const isLast = index === totalCount - 1;
  const isCheckPoint = (index + 1) % 5 === 0;
  const label = `Lesson ${index + 1}`;

  // Calculate next position for the connecting line
  const nextCycleIndex = (index + 1) % cycleLength;
  const nextIndentationLevel = pattern[nextCycleIndex];
  const deltaX = (nextIndentationLevel - indentationLevel) * 50;
  const deltaY = 110; // fixed vertical distance between centers

  const angle = Math.atan2(deltaX, deltaY) * (180 / Math.PI);
  const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        marginLeft: `${leftPosition}px`,
        height: `${deltaY}px`,
      }}
    >
      {!isLast && (
        <div
          className={cn(
            "absolute top-1/2 w-4 rounded-full -z-10",
            completed ? "bg-green-400" : "bg-slate-200",
          )}
          style={{
            height: `${lineLength}px`,
            left: "50%",
            transform: `translateX(-50%) rotate(${angle}deg)`,
            transformOrigin: "top center",
          }}
        />
      )}

      <div className="relative flex items-center justify-center h-full">
        {current || completed ? (
          <ActiveButton
            title={title}
            variant={isCheckPoint ? "golden" : variant}
            current={current}
            completed={completed}
            percentage={Number.isNaN(percentage) ? 0 : percentage}
            href={`/arena/playground?stageId=${id}`}
            hrefText={completed ? "Practice" : "Start"}
            prompt={completed ? "Level Up!" : label}
            ariaLabel={label}
          />
        ) : (
          <LockedButton
            icon={isCheckPoint ? "crown" : isLast ? "last" : "star"}
            title={title}
            prompt="Locked"
            ariaLabel="Locked Lesson"
          />
        )}
      </div>
    </div>
  );
}
