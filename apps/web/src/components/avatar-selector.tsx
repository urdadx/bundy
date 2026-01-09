import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AVATARS, getAvatarIndex, type AvatarId } from "@/lib/avatars";
import { motion, AnimatePresence } from "motion/react";

interface AvatarSelectorProps {
  value: AvatarId;
  onChange: (avatarId: AvatarId) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-20 h-20",
  md: "w-28 h-28",
  lg: "w-36 h-36",
};

const buttonSizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export function AvatarSelector({
  value,
  onChange,
  size = "md",
  disabled = false,
  className,
}: AvatarSelectorProps) {
  const [currentIndex, setCurrentIndex] = useState(() => getAvatarIndex(value));
  const [direction, setDirection] = useState(0);

  // Sync with external value changes
  useEffect(() => {
    const newIndex = getAvatarIndex(value);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  }, [value]);

  const handlePrev = useCallback(() => {
    if (disabled) return;
    setDirection(-1);
    const prevIndex = currentIndex <= 0 ? AVATARS.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    onChange(AVATARS[prevIndex].id);
  }, [currentIndex, disabled, onChange]);

  const handleNext = useCallback(() => {
    if (disabled) return;
    setDirection(1);
    const nextIndex = (currentIndex + 1) % AVATARS.length;
    setCurrentIndex(nextIndex);
    onChange(AVATARS[nextIndex].id);
  }, [currentIndex, disabled, onChange]);

  const currentAvatar = AVATARS[currentIndex];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Previous Button */}
      <Button
        variant="default"
        size="icon"
        onClick={handlePrev}
        disabled={disabled}
        className={cn(
          buttonSizeClasses[size],
          "rounded-full border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
        )}
      >
        <ChevronLeft className="w-5 h-5 text-slate-600" />
      </Button>

      {/* Avatar Display */}
      <div
        className={cn(
          sizeClasses[size],
          "relative rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 border-4 border-white shadow-lg overflow-hidden",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={currentAvatar.id}
            src={currentAvatar.src}
            alt={currentAvatar.name}
            className="w-full h-full object-contain p-2"
            initial={{ x: direction * 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -50, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      {/* Next Button */}
      <Button
        variant="default"
        size="icon"
        onClick={handleNext}
        disabled={disabled}
        className={cn(
          buttonSizeClasses[size],
          "rounded-full border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
        )}
      >
        <ChevronRight className="w-5 h-5 text-slate-600" />
      </Button>
    </div>
  );
}

// Simple avatar display (no selection)
interface AvatarDisplayProps {
  avatarId: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showBorder?: boolean;
  borderColor?: string;
}

const displaySizeClasses = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
  xl: "w-40 h-40",
};

export function AvatarDisplay({
  avatarId,
  size = "md",
  className,
  showBorder = true,
  borderColor,
}: AvatarDisplayProps) {
  const avatar = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];

  return (
    <div
      className={cn(
        displaySizeClasses[size],
        "shrink-0 overflow-hidden",
        showBorder && "border-3 rounded-xl",
        className,
      )}
      style={borderColor ? { borderColor } : undefined}
    >
      <img src={avatar.src} alt={avatar.name} className="w-full h-full object-contain p-1" />
    </div>
  );
}

// Indicator dots for avatar selection
interface AvatarDotsProps {
  currentIndex: number;
  className?: string;
}

export function AvatarDots({ currentIndex, className }: AvatarDotsProps) {
  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {AVATARS.map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-2 h-2 rounded-full transition-colors duration-200",
            index === currentIndex ? "bg-primary" : "bg-slate-300",
          )}
        />
      ))}
    </div>
  );
}
