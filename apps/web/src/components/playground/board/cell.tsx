import React from "react";
import { cn } from "@/lib/utils";

interface CellProps {
  char: string;
  row: number;
  col: number;
  isSelected: boolean;
  isFound: boolean;
  isHighlighted: boolean;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onTouchStart: () => void;
  onTouchMove: (e: React.TouchEvent) => void;
  size?: number;
  theme?: "default" | "ocean" | "forest" | "sunset";
  customColor?: string;
}

const THEME_COLORS = {
  default: {
    base: "bg-slate-50 text-slate-700 border-slate-200",
    hover: "hover:bg-sky-100 hover:text-sky-600",
    selected: "bg-blue-200 text-blue-800 border-blue-300",
    found: "bg-green-200 text-green-800 border-green-300",
  },
  ocean: {
    base: "bg-cyan-50 text-cyan-900 border-cyan-200",
    hover: "hover:bg-cyan-200 hover:text-cyan-800",
    selected: "bg-blue-300 text-blue-900 border-blue-400",
    found: "bg-teal-300 text-teal-900 border-teal-400",
  },
  forest: {
    base: "bg-emerald-50 text-emerald-900 border-emerald-200",
    hover: "hover:bg-emerald-200 hover:text-emerald-800",
    selected: "bg-lime-300 text-lime-900 border-lime-400",
    found: "bg-green-400 text-green-900 border-green-500",
  },
  sunset: {
    base: "bg-orange-50 text-orange-900 border-orange-200",
    hover: "hover:bg-orange-200 hover:text-orange-800",
    selected: "bg-pink-300 text-pink-900 border-pink-400",
    found: "bg-rose-300 text-rose-900 border-rose-400",
  },
};

export function Cell({
  char,
  row,
  col,
  isSelected,
  isFound,
  isHighlighted,
  onMouseDown,
  onMouseEnter,
  onTouchStart,
  onTouchMove,
  size = 48,
  theme = "default",
  customColor,
}: CellProps) {
  const colors = THEME_COLORS[theme];

  const customStyles: React.CSSProperties =
    customColor && isFound
      ? {
          backgroundColor: `${customColor}40`, // 25% opacity
          color: customColor,
          borderColor: `${customColor}80`, // 50% opacity
        }
      : {};

  return (
    <div
      data-row={row}
      data-col={col}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(size * 0.4, 12),
        ...customStyles,
      }}
      className={cn(
        "flex items-center justify-center rounded-lg font-black transition-all cursor-pointer",
        "border-b-4 active:border-b-0 active:translate-y-1",
        "touch-none select-none",
        !customColor && (isFound ? colors.found : isSelected ? colors.selected : colors.base),
        customColor && isFound && "border-2",
        customColor && isSelected && colors.selected,
        customColor && !isFound && !isSelected && colors.base,
        !isFound && !isSelected && colors.hover,
        isHighlighted && "ring-2 ring-blue-400 ring-opacity-50",
      )}
    >
      {char}
    </div>
  );
}
