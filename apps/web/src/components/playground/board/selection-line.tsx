interface Point {
  r: number;
  c: number;
}

interface SelectionLineProps {
  start: Point;
  end: Point;
  cellSize: number;
  gap: number;
}

export function SelectionLine({ start, end, cellSize, gap }: SelectionLineProps) {
  // Calculate the distance and angle between start and end
  const dx = (end.c - start.c) * (cellSize + gap);
  const dy = (end.r - start.r) * (cellSize + gap);
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Calculate the absolute position of the start center
  const startX = start.c * (cellSize + gap) + cellSize / 2;
  const startY = start.r * (cellSize + gap) + cellSize / 2;

  return (
    <div
      className="absolute pointer-events-none z-20 transition-[width,transform] duration-75 ease-out"
      style={{
        top: `${startY}px`,
        left: `${startX}px`,
        width: `${distance + cellSize * 0.8}px`,
        height: `${cellSize * 0.8}px`,
        backgroundColor: "rgba(56, 189, 248, 0.3)",
        border: "2px solid rgba(14, 165, 233, 0.5)",
        borderRadius: "9999px",
        transformOrigin: "center left",
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      }}
    />
  );
}
