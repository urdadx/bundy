// Main components
export { WordSearch } from './word-search';
export { Cell } from './cell';
export { SelectionLine } from './selection-line';

// Utilities and types
export {
  generateWordSearch,
  getCellsInPath,
  checkWordMatch,
  type Theme,
  type Difficulty,
  type WordSearchConfig,
  type WordSearchPuzzle
} from '@/utils/word-search-generator';
