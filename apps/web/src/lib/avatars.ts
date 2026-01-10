// Avatar utilities for multiplayer

import jackAvatar from "@/assets/avatars/jack-avatar.png";
import marieAvatar from "@/assets/avatars/marie-avatar.png";
import rudeusAvatar from "@/assets/avatars/rudeus-avatar.png";

export const AVATARS = [
  { id: "jack-avatar.png", name: "Jack", src: jackAvatar },
  { id: "marie-avatar.png", name: "Marie", src: marieAvatar },
  { id: "rudeus-avatar.png", name: "Rudeus", src: rudeusAvatar },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

// Get avatar source by ID
export function getAvatarSrc(avatarId: string | null | undefined): string {
  const avatar = AVATARS.find((a) => a.id === avatarId);
  return avatar?.src ?? jackAvatar; 
}

// Get avatar name by ID
export function getAvatarName(avatarId: string | null | undefined): string {
  const avatar = AVATARS.find((a) => a.id === avatarId);
  return avatar?.name ?? "Jack";
}

// Get next avatar in the list (for cycling)
export function getNextAvatar(currentAvatarId: string | null | undefined): AvatarId {
  const currentIndex = AVATARS.findIndex((a) => a.id === currentAvatarId);
  const nextIndex = (currentIndex + 1) % AVATARS.length;
  return AVATARS[nextIndex].id;
}

// Get previous avatar in the list (for cycling)
export function getPrevAvatar(currentAvatarId: string | null | undefined): AvatarId {
  const currentIndex = AVATARS.findIndex((a) => a.id === currentAvatarId);
  const prevIndex = currentIndex <= 0 ? AVATARS.length - 1 : currentIndex - 1;
  return AVATARS[prevIndex].id;
}

// Get avatar index
export function getAvatarIndex(avatarId: string | null | undefined): number {
  const index = AVATARS.findIndex((a) => a.id === avatarId);
  return index >= 0 ? index : 0;
}

// Normalize avatar from various formats to AvatarId
export function normalizeAvatar(avatar: string | undefined): AvatarId {
  if (!avatar) return "jack-avatar.png";
  const filename = avatar.split("/").pop();
  return (filename === "marie-avatar.png" ? "marie-avatar.png" : "jack-avatar.png") as AvatarId;
}
