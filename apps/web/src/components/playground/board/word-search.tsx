import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { getValidEndCell } from "@/utils/valid-search";
import { Cell } from "./cell";
import {
  generateWordSearch,
  getCellsInPath,
  checkWordMatch,
  type WordSearchConfig,
  type WordSearchPuzzle,
  type Theme,
  type Difficulty,
} from "@/utils/word-search-generator";
import type { HintResult } from "@/utils/hint-utils";

interface WordSearchProps {
  theme?: Theme;
  difficulty?: Difficulty;
  size?: number;
  words?: string[];
  onWordFound?: (word: string, remaining: number) => void;
  onPuzzleComplete?: () => void;
  onPuzzleGenerated?: (placedWords: string[]) => void;
  onPuzzleDataGenerated?: (
    placedWords: Array<{
      word: string;
      start: { r: number; c: number };
      end: { r: number; c: number };
    }>,
  ) => void;
  colorTheme?: "default" | "ocean" | "forest" | "sunset";
  hint?: HintResult | null;
}

export function WordSearch({
  theme = "animals",
  difficulty = "medium",
  size,
  words,
  onWordFound,
  onPuzzleComplete,
  onPuzzleGenerated,
  onPuzzleDataGenerated,
  colorTheme = "default",
  hint,
}: WordSearchProps) {
  const puzzle = useMemo<WordSearchPuzzle>(() => {
    const config: WordSearchConfig = { theme, difficulty, size: size || 0, words };
    return generateWordSearch(config);
  }, [theme, difficulty, size, words]);

  const onPuzzleGeneratedRef = useRef(onPuzzleGenerated);
  const onPuzzleDataGeneratedRef = useRef(onPuzzleDataGenerated);

  useEffect(() => {
    onPuzzleGeneratedRef.current = onPuzzleGenerated;
  }, [onPuzzleGenerated]);

  useEffect(() => {
    onPuzzleDataGeneratedRef.current = onPuzzleDataGenerated;
  }, [onPuzzleDataGenerated]);

  const [startCell, setStartCell] = useState<{ r: number; c: number } | null>(null);
  const [currentCell, setCurrentCell] = useState<{ r: number; c: number } | null>(null);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFoundWords(new Set());
    if (onPuzzleGeneratedRef.current) {
      const placedWords = puzzle.words.map((w) => w.word);
      onPuzzleGeneratedRef.current(placedWords);
    }
    if (onPuzzleDataGeneratedRef.current) {
      onPuzzleDataGeneratedRef.current(puzzle.words);
    }
  }, [puzzle]);

  const gridSize = puzzle.grid.length;
  const gap = gridSize <= 10 ? 4 : 2;
  const padding = typeof window !== "undefined" && window.innerWidth < 768 ? 12 : 40;

  const getCellSize = useCallback(() => {
    if (typeof window === "undefined") return 48;

    const isLargeScreen = window.innerWidth >= 1024;
    const maxWidth = isLargeScreen ? 700 : Math.min(window.innerWidth - 32, 800);
    const maxHeight = window.innerHeight - 100;
    const maxSize = Math.min(maxWidth, maxHeight);

    const totalGaps = gap * (gridSize - 1);
    const availableSpace = maxSize - padding * 2 - totalGaps;

    return Math.max(Math.floor(availableSpace / gridSize), 28);
  }, [gridSize, gap]);

  const [cellSize, _setCellSize] = useState(getCellSize);

  useEffect(() => {
    if (startCell && currentCell && isDragging) {
      const cells = getCellsInPath(startCell, currentCell);
      setSelectedCells(new Set(cells.map((c) => `${c.r}-${c.c}`)));
    } else {
      setSelectedCells(new Set());
    }
  }, [startCell, currentCell, isDragging]);

  const handleMouseDown = useCallback((r: number, c: number) => {
    setStartCell({ r, c });
    setCurrentCell({ r, c });
    setIsDragging(true);
  }, []);

  const handleMouseEnter = useCallback(
    (r: number, c: number) => {
      if (isDragging && startCell) {
        setCurrentCell(getValidEndCell(startCell, { r, c }));
      }
    },
    [isDragging, startCell],
  );

  const handleTouchStart = useCallback((r: number, c: number) => {
    setStartCell({ r, c });
    setCurrentCell({ r, c });
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !startCell) return;

      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      const row = element?.getAttribute("data-row");
      const col = element?.getAttribute("data-col");

      if (row && col) {
        setCurrentCell(getValidEndCell(startCell, { r: parseInt(row), c: parseInt(col) }));
      }
    },
    [isDragging, startCell],
  );

  const handleSelectionEnd = useCallback(() => {
    if (!isDragging || !startCell || !currentCell) return;

    const remainingWords = puzzle.words.filter((w) => !foundWords.has(w.word));
    const match = checkWordMatch(puzzle.grid, startCell, currentCell, remainingWords);

    if (match) {
      const newFoundWords = new Set(foundWords);
      newFoundWords.add(match.word);
      setFoundWords(newFoundWords);

      onWordFound?.(match.word, puzzle.words.length - newFoundWords.size);

      if (newFoundWords.size === puzzle.words.length) {
        onPuzzleComplete?.();
      }
    }

    setIsDragging(false);
    setStartCell(null);
    setCurrentCell(null);
  }, [isDragging, startCell, currentCell, puzzle, foundWords, onWordFound, onPuzzleComplete]);

  const isCellInFoundWord = useCallback(
    (r: number, c: number): boolean => {
      return puzzle.words.some((word) => {
        if (!foundWords.has(word.word)) return false;
        const cells = getCellsInPath(word.start, word.end);
        return cells.some((cell) => cell.r === r && cell.c === c);
      });
    },
    [puzzle.words, foundWords],
  );

  const isCellInHint = useCallback(
    (r: number, c: number): boolean => {
      if (!hint) return false;
      return hint.cells.some((cell) => cell.row === r && cell.col === c);
    },
    [hint],
  );

  return (
    <div className="flex items-center justify-center w-full h-full min-h-100">
      <div
        className="bg-white rounded-3xl border-4 border-slate-200 shadow-sm sm:shadow-xl  select-none touch-none"
        style={{ padding }}
        onMouseLeave={handleSelectionEnd}
        onMouseUp={handleSelectionEnd}
        onTouchEnd={handleSelectionEnd}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
            gap: `${gap}px`,
          }}
        >
          {puzzle.grid.map((row, r) =>
            row.map((char, c) => (
              <Cell
                key={`${r}-${c}`}
                char={char}
                row={r}
                col={c}
                isSelected={selectedCells.has(`${r}-${c}`)}
                isFound={isCellInFoundWord(r, c)}
                isHighlighted={isCellInHint(r, c)}
                onMouseDown={() => handleMouseDown(r, c)}
                onMouseEnter={() => handleMouseEnter(r, c)}
                onTouchStart={() => handleTouchStart(r, c)}
                onTouchMove={handleTouchMove}
                size={cellSize}
                theme={colorTheme}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}
