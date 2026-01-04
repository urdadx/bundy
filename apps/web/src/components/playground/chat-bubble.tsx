import { cn } from "@/lib/utils"

interface ChatBubbleProps {
  message: string
  side?: "left" | "right"
  className?: string
}

export function ChatBubble({ message, side = "left", className }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col",
        side === "right" ? "items-end" : "items-start",
        className
      )}
    >
      {/* Bubble Body */}
      <div
        className={cn(
          "max-w-50 px-4 py-2 rounded-2xl text-sm font-bold shadow-sm border-2",
          // Style for Player (Left)
          side === "left" && "bg-white text-slate-600 border-slate-200 border-b-4",
          // Style for Opponent (Right)
          side === "right" && "bg-sky-500 text-white border-sky-600 border-b-4"
        )}
      >
        {message}
      </div>

      {/* Triangle Tail */}
      <div
        className={cn(
          "w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8",
          side === "left" ? "border-t-slate-200 ml-4" : "border-t-sky-600 mr-4",
          "-mt-0.5" // Pull it up to overlap the border-b
        )}
      />
    </div>
  )
}