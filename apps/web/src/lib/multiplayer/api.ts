import { env } from "@wordsearch/env/web";
import type { GameSettings, SerializedRoom } from "./types";

// Use WebSocket server URL for multiplayer API, fallback to main server
const getApiBase = () => {
  if (env.VITE_WS_URL) {
    // Convert ws:// or wss:// to http:// or https://
    return env.VITE_WS_URL.replace(/^ws/, 'http');
  }
  return env.VITE_SERVER_URL;
};

const API_BASE = getApiBase();

export interface CreateRoomRequest {
  odId: string;
  odName: string;
  odAvatar: string;
  settings: GameSettings;
}

export interface CreateRoomResponse {
  roomId: string;
}

export interface GetRoomResponse {
  room: SerializedRoom;
}

export async function createRoom(request: CreateRoomRequest): Promise<CreateRoomResponse> {
  const response = await fetch(`${API_BASE}/api/multiplayer/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create room");
  }

  return response.json();
}

export async function getRoom(roomId: string): Promise<GetRoomResponse> {
  const response = await fetch(`${API_BASE}/api/multiplayer/rooms/${roomId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Room not found");
    }
    const error = await response.json();
    throw new Error(error.message || "Failed to get room");
  }

  return response.json();
}

export function getInviteLink(roomId: string): string {
  return `${window.location.origin}/lobby/${roomId}`;
}

export async function copyInviteLink(roomId: string): Promise<boolean> {
  try {
    const link = getInviteLink(roomId);
    await navigator.clipboard.writeText(link);
    return true;
  } catch (error) {
    console.error("Failed to copy invite link:", error);
    return false;
  }
}
