import { useState, useCallback } from 'react';
import { findUnfoundWord } from '../utils/hint-utils';
import type { HintResult } from '../utils/hint-utils';
import { toast } from 'sonner';

interface UseHintOptions {
  diamonds: number;
  foundWords: Set<string>;
  placedWords: Array<{
    word: string;
    start: { r: number; c: number };
    end: { r: number; c: number };
  }>;
  onDiamondsChange: () => void;
}

interface UseHintReturn {
  hint: HintResult | null;
  isHintActive: boolean;
  clearHint: () => void;
  requestHint: () => void;
  canUseHint: boolean;
}


export function useHint({
  diamonds,
  foundWords,
  placedWords,
  onDiamondsChange,
}: UseHintOptions): UseHintReturn {
  const [hint, setHint] = useState<HintResult | null>(null);
  const [isHintActive, setIsHintActive] = useState(false);

  const canUseHint = diamonds >= 5;

  const clearHint = useCallback(() => {
    setHint(null);
    setIsHintActive(false);
  }, []);

  const requestHint = useCallback(() => {
    if (!canUseHint) {
      toast.warning('You need 5 diamonds to use hint!');
      return;
    }

    const unfoundWords = findUnfoundWord(placedWords, foundWords);
    
    if (!unfoundWords) {
      toast.info('All words have been found!');
      return;
    }

    onDiamondsChange();

    setHint(unfoundWords);
    setIsHintActive(true);

    setTimeout(() => {
      clearHint();
    }, 5000);
  }, [diamonds, canUseHint, placedWords, foundWords, onDiamondsChange, clearHint]);

  return {
    hint,
    isHintActive,
    clearHint,
    requestHint,
    canUseHint
  };
}