import { cn } from "@/lib/utils"
import { Eye, EyeOff, } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatHeaderProps {

  className?: string
}

export function ChatHeader({ className }: ChatHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 bg-slate-50 border-b-2 border-slate-200",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        <h3 className="text-slate-600 font-bold text-sm uppercase tracking-wide">
          Live Chat
        </h3>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="sm">
          <EyeOff className="w-4 h-4 text-slate-500 mr-1" />
          Hide Chat
        </Button>

      </div>
    </div>
  )
}
