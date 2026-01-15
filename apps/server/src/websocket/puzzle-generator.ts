import type { GameSettings, PuzzleData } from "./types";

const THEME_WORDS: Record<string, string[]> = {
  animals: [
    "LION",
    "TIGER",
    "ELEPHANT",
    "GIRAFFE",
    "ZEBRA",
    "MONKEY",
    "PANDA",
    "KANGAROO",
    "DOLPHIN",
    "PENGUIN",
    "EAGLE",
    "BUTTERFLY",
    "LEOPARD",
    "CHEETAH",
    "RHINOCEROS",
    "URCHIN",
    "CROCODILE",
    "GORILLA",
  ],
  planets: [
    "MERCURY",
    "VENUS",
    "EARTH",
    "MARS",
    "JUPITER",
    "SATURN",
    "URANUS",
    "NEPTUNE",
    "PLUTO",
    "MOON",
    "COMET",
    "ASTEROID",
    "GALAXY",
    "NEBULA",
  ],
  technology: [
    "COMPUTER",
    "INTERNET",
    "SOFTWARE",
    "HARDWARE",
    "KEYBOARD",
    "MOUSE",
    "MONITOR",
    "ALGORITHM",
    "DATABASE",
    "NETWORK",
    "SERVER",
    "CLOUD",
    "MOBILE",
    "TABLET",
    "LAPTOP",
    "DIGITAL",
    "BINARY",
    "CODING",
  ],
  food: [
    "PIZZA",
    "BURGER",
    "PASTA",
    "SUSHI",
    "TACO",
    "SANDWICH",
    "SALAD",
    "CHICKEN",
    "STEAK",
    "FISH",
    "RICE",
    "NOODLES",
    "BREAD",
    "CHEESE",
    "CHOCOLATE",
    "COOKIE",
    "CAKE",
    "FRUIT",
    "VEGETABLE",
  ],
  sports: [
    "SOCCER",
    "BASKETBALL",
    "FOOTBALL",
    "TENNIS",
    "BASEBALL",
    "HOCKEY",
    "GOLF",
    "SWIMMING",
    "RUNNING",
    "CYCLING",
    "BOXING",
    "CRICKET",
    "VOLLEYBALL",
    "RUGBY",
    "SKIING",
    "SURFING",
    "SKATING",
  ],
  general: [
    "HELLO",
    "WORLD",
    "FRIEND",
    "FAMILY",
    "HAPPY",
    "SMILE",
    "LOVE",
    "PEACE",
    "DREAM",
    "HOPE",
    "LIGHT",
    "MUSIC",
    "DANCE",
    "PLAY",
  ],
  science: [
    "ATOM",
    "MOLECULE",
    "GENETICS",
    "PHYSICS",
    "BIOLOGY",
    "CHEMISTRY",
    "ENERGY",
    "LABORATORY",
    "RESEARCH",
    "TELESCOPE",
    "MICROSCOPE",
    "GRAVITY",
  ],

  countries: [
    "CANADA",
    "BRAZIL",
    "FRANCE",
    "GERMANY",
    "JAPAN",
    "AUSTRALIA",
    "EGYPT",
    "MEXICO",
    "ITALY",
    "SPAIN",
    "NORWAY",
    "SWEDEN",
  ],
};

const DIFFICULTY_CONFIG: Record<
  string,
  {
    minWordLength: number;
    maxWordLength: number;
    directions: string[];
  }
> = {
  easy: {
    minWordLength: 4,
    maxWordLength: 8,
    directions: ["horizontal", "vertical"],
  },
  medium: {
    minWordLength: 4,
    maxWordLength: 10,
    directions: ["horizontal", "vertical", "diagonal"],
  },
  hard: {
    minWordLength: 5,
    maxWordLength: 11,
    directions: [
      "horizontal",
      "vertical",
      "diagonal",
      "horizontal-reverse",
      "vertical-reverse",
      "diagonal-reverse",
    ],
  },
  expert: {
    minWordLength: 5,
    maxWordLength: 11,
    directions: [
      "horizontal",
      "vertical",
      "diagonal",
      "horizontal-reverse",
      "vertical-reverse",
      "diagonal-reverse",
    ],
  },
};

type Direction =
  | "horizontal"
  | "vertical"
  | "diagonal"
  | "horizontal-reverse"
  | "vertical-reverse"
  | "diagonal-reverse";

const DIRECTION_VECTORS: Record<Direction, { dr: number; dc: number }> = {
  horizontal: { dr: 0, dc: 1 },
  vertical: { dr: 1, dc: 0 },
  diagonal: { dr: 1, dc: 1 },
  "horizontal-reverse": { dr: 0, dc: -1 },
  "vertical-reverse": { dr: -1, dc: 0 },
  "diagonal-reverse": { dr: -1, dc: -1 },
};

function canPlaceWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction,
): boolean {
  const { dr, dc } = DIRECTION_VECTORS[direction];
  const size = grid.length;

  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * dr;
    const newCol = col + i * dc;

    // Check bounds
    if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
      return false;
    }

    // Check if cell is empty or has the same letter
    const currentCell = grid[newRow]![newCol];
    if (currentCell !== "" && currentCell !== word[i]) {
      return false;
    }
  }

  return true;
}

function placeWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction,
): { start: { r: number; c: number }; end: { r: number; c: number } } {
  const { dr, dc } = DIRECTION_VECTORS[direction];

  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * dr;
    const newCol = col + i * dc;
    grid[newRow]![newCol] = word[i]!;
  }

  const endRow = row + (word.length - 1) * dr;
  const endCol = col + (word.length - 1) * dc;

  return {
    start: { r: row, c: col },
    end: { r: endRow, c: endCol },
  };
}

function fillEmptyCells(grid: string[][]): void {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let r = 0; r < grid.length; r++) {
    const row = grid[r]!;
    for (let c = 0; c < row.length; c++) {
      if (row[c] === "") {
        row[c] = letters[Math.floor(Math.random() * letters.length)]!;
      }
    }
  }
}

export function generatePuzzle(settings: GameSettings): PuzzleData {
  const { theme, difficulty, gridSize, wordCount } = settings;
  const diffConfig = DIFFICULTY_CONFIG[difficulty] ?? DIFFICULTY_CONFIG.medium!;

  // Initialize empty grid
  const grid: string[][] = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(""));

  const themeWords = THEME_WORDS[theme] ?? THEME_WORDS.general ?? [];

  const filteredWords = themeWords.filter(
    (word) =>
      word.length >= diffConfig.minWordLength &&
      word.length <= diffConfig.maxWordLength &&
      word.length <= gridSize,
  );

  const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);

  const placedWords: Array<{
    word: string;
    start: { r: number; c: number };
    end: { r: number; c: number };
  }> = [];

  const directions = diffConfig.directions as Direction[];
  const maxAttempts = 100;

  // Try to place words
  for (const word of shuffled) {
    if (placedWords.length >= wordCount) break;

    let placed = false;

    for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
      const direction = directions[Math.floor(Math.random() * directions.length)]!;
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      if (canPlaceWord(grid, word, row, col, direction)) {
        const position = placeWord(grid, word, row, col, direction);
        placedWords.push({
          word,
          start: position.start,
          end: position.end,
        });
        placed = true;
      }
    }
  }

  // Fill empty cells with random letters
  fillEmptyCells(grid);

  return {
    grid,
    words: placedWords,
  };
}
