import React, { useState, useEffect, useCallback } from "react";
import { getValidEndCell } from "@/utils/valid-search";
import { Cell } from "./cell";
import { Cursor } from "@/components/cursor";
import { getCellsInPath, checkWordMatch } from "@/utils/word-search-generator";
import type { Player, PuzzleData, FoundWord } from "@/lib/multiplayer/types";

interface MultiplayerWordSearchProps {
  puzzle: PuzzleData;
  players: Player[];
  myPlayerId: string;
  foundWords: FoundWord[];
  opponentCursor: { x: number; y: number } | null;
  onWordFound: (
    word: string,
    start: { r: number; c: number },
    end: { r: number; c: number },
  ) => void;
  onCursorMove: (x: number, y: number) => void;
  onCursorLeave: () => void;
  colorTheme?: "default" | "ocean" | "forest" | "sunset";
}

const PLAYER_COLORS = {
  host: "#1cb0f6",
  guest: "#ff4b4b",
};

export function MultiplayerWordSearch({
  puzzle,
  players,
  myPlayerId,
  foundWords,
  opponentCursor,
  onWordFound,
  onCursorMove,
  onCursorLeave,
  colorTheme = "default",
}: MultiplayerWordSearchProps) {
  const [startCell, setStartCell] = useState<{ r: number; c: number } | null>(null);
  const [currentCell, setCurrentCell] = useState<{ r: number; c: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  const gridSize = puzzle.grid.length;
  const gap = gridSize <= 10 ? 4 : 2;
  const padding = typeof window !== "undefined" && window.innerWidth < 768 ? 13 : 40;

  const myPlayer = players.find((p) => p.id === myPlayerId);
  const isHost = myPlayer?.isHost ?? false;
  const myColor = isHost ? PLAYER_COLORS.host : PLAYER_COLORS.guest;
  const opponentColor = isHost ? PLAYER_COLORS.guest : PLAYER_COLORS.host;
  const opponent = players.find((p) => p.id !== myPlayerId);

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
      // Send cursor position
      onCursorMove(c, r);

      if (isDragging && startCell) {
        setCurrentCell(getValidEndCell(startCell, { r, c }));
      }
    },
    [isDragging, startCell, onCursorMove],
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
        const newCell = getValidEndCell(startCell, { r: parseInt(row), c: parseInt(col) });
        setCurrentCell(newCell);
        onCursorMove(newCell.c, newCell.r);
      }
    },
    [isDragging, startCell, onCursorMove],
  );

  const handleSelectionEnd = useCallback(() => {
    if (!isDragging || !startCell || !currentCell) return;

    // Get words that haven't been found yet
    const foundWordSet = new Set(foundWords.map((w) => w.word));
    const remainingWords = puzzle.words.filter((w) => !foundWordSet.has(w.word));

    const match = checkWordMatch(
      puzzle.grid,
      startCell,
      currentCell,
      remainingWords.map((w) => ({
        word: w.word,
        start: w.start,
        end: w.end,
      })),
    );

    if (match) {
      onWordFound(match.word, startCell, currentCell);
    }

    setIsDragging(false);
    setStartCell(null);
    setCurrentCell(null);
  }, [isDragging, startCell, currentCell, puzzle, foundWords, onWordFound]);

  const handleMouseLeave = useCallback(() => {
    handleSelectionEnd();
    onCursorLeave();
  }, [handleSelectionEnd, onCursorLeave]);

  const getCellFoundInfo = useCallback(
    (r: number, c: number): { isFound: boolean; foundColor?: string } => {
      for (const found of foundWords) {
        const cells = getCellsInPath(found.start, found.end);
        const isInPath = cells.some((cell) => cell.r === r && cell.c === c);
        if (isInPath) {
          // Determine who found it
          const foundByMe = found.foundBy === myPlayerId;
          return {
            isFound: true,
            foundColor: foundByMe ? myColor : opponentColor,
          };
        }
      }
      return { isFound: false };
    },
    [foundWords, myPlayerId, myColor, opponentColor],
  );

  const isOpponentCursorAt = useCallback(
    (r: number, c: number): boolean => {
      if (!opponentCursor) return false;
      return opponentCursor.x === c && opponentCursor.y === r;
    },
    [opponentCursor],
  );

  return (
    <div className="flex items-center justify-center w-full h-full min-h-100 relative">
      <div
        className="bg-white rounded-xl lg:rounded-3xl border-2 lg:border-4 border-slate-200 shadow-sm sm:shadow-xl select-none touch-none relative"
        style={{ padding }}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleSelectionEnd}
        onTouchEnd={handleSelectionEnd}
      >
        <div
          className="grid relative"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
            gap: `${gap}px`,
          }}
        >
          {puzzle.grid.map((row, r) =>
            row.map((char, c) => {
              const foundInfo = getCellFoundInfo(r, c);
              const hasOpponentCursor = isOpponentCursorAt(r, c);

              return (
                <div key={`${r}-${c}`} className="relative">
                  <Cell
                    char={char}
                    row={r}
                    col={c}
                    isSelected={selectedCells.has(`${r}-${c}`)}
                    isFound={foundInfo.isFound}
                    isHighlighted={hasOpponentCursor}
                    onMouseDown={() => handleMouseDown(r, c)}
                    onMouseEnter={() => handleMouseEnter(r, c)}
                    onTouchStart={() => handleTouchStart(r, c)}
                    onTouchMove={handleTouchMove}
                    size={cellSize}
                    theme={colorTheme}
                    customColor={foundInfo.foundColor}
                  />
                  {/* Realtime opponent cursor */}
                  {hasOpponentCursor && (
                    <Cursor
                      color={opponentColor}
                      name={opponent?.name ?? "Opponent"}
                      className="absolute z-50 top-1/2 left-1/2 transition-all duration-200"
                    />
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
