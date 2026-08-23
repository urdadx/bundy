import jackAvatar from "@/assets/avatars/jack-avatar.avif";
import marieAvatar from "@/assets/avatars/marie-avatar.avif";
import rudeusAvatar from "@/assets/avatars/rudeus-avatar.avif";
import { env } from "@wordsearch/env/web";

const isProduction = env.VITE_NODE_ENV === "production";
const r2Bucket = isProduction ? env.VITE_R2_BUCKET : undefined;

export const AVATARS = [
  {
    id: "jack-avatar.avif",
    name: "Jack",
    src: r2Bucket ? `${r2Bucket}/avatars/jack-avatar.avif` : jackAvatar,
  },
  {
    id: "marie-avatar.avif",
    name: "Marie",
    src: r2Bucket ? `${r2Bucket}/avatars/marie-avatar.avif` : marieAvatar,
  },
  {
    id: "rudeus-avatar.avif",
    name: "Rudeus",
    src: r2Bucket ? `${r2Bucket}/avatars/rudeus-avatar.avif` : rudeusAvatar,
  },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export function getAvatarSrc(avatarId: string | null | undefined): string {
  const avatar = AVATARS.find((a) => a.id === normalizeAvatar(avatarId ?? undefined));
  if (avatarId && /^https?:\/\//.test(avatarId) && !isGameAvatar(avatarId)) {
    return avatarId;
  }
  return avatar?.src ?? jackAvatar;
}

export function getBundledAvatarSrc(avatarId: string | null | undefined): string {
  switch (normalizeAvatar(avatarId ?? undefined)) {
    case "marie-avatar.avif":
      return marieAvatar;
    case "rudeus-avatar.avif":
      return rudeusAvatar;
    default:
      return jackAvatar;
  }
}

export function normalizeAvatar(avatar: string | undefined): AvatarId {
  if (!avatar) return "jack-avatar.avif";
  const filename = getAvatarFilename(avatar);
  if (/^marie-avatar(?:[-.].*)?\.(?:avif|png)$/.test(filename)) {
    return "marie-avatar.avif";
  }
  if (/^rudeus-avatar(?:[-.].*)?\.(?:avif|png)$/.test(filename)) {
    return "rudeus-avatar.avif";
  }
  return "jack-avatar.avif";
}

function isGameAvatar(avatar: string): boolean {
  const filename = getAvatarFilename(avatar);
  return /^(?:jack|marie|rudeus)-avatar(?:[-.].*)?\.(?:avif|png)$/.test(filename);
}

function getAvatarFilename(avatar: string): string {
  const filename = avatar.split(/[?#]/)[0]?.split("/").pop() ?? "";
  try {
    return decodeURIComponent(filename);
  } catch {
    return filename;
  }
}
