import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/lib/auth-client";
import { AVATARS } from "@/lib/avatars";
import { env } from "@wordsearch/env/web";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AvatarChangeCarousel } from "@/components/ui/avatar-change-carousel";

interface AvatarChangeDialogProps {
  children: React.ReactNode;
}

export function AvatarChangeDialog({ children }: AvatarChangeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const { refetch } = useSession();

  const handleConfirmSelection = async () => {
    setIsUpdating(true);
    try {
      const selectedAvatar = AVATARS[selectedAvatarIndex];
      const imageUrl =
        env.VITE_NODE_ENV === "production"
          ? `${env.VITE_R2_BUCKET}avatars/${selectedAvatar.id}`
          : selectedAvatar.src;
      await authClient.updateUser({
        image: imageUrl,
      });
      await refetch();
      setOpen(false);
    } catch (error) {
      console.error("Failed to update avatar:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl text-center uppercase font-semibold">
            Change Player
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 sm:space-y-4">
          <AvatarChangeCarousel onIndexChange={setSelectedAvatarIndex} />
          <div className="w-full">
            <Button
              className="w-full text-sm sm:text-base"
              variant="primary"
              onClick={handleConfirmSelection}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
