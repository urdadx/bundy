import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import type { AvatarId } from "@/lib/avatars";

interface UseAvatarOptions {
  onSuccess?: (avatar: AvatarId) => void;
  onError?: (error: Error) => void;
}

export function useAvatar(options: UseAvatarOptions = {}) {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useQuery(trpc.user.getProfile.queryOptions());

  const updateAvatarMutation = useMutation(
    trpc.user.updateAvatar.mutationOptions({
      onSuccess: (data: { success: boolean; avatar: AvatarId }) => {
        queryClient.invalidateQueries({ queryKey: ["user", "getProfile"] });
        refetchProfile();
        onSuccess?.(data.avatar);
      },
      onError: (error: unknown) => {
        onError?.(error instanceof Error ? error : new Error(String(error)));
      },
    }),
  );

  const currentAvatar = (profile?.avatar ?? "jack-avatar.png") as AvatarId;

  const updateAvatar = useCallback(
    (avatar: AvatarId) => {
      updateAvatarMutation.mutate({ avatar });
    },
    [updateAvatarMutation],
  );

  return {
    currentAvatar,
    isLoading: isLoadingProfile,
    isUpdating: updateAvatarMutation.isPending,
    updateAvatar,
    profile,
    refetchProfile,
  };
}

export function useLocalAvatar(initialAvatar?: AvatarId) {
  const [localAvatar, setLocalAvatar] = useState<AvatarId>(initialAvatar ?? "jack-avatar.png");

  useEffect(() => {
    if (initialAvatar) {
      setLocalAvatar(initialAvatar);
    }
  }, [initialAvatar]);

  return {
    localAvatar,
    setLocalAvatar,
  };
}
