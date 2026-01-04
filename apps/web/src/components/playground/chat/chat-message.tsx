import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export interface ChatMessageProps {
  message: string
  sender: {
    name: string
    avatar?: string
  }
  isOwn?: boolean
  timestamp?: Date
  className?: string
}

export function ChatMessage({
  message,
  sender,
  isOwn = false,
  timestamp,
  className
}: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-2 items-end",
        isOwn ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      <Avatar size="sm" className="shrink-0">
        {sender.avatar ? (
          <AvatarImage src={sender.avatar} alt={sender.name} />
        ) : (
          <AvatarFallback className="bg-slate-200 text-slate-600 text-xs font-bold">
            {sender.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>

      <div
        className={cn(
          "flex flex-col gap-1",
          isOwn ? "items-end" : "items-start"
        )}
      >

        <div
          className={cn(
            "max-w-50 px-3 py-2 rounded-lg text-sm  border font-medium shadow-sm ",
            isOwn
              ? "bg-sky-500 text-white border-sky-600 "
              : "bg-white text-slate-600 border-slate-200 rounded-bl-sm"
          )}
        >
          {message}
        </div>
        {timestamp && (
          <span className="text-[10px] text-slate-300 px-1">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  )
}
