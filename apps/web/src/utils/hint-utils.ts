import type { WordSearchPuzzle } from "./word-search-generator";

type PlacedWord = WordSearchPuzzle["words"][0];

export interface HintCell {
  row: number;
  col: number;
}

export interface HintResult {
  word: string;
  cells: HintCell[];
  path: { start: { r: number; c: number }; end: { r: number; c: number } };
}

// Finds an unfound word from the puzzle and returns that word
// with its cell coordinates,or null if no unfound words

export function findUnfoundWord(
  placedWords: PlacedWord[],
  foundWords: Set<string>,
): HintResult | null {
  const unfoundWords = placedWords.filter((pw) => !foundWords.has(pw.word));

  if (unfoundWords.length === 0) {
    return null;
  }

  const selectedWord = unfoundWords[0];
  const cells = getCellsInWordPath(selectedWord);

  return {
    word: selectedWord.word,
    cells,
    path: {
      start: selectedWord.start,
      end: selectedWord.end,
    },
  };
}

// Calculates all cells in a word's path using breadth-first traversal

export function getCellsInWordPath(placedWord: PlacedWord): HintCell[] {
  const { start, end } = placedWord;
  const cells: HintCell[] = [];

  // Calculate direction vector
  const dr = end.r - start.r;
  const dc = end.c - start.c;

  // Normalize direction to unit vector
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  if (steps === 0) return cells;

  const stepR = dr / steps;
  const stepC = dc / steps;

  // Traverse from start to end, collecting all cells
  let currentR = start.r;
  let currentC = start.c;

  for (let i = 0; i <= steps; i++) {
    cells.push({
      row: Math.round(currentR),
      col: Math.round(currentC),
    });

    currentR += stepR;
    currentC += stepC;
  }

  return cells;
}
