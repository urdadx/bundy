import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarSrc } from "@/lib/avatars";
import { Loader } from "@/components/ui/loader";

export interface ChatMessageProps {
  message?: string;
  sender: {
    name: string;
    avatar?: string;
  };
  isOwn?: boolean;
  isTyping?: boolean;
  timestamp?: Date;
  className?: string;
}

export function ChatMessage({
  message,
  sender,
  isOwn = false,
  isTyping = false,
  className,
}: ChatMessageProps) {
  const avatarSrc = getAvatarSrc(sender.avatar);

  return (
    <div className={cn("flex gap-2 items-end", isOwn ? "flex-row-reverse" : "flex-row", className)}>
      <Avatar size="default" className="shrink-0 after:border-0">
        <AvatarImage src={avatarSrc} alt={sender.name} />
        <AvatarFallback className="bg-slate-200 text-slate-600 text-xs font-bold">
          {sender.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex flex-col gap-1", isOwn ? "items-end" : "items-start")}>
        <div
          className={cn(
            "max-w-50 px-3 py-2 rounded-lg text-sm border font-medium shadow-sm min-h-9.5 flex items-center",
            isOwn
              ? "bg-sky-500 text-white border-sky-600 "
              : "bg-white text-slate-600 border-slate-200 rounded-bl-sm",
          )}
        >
          {isTyping ? (
            <Loader
              variant="typing"
              size="sm"
              className={cn(isOwn ? "[&_div]:bg-white" : "[&_div]:bg-slate-400")}
            />
          ) : (
            message
          )}
        </div>
      </div>
    </div>
  );
}
