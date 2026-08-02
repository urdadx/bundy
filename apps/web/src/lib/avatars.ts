import jackAvatar from "@/assets/avatars/jack-avatar.avif";
import marieAvatar from "@/assets/avatars/marie-avatar.avif";
import rudeusAvatar from "@/assets/avatars/rudeus-avatar.avif";
import { env } from "@wordsearch/env/web";

const isProduction = env.VITE_NODE_ENV === "production";

export const AVATARS = [
  {
    id: "jack-avatar.avif",
    name: "Jack",
    src: isProduction ? `${env.VITE_R2_BUCKET}/avatars/jack-avatar.avif` : jackAvatar,
  },
  {
    id: "marie-avatar.avif",
    name: "Marie",
    src: isProduction ? `${env.VITE_R2_BUCKET}/avatars/marie-avatar.avif` : marieAvatar,
  },
  {
    id: "rudeus-avatar.avif",
    name: "Rudeus",
    src: isProduction ? `${env.VITE_R2_BUCKET}/avatars/rudeus-avatar.avif` : rudeusAvatar,
  },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export function getAvatarSrc(avatarId: string | null | undefined): string {
  const avatar = AVATARS.find((a) => a.id === normalizeAvatar(avatarId ?? undefined));
  return (
    avatar?.src ?? (isProduction ? `${env.VITE_R2_BUCKET}/avatars/jack-avatar.avif` : jackAvatar)
  );
}

export function normalizeAvatar(avatar: string | undefined): AvatarId {
  if (!avatar) return "jack-avatar.avif";
  const filename = avatar.split("/").pop();
  if (filename === "marie-avatar.avif" || filename === "marie-avatar.png") {
    return "marie-avatar.avif";
  }
  if (filename === "rudeus-avatar.avif" || filename === "rudeus-avatar.png") {
    return "rudeus-avatar.avif";
  }
  return "jack-avatar.avif";
}
