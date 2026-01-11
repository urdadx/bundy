import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { ChatHeader } from "./chat-header";
import { ChatMessageList, type Message } from "./chat-message-list";
import { ChatInput } from "./chat-input";

interface ChatPanelProps {
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

export function ChatPanel({
  messages,
  opponent,
  isOpponentTyping,
  onSendMessage,
  onTyping,
  disabled = false,
  className,
}: ChatPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const collapsedHeight = 65;
  const expandedHeight = 400;

  return (
    <motion.div
      className={cn(
        "flex flex-col bg-white border-2 border-b-4 border-slate-200 rounded-xl overflow-hidden",
        className,
      )}
      animate={{ height: isCollapsed ? collapsedHeight : expandedHeight }}
      transition={{ duration: 0.3 }}
    >
      <ChatHeader isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />

      <div className="flex-1 overflow-hidden">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ scaleY: 0, transformOrigin: "top" }}
              animate={{ scaleY: 1, transformOrigin: "top" }}
              exit={{ scaleY: 0, transformOrigin: "top" }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
              className="flex flex-col h-full"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
