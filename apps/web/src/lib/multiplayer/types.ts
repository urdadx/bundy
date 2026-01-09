// Shared types for multiplayer WebSocket communication
// These types are used by both client and server

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
  score: number;
  wordsFound: string[];
  cursor: { x: number; y: number } | null;
  color: string;
}

export interface GameSettings {
  theme: string;
  difficulty: string;
  gridSize: number;
  wordCount: number;
  timeLimit: number; // in seconds (default 600 = 10 min)
}

export interface PuzzleData {
  grid: string[][];
  words: Array<{
    word: string;
    start: { r: number; c: number };
    end: { r: number; c: number };
  }>;
}

export interface FoundWord {
  word: string;
  foundBy: string;
  start: { r: number; c: number };
  end: { r: number; c: number };
}

export type RoomStatus = "waiting" | "ready" | "playing" | "finished";

// Serialized room for client
export interface SerializedRoom {
  id: string;
  hostId: string;
  settings: GameSettings;
  status: RoomStatus;
  puzzle: PuzzleData | null;
  foundWords: FoundWord[];
  gameStartedAt: number | null;
  winnerId: string | null;
  isDraw: boolean;
}

// Client -> Server messages
export type ClientMessage =
  | { type: "join_room"; roomId: string; odId: string; odName: string; avatar: string }
  | { type: "leave_room" }
  | { type: "player_ready"; ready: boolean }
  | { type: "update_avatar"; avatar: string }
  | { type: "cursor_move"; x: number; y: number }
  | { type: "cursor_leave" }
  | { type: "claim_word"; word: string; start: { r: number; c: number }; end: { r: number; c: number } }
  | { type: "request_rematch" }
  | { type: "chat_message"; content: string }
  | { type: "typing"; isTyping: boolean }
  | { type: "ping" };

// Server -> Client messages
export type ServerMessage =
  | { type: "room_state"; room: SerializedRoom }
  | { type: "player_joined"; player: Player }
  | { type: "player_left"; odId: string; odName: string }
  | { type: "player_ready_changed"; odId: string; ready: boolean }
  | { type: "player_avatar_changed"; odId: string; avatar: string }
  | { type: "game_starting"; countdown: number }
  | { type: "game_started"; puzzle: PuzzleData; startTime: number }
  | { type: "cursor_update"; odId: string; x: number; y: number }
  | { type: "cursor_left"; odId: string }
  | { type: "word_claimed"; word: string; odId: string; playerName: string; start: { r: number; c: number }; end: { r: number; c: number }; hostScore: number; guestScore: number }
  | { type: "word_claim_rejected"; word: string; reason: string }
  | { type: "game_ended"; winnerId: string | null; isDraw: boolean; hostScore: number; guestScore: number }
  | { type: "player_disconnected"; odId: string; odName: string; reconnectTimeout: number }
  | { type: "player_reconnected"; odId: string }
  | { type: "opponent_left"; reason: string }
  | { type: "rematch_requested"; odId: string }
  | { type: "rematch_starting"; countdown: number }
  | { type: "chat_message"; id: string; senderId: string; senderName: string; senderAvatar: string; content: string; timestamp: number }
  | { type: "player_typing"; odId: string; isTyping: boolean }
  | { type: "error"; message: string }
  | { type: "pong" };

// Connection state
export type ConnectionState = "connecting" | "connected" | "disconnected" | "reconnecting";

// Avatar options (matching the files in assets/avatars)
export const AVATAR_OPTIONS = [
  "jack-avatar.png",
  "marie-avatar.png", 
  "rudeus-avatar.png",
] as const;

export type AvatarOption = typeof AVATAR_OPTIONS[number];

export const PLAYER_COLORS = {
  host: "#1cb0f6", 
  guest: "#ff4b4b",
} as const;
