export const getValidEndCell = (
  start: { r: number; c: number },
  current: { r: number; c: number },
) => {
  const rowDiff = current.r - start.r;
  const colDiff = current.c - start.c;

  const absRowDiff = Math.abs(rowDiff);
  const absColDiff = Math.abs(colDiff);

  // If it's horizontal, vertical, or a perfect diagonal
  if (rowDiff === 0 || colDiff === 0 || absRowDiff === absColDiff) {
    return current;
  }

  // Snap to the closest valid axis for a better "feel"
  if (absRowDiff > absColDiff * 2) return { r: current.r, c: start.c };
  if (absColDiff > absRowDiff * 2) return { r: start.r, c: current.c };

  // Snap to Diagonal
  const minDiff = Math.min(absRowDiff, absColDiff);
  return {
    r: start.r + (rowDiff > 0 ? minDiff : -minDiff),
    c: start.c + (colDiff > 0 ? minDiff : -minDiff),
  };
};

export function isCellInSelection(start: any, end: any, r: number, c: number) {
  if (!start || !end) return false;

  const minR = Math.min(start.r, end.r);
  const maxR = Math.max(start.r, end.r);
  const minC = Math.min(start.c, end.c);
  const maxC = Math.max(start.c, end.c);

  // Horizontal
  if (start.r === end.r && r === start.r) return c >= minC && c <= maxC;
  // Vertical
  if (start.c === end.c && c === start.c) return r >= minR && r <= maxR;
  // Diagonal
  if (Math.abs(start.r - end.r) === Math.abs(start.c - end.c)) {
    const rowInBounds = r >= minR && r <= maxR;
    const colInBounds = c >= minC && c <= maxC;
    const onDiagonal = Math.abs(r - start.r) === Math.abs(c - start.c);
    // Ensure it's the CORRECT diagonal direction
    const correctDir = (r - start.r) * (end.c - start.c) === (c - start.c) * (end.r - start.r);
    return rowInBounds && colInBounds && onDiagonal && correctDir;
  }
  return false;
}
