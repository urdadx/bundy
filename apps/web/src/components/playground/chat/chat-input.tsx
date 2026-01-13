import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState, type KeyboardEvent, type FormEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({
  onSend,
  onTyping,
  placeholder = "Type a message...",
  disabled = false,
  className,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue("");
      onTyping?.(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (newValue.trim().length > 0) {
      onTyping?.(true);
    } else {
      onTyping?.(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center gap-2 p-3 border-t-2 border-slate-100 bg-slate-50/50",
        className,
      )}
    >
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full resize-none rounded-xl border-2 border-b-4 border-slate-200 bg-white px-3 py-2.5",
            "text-sm font-medium text-slate-700 placeholder:text-slate-400",
            "outline-none transition-all",
            "focus:border-sky-400 focus:border-b-sky-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "max-h-20 min-h-9.5",
          )}
          style={{
            height: "auto",
            minHeight: "38px",
          }}
        />
      </div>
      <Button
        type="submit"
        size="icon"
        className={cn(
          "shrink-0 rounded-xl h-10 w-9.5",
          "bg-sky-500 hover:bg-sky-600 border border-sky-600",
        )}
      >
        <Send className="w-4 h-4 text-white" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}
