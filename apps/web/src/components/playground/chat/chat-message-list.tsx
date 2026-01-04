import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage, type ChatMessageProps } from "./chat-message"
import { Message } from "@/components/ai-elements/message"
import { MessageBubbleIcon } from "@/components/message-bubble-icon"

export interface Message {
  id: string
  message: string
  sender: {
    name: string
    avatar?: string
  }
  isOwn: boolean
  timestamp: Date
}

interface ChatMessageListProps {
  messages: Message[]
  className?: string
}

export function ChatMessageList({ messages, className }: ChatMessageListProps) {
  if (messages.length === 0) {
    return (
      <ChatEmptyState />
    )
  }

  return (
    <ScrollArea className={cn("h-full", className)}>
      <div className="flex flex-col gap-3 p-3">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.message}
            sender={msg.sender}
            isOwn={msg.isOwn}
            timestamp={msg.timestamp}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
        <MessageBubbleIcon color="#22c55e" className="w-6 h-6 text-slate-400" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-600">No messages yet</h3>
        <p className="text-xs text-slate-400">
          Send a message to chat with your opponent
        </p>
      </div>
    </div>
  )
}
