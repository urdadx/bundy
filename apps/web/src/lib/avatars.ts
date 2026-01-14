import jackAvatar from "@/assets/avatars/jack-avatar.png";
import marieAvatar from "@/assets/avatars/marie-avatar.png";
import rudeusAvatar from "@/assets/avatars/rudeus-avatar.png";

export const AVATARS = [
  { id: "jack-avatar.png", name: "Jack", src: jackAvatar },
  { id: "marie-avatar.png", name: "Marie", src: marieAvatar },
  { id: "rudeus-avatar.png", name: "Rudeus", src: rudeusAvatar },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export function getAvatarSrc(avatarId: string | null | undefined): string {
  const avatar = AVATARS.find((a) => a.id === avatarId);
  return avatar?.src ?? jackAvatar;
}

export function normalizeAvatar(avatar: string | undefined): AvatarId {
  if (!avatar) return "jack-avatar.png";
  const filename = avatar.split("/").pop();
  if (filename === "marie-avatar.png") return "marie-avatar.png";
  if (filename === "rudeus-avatar.png") return "rudeus-avatar.png";
  return "jack-avatar.png";
}
