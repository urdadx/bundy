import { cn } from "@/lib/utils";
import { AVATARS } from "@/lib/avatars";

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
