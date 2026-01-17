import jackAvatar from "@/assets/avatars/jack-avatar.png";
import marieAvatar from "@/assets/avatars/marie-avatar.png";
import rudeusAvatar from "@/assets/avatars/rudeus-avatar.png";
import { env } from "@wordsearch/env/web";

const isProduction = env.VITE_NODE_ENV === "production";

export const AVATARS = [
  {
    id: "jack-avatar.png",
    name: "Jack",
    src: isProduction ? `${env.VITE_R2_BUCKET}avatars/jack-avatar.png` : jackAvatar,
  },
  {
    id: "marie-avatar.png",
    name: "Marie",
    src: isProduction ? `${env.VITE_R2_BUCKET}avatars/marie-avatar.png` : marieAvatar,
  },
  {
    id: "rudeus-avatar.png",
    name: "Rudeus",
    src: isProduction ? `${env.VITE_R2_BUCKET}avatars/rudeus-avatar.png` : rudeusAvatar,
  },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export function getAvatarSrc(avatarId: string | null | undefined): string {
  const avatar = AVATARS.find((a) => a.id === avatarId);
  return (
    avatar?.src ?? (isProduction ? `${env.VITE_R2_BUCKET}avatars/jack-avatar.png` : jackAvatar)
  );
}

export function normalizeAvatar(avatar: string | undefined): AvatarId {
  if (!avatar) return "jack-avatar.png";
  if (avatar.startsWith("data:")) return "jack-avatar.png";
  const filename = avatar.split("/").pop()?.split("?")[0];
  if (filename === "marie-avatar.png") return "marie-avatar.png";
  if (filename === "rudeus-avatar.png") return "rudeus-avatar.png";
  return "jack-avatar.png";
}
