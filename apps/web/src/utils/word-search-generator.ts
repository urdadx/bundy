export type Theme = 'animals' | 'planets' | 'technology' | 'food' | 'sports' | 'general';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface WordSearchConfig {
  size: number;
  theme: Theme;
  difficulty: Difficulty;
  wordCount?: number;
}

export interface WordSearchPuzzle {
  grid: string[][];
  words: Array<{
    word: string;
    start: { r: number; c: number };
    end: { r: number; c: number };
  }>;
  theme: Theme;
  difficulty: Difficulty;
}

const THEME_WORDS: Record<Theme, string[]> = {
  animals: [
    'LION', 'TIGER', 'ELEPHANT', 'GIRAFFE', 'ZEBRA', 'MONKEY', 'PANDA',
    'KANGAROO', 'DOLPHIN', 'PENGUIN', 'EAGLE', 'BUTTERFLY', 'LEOPARD',
    'CHEETAH', 'RHINOCEROS', 'HIPPOPOTAMUS', 'CROCODILE', 'GORILLA'
  ],
  planets: [
    'MERCURY', 'VENUS', 'EARTH', 'MARS', 'JUPITER', 'SATURN', 'URANUS',
    'NEPTUNE', 'PLUTO', 'MOON', 'COMET', 'ASTEROID', 'GALAXY', 'NEBULA'
  ],
  technology: [
    'COMPUTER', 'INTERNET', 'SOFTWARE', 'HARDWARE', 'KEYBOARD', 'MOUSE',
    'MONITOR', 'ALGORITHM', 'DATABASE', 'NETWORK', 'SERVER', 'CLOUD',
    'MOBILE', 'TABLET', 'LAPTOP', 'DIGITAL', 'BINARY', 'CODING'
  ],
  food: [
    'PIZZA', 'BURGER', 'PASTA', 'SUSHI', 'TACO', 'SANDWICH', 'SALAD',
    'CHICKEN', 'STEAK', 'FISH', 'RICE', 'NOODLES', 'BREAD', 'CHEESE',
    'CHOCOLATE', 'COOKIE', 'CAKE', 'FRUIT', 'VEGETABLE'
  ],
  sports: [
    'SOCCER', 'BASKETBALL', 'FOOTBALL', 'TENNIS', 'BASEBALL', 'HOCKEY',
    'GOLF', 'SWIMMING', 'RUNNING', 'CYCLING', 'BOXING', 'CRICKET',
    'VOLLEYBALL', 'RUGBY', 'SKIING', 'SURFING', 'SKATING'
  ],
  general: [
    'HELLO', 'WORLD', 'FRIEND', 'FAMILY', 'HAPPY', 'SMILE', 'LOVE',
    'PEACE', 'DREAM', 'HOPE', 'LIGHT', 'MUSIC', 'DANCE', 'PLAY'
  ]
};

const DIFFICULTY_CONFIG = {
  easy: {
    minSize: 8,
    maxSize: 10,
    wordCount: 5,
    minWordLength: 4,
    maxWordLength: 7,
    directions: ['horizontal', 'vertical'] // Only right and down
  },
  medium: {
    minSize: 8,
    maxSize: 10,
    wordCount: 7,
    minWordLength: 4,
    maxWordLength: 10,
    directions: ['horizontal', 'vertical', 'diagonal'] // Right, down, and diagonal-down-right
  },
  hard: {
    minSize: 10,
    maxSize: 12,
    wordCount: 10,
    minWordLength: 5,
    maxWordLength: 12,
    directions: ['horizontal', 'vertical', 'diagonal', 'horizontal-reverse', 'vertical-reverse']
  },
  expert: {
    minSize: 15,
    maxSize: 20,
    wordCount: 15,
    minWordLength: 5,
    maxWordLength: 15,
    directions: ['horizontal', 'vertical', 'diagonal', 'horizontal-reverse', 'vertical-reverse', 'diagonal-reverse']
  }
};

type Direction = 
  | 'horizontal' 
  | 'vertical' 
  | 'diagonal' 
  | 'horizontal-reverse' 
  | 'vertical-reverse' 
  | 'diagonal-reverse'
  | 'diagonal-up'
  | 'diagonal-down';

const DIRECTION_VECTORS: Record<Direction, { dr: number; dc: number }> = {
  'horizontal': { dr: 0, dc: 1 },
  'vertical': { dr: 1, dc: 0 },
  'diagonal': { dr: 1, dc: 1 },
  'horizontal-reverse': { dr: 0, dc: -1 },
  'vertical-reverse': { dr: -1, dc: 0 },
  'diagonal-reverse': { dr: -1, dc: -1 },
  'diagonal-up': { dr: -1, dc: 1 },
  'diagonal-down': { dr: 1, dc: -1 }
};

function canPlaceWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction
): boolean {
  const { dr, dc } = DIRECTION_VECTORS[direction];
  const size = grid.length;

  for (let i = 0; i < word.length; i++) {
    const r = row + i * dr;
    const c = col + i * dc;

    if (r < 0 || r >= size || c < 0 || c >= size) {
      return false;
    }

    if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
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
  direction: Direction
): { start: { r: number; c: number }; end: { r: number; c: number } } {
  const { dr, dc } = DIRECTION_VECTORS[direction];

  for (let i = 0; i < word.length; i++) {
    const r = row + i * dr;
    const c = col + i * dc;
    grid[r][c] = word[i];
  }

  const endRow = row + (word.length - 1) * dr;
  const endCol = col + (word.length - 1) * dc;

  return {
    start: { r: row, c: col },
    end: { r: endRow, c: endCol }
  };
}

function fillEmptyCells(grid: string[][]): void {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

export function generateWordSearch(config: WordSearchConfig): WordSearchPuzzle {
  const { theme, difficulty } = config;
  const diffConfig = DIFFICULTY_CONFIG[difficulty];
  
  // Determine grid size
  const size = config.size || Math.floor(
    Math.random() * (diffConfig.maxSize - diffConfig.minSize + 1) + diffConfig.minSize
  );

  // Initialize empty grid
  const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));

  // Get available words for theme
  const availableWords = THEME_WORDS[theme]
    .filter(word => 
      word.length >= diffConfig.minWordLength && 
      word.length <= diffConfig.maxWordLength &&
      word.length <= size
    );

  // Shuffle and select words
  const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
  const wordCount = config.wordCount || diffConfig.wordCount;
  const selectedWords = shuffled.slice(0, Math.min(wordCount, shuffled.length));

  const placedWords: Array<{
    word: string;
    start: { r: number; c: number };
    end: { r: number; c: number };
  }> = [];

  // Place each word
  for (const word of selectedWords) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const direction = diffConfig.directions[
        Math.floor(Math.random() * diffConfig.directions.length)
      ] as Direction;

      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      if (canPlaceWord(grid, word, row, col, direction)) {
        const placement = placeWord(grid, word, row, col, direction);
        placedWords.push({
          word,
          ...placement
        });
        placed = true;
      }

      attempts++;
    }
  }

  // Fill empty cells with random letters
  fillEmptyCells(grid);

  return {
    grid,
    words: placedWords,
    theme,
    difficulty
  };
}

export function getCellsInPath(
  start: { r: number; c: number },
  end: { r: number; c: number }
): Array<{ r: number; c: number }> {
  const cells: Array<{ r: number; c: number }> = [];
  
  const dr = Math.sign(end.r - start.r);
  const dc = Math.sign(end.c - start.c);
  
  const steps = Math.max(Math.abs(end.r - start.r), Math.abs(end.c - start.c));
  
  for (let i = 0; i <= steps; i++) {
    cells.push({
      r: start.r + i * dr,
      c: start.c + i * dc
    });
  }
  
  return cells;
}

export function checkWordMatch(
  grid: string[][],
  start: { r: number; c: number },
  end: { r: number; c: number },
  targetWords: Array<{ word: string; start: { r: number; c: number }; end: { r: number; c: number } }>
): { word: string; start: { r: number; c: number }; end: { r: number; c: number } } | null {
  const cells = getCellsInPath(start, end);
  const selectedWord = cells.map(cell => grid[cell.r][cell.c]).join('');
  const reversedWord = selectedWord.split('').reverse().join('');

  for (const target of targetWords) {
    if (target.word === selectedWord || target.word === reversedWord) {
      // Check if selection matches the position
      const targetCells = getCellsInPath(target.start, target.end);
      const targetWord = targetCells.map(cell => grid[cell.r][cell.c]).join('');
      
      if (selectedWord === targetWord || reversedWord === targetWord) {
        return target;
      }
    }
  }

  return null;
}
