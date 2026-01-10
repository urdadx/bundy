import { ChatMessageList, type Message } from "./chat-message-list";
import { ChatInput } from "./chat-input";

interface ChatPanelMobileProps {
  messages: Message[];
  currentUser: {
    name: string;
    avatar?: string;
  };
  opponent: {
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
  isOpponentTyping?: boolean;
  onSendMessage: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function ChatPanelMobile({
  messages,
  opponent,
  isOpponentTyping,
  onSendMessage,
  onTyping,
  disabled = false,
}: ChatPanelMobileProps) {
  return (
    <>
      <div className="flex-1 overflow-hidden">
        <ChatMessageList
          messages={messages}
          opponentTyping={isOpponentTyping ? opponent : undefined}
        />
      </div>

      <ChatInput
        onSend={onSendMessage}
        onTyping={onTyping}
        disabled={disabled}
        placeholder={`Message ${opponent.name}...`}
      />
    </>
  );
}
