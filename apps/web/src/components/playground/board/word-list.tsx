import { cn } from "@/lib/utils";

interface WordListProps {
  words: string[];
  foundWords: Set<string>;
  className?: string;
}

export function WordList({ words, foundWords, className }: WordListProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border-2 border-slate-200 shadow-md p-4 w-full max-w-5xl",
        className,
      )}
    >
      <div className="flex flex-wrap gap-2 justify-center">
        {words.map((word) => (
          <span
            key={word}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              foundWords.has(word)
                ? "bg-green-100 text-green-700 line-through opacity-60"
                : "bg-slate-100 text-slate-700",
            )}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
