import { cn } from "@/lib/utils"
import { ChatHeader } from "./chat-header"
import { ChatMessageList, type Message } from "./chat-message-list"
import { ChatInput } from "./chat-input"

interface ChatPanelProps {
  messages: Message[]
  currentUser: {
    name: string
    avatar?: string
  }
  opponent: {
    name: string
    avatar?: string
    isOnline?: boolean
  }
  onSendMessage: (message: string) => void
  disabled?: boolean
  className?: string
}

export function ChatPanel({
  messages,
  currentUser,
  opponent,
  onSendMessage,
  disabled = false,
  className
}: ChatPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-white border-2 border-b-4 border-slate-200 rounded-xl overflow-hidden h-100",
        className
      )}
    >
      <ChatHeader />

      <div className="flex-1 overflow-hidden">
        <ChatMessageList messages={messages} />
      </div>

      <ChatInput
        onSend={onSendMessage}
        disabled={disabled}
        placeholder={`Message ${opponent.name}...`}
      />
    </div>
  )
}
