import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { getValidEndCell } from '@/utils/valid-search'
import { Cell } from './cell'
import { WordList } from './word-list'
import { GameHeader } from '../game-header'
import { AvatarStage } from '../players/avatar-stage'
import {
  generateWordSearch,
  getCellsInPath,
  checkWordMatch,
  type WordSearchConfig,
  type WordSearchPuzzle,
  type Theme,
  type Difficulty
} from '@/utils/word-search-generator'
import maleIdleImage from '@/assets/characters/male-idle.png'
import femaleIdleImage from '@/assets/characters/female-idle.png'
import backgroundCastles from '@/assets/background/backgroundEmpty.png'

interface WordSearchProps {
  theme?: Theme;
  difficulty?: Difficulty;
  size?: number;
  onWordFound?: (word: string, remaining: number) => void;
  onPuzzleComplete?: () => void;
  colorTheme?: 'default' | 'ocean' | 'forest' | 'sunset';
  showWordList?: boolean;
}

export function WordSearch({
  theme = 'animals',
  difficulty = 'medium',
  size,
  onWordFound,
  onPuzzleComplete,
  colorTheme = 'default',
  showWordList = true
}: WordSearchProps) {
  const puzzle = useMemo<WordSearchPuzzle>(() => {
    const config: WordSearchConfig = {
      theme,
      difficulty,
      size: size || 0
    };
    return generateWordSearch(config);
  }, [theme, difficulty, size]);

  const [startCell, setStartCell] = useState<{ r: number; c: number } | null>(null);
  const [currentCell, setCurrentCell] = useState<{ r: number; c: number } | null>(null);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  const [player1HP, setPlayer1HP] = useState(100);
  const [player2HP, setPlayer2HP] = useState(100);
  const [player1Message, setPlayer1Message] = useState<string | undefined>();
  const [player2Message, setPlayer2Message] = useState<string | undefined>();

  useEffect(() => {

    const timer = setTimeout(() => {
      setPlayer1Message(undefined);
      setPlayer2Message(undefined);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const gridSize = puzzle.grid.length;

  const getCellSize = () => {
    const reservedHeight = 220;
    const reservedWidth = 32;
    const maxGridHeight = typeof window !== 'undefined' ? window.innerHeight - reservedHeight : 500;
    const maxGridWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth - reservedWidth, 600) : 500;
    const maxGridSize = Math.min(maxGridHeight, maxGridWidth);
    const gap = gridSize <= 10 ? 4 : 2;
    const totalGap = gap * (gridSize - 1);
    const cellSize = Math.floor((maxGridSize - totalGap - 32) / gridSize);
    return Math.max(cellSize, 20);
  };

  const [cellSize, setCellSize] = useState(getCellSize);
  const gap = gridSize <= 10 ? 4 : 2;

  useEffect(() => {
    const handleResize = () => setCellSize(getCellSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gridSize]);

  useEffect(() => {
    if (startCell && currentCell && isDragging) {
      const cells = getCellsInPath(startCell, currentCell);
      const cellSet = new Set(cells.map(c => `${c.r}-${c.c}`));
      setSelectedCells(cellSet);
    } else {
      setSelectedCells(new Set());
    }
  }, [startCell, currentCell, isDragging]);

  const handleMouseDown = useCallback((r: number, c: number) => {
    setStartCell({ r, c });
    setCurrentCell({ r, c });
    setIsDragging(true);
  }, []);

  const handleMouseEnter = useCallback((r: number, c: number) => {
    if (isDragging && startCell) {
      const validCell = getValidEndCell(startCell, { r, c });
      setCurrentCell(validCell);
    }
  }, [isDragging, startCell]);

  const handleTouchStart = useCallback((r: number, c: number) => {
    setStartCell({ r, c });
    setCurrentCell({ r, c });
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !startCell) return;

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element) {
      const row = element.getAttribute('data-row');
      const col = element.getAttribute('data-col');

      if (row && col) {
        const r = parseInt(row);
        const c = parseInt(col);
        const validCell = getValidEndCell(startCell, { r, c });
        setCurrentCell(validCell);
      }
    }
  }, [isDragging, startCell]);

  const handleSelectionEnd = useCallback(() => {
    if (!isDragging || !startCell || !currentCell) return;

    const remainingWords = puzzle.words.filter(w => !foundWords.has(w.word));
    const match = checkWordMatch(puzzle.grid, startCell, currentCell, remainingWords);

    if (match) {
      const newFoundWords = new Set(foundWords);
      newFoundWords.add(match.word);
      setFoundWords(newFoundWords);

      // Show message
      setPlayer1Message(`Found ${match.word}!`);
      setTimeout(() => setPlayer1Message(undefined), 4000);

      if (onWordFound) {
        onWordFound(match.word, puzzle.words.length - newFoundWords.size);
      }

      if (newFoundWords.size === puzzle.words.length && onPuzzleComplete) {
        onPuzzleComplete();
      }
    }

    setIsDragging(false);
    setStartCell(null);
    setCurrentCell(null);
  }, [isDragging, startCell, currentCell, puzzle, foundWords, onWordFound, onPuzzleComplete]);

  const handleMouseUp = useCallback(() => {
    handleSelectionEnd();
  }, [handleSelectionEnd]);

  const handleTouchEnd = useCallback(() => {
    handleSelectionEnd();
  }, [handleSelectionEnd]);

  const isCellInFoundWord = useCallback((r: number, c: number): boolean => {
    for (const word of puzzle.words) {
      if (foundWords.has(word.word)) {
        const cells = getCellsInPath(word.start, word.end);
        if (cells.some(cell => cell.r === r && cell.c === c)) {
          return true;
        }
      }
    }
    return false;
  }, [puzzle.words, foundWords]);

  return (
    <div
      className="flex flex-col gap-6 w-full h-screen overflow-hidden py-2 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundCastles})` }}
    >
      <GameHeader
        player1={{
          score: 0,
          name: 'Player 1',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Player1'
        }}
        player2={{
          score: 0,
          name: 'Player 2',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Player2'
        }}
      />
      <div className="flex flex-col lg:flex-row gap-4 w-full items-center justify-center flex-1 min-h-0 px-2">
        <AvatarStage
          imageSrc={maleIdleImage}
          alt="Player 1"
          side="left"
          message={player1Message}
          className="hidden lg:flex flex-1 justify-center"
        />

        <div className="flex flex-col gap-2 items-center">
          <div
            className="relative p-4 bg-white rounded-2xl border-4 border-slate-200 shadow-xl select-none touch-none"
            onMouseLeave={handleMouseUp}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                gap: `${gap}px`
              }}
              onMouseUp={handleMouseUp}
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
                    isHighlighted={false}
                    onMouseDown={() => handleMouseDown(r, c)}
                    onMouseEnter={() => handleMouseEnter(r, c)}
                    onTouchStart={() => handleTouchStart(r, c)}
                    onTouchMove={(e) => handleTouchMove(e)}
                    size={cellSize}
                    theme={colorTheme}
                  />
                ))
              )}
            </div>
          </div>

          {showWordList && (
            <WordList
              words={puzzle.words.map(w => w.word)}
              foundWords={foundWords}
            />
          )}
        </div>

        <AvatarStage
          imageSrc={femaleIdleImage}
          alt="Player 2"
          side="right"
          message={player2Message}
          className="hidden lg:flex flex-1 justify-center"
        />
      </div>
    </div>
  );
}