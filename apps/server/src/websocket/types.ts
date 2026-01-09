import type { ServerWebSocket } from "bun";

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
  color: string; // Player's color for cursor and found words
}

export interface Room {
  id: string;
  hostId: string;
  guestId: string | null;
  players: Map<string, Player>;
  settings: GameSettings;
  status: RoomStatus;
  puzzle: PuzzleData | null;
  foundWords: FoundWord[];
  gameStartedAt: number | null;
  gameEndedAt: number | null;
  winnerId: string | null;
  isDraw: boolean;
  disconnectTimers: Map<string, Timer>;
  rematchVotes: Set<string>;
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
  foundBy: string; // player ID
  start: { r: number; c: number };
  end: { r: number; c: number };
}

export type RoomStatus = "waiting" | "ready" | "playing" | "finished";

export interface WSData {
  odId: string;
  odName: string;
  roomId: string;
  odAvatar: string;
}

export type WSConnection = ServerWebSocket<WSData>;

// ============ MESSAGE TYPES ============

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
  | { type: "ping" };

// Server -> Client messages
export type ServerMessage =
  | { type: "room_state"; room: SerializedRoom }
  | { type: "player_joined"; player: Player }
  | { type: "player_left"; odId: string }
  | { type: "player_ready_changed"; odId: string; ready: boolean }
  | { type: "player_avatar_changed"; odId: string; avatar: string }
  | { type: "game_starting"; countdown: number }
  | { type: "game_started"; puzzle: PuzzleData; startTime: number }
  | { type: "cursor_update"; odId: string; x: number; y: number }
  | { type: "cursor_left"; odId: string }
  | { type: "word_claimed"; word: string; odId: string; playerName: string; start: { r: number; c: number }; end: { r: number; c: number }; hostScore: number; guestScore: number }
  | { type: "word_claim_rejected"; word: string; reason: string }
  | { type: "game_ended"; winnerId: string | null; isDraw: boolean; hostScore: number; guestScore: number }
  | { type: "player_disconnected"; odId: string; reconnectTimeout: number }
  | { type: "player_reconnected"; odId: string }
  | { type: "opponent_left"; reason: string }
  | { type: "rematch_requested"; odId: string }
  | { type: "rematch_starting"; countdown: number }
  | { type: "error"; message: string }
  | { type: "pong" };

// Serialized room for sending to clients (Maps converted to arrays)
export interface SerializedRoom {
  id: string;
  hostId: string;
  guestId: string | null;
  players: Player[];
  settings: GameSettings;
  status: RoomStatus;
  puzzle: PuzzleData | null;
  foundWords: FoundWord[];
  gameStartedAt: number | null;
  winnerId: string | null;
  isDraw: boolean;
}

// Utility to serialize room for transmission
export function serializeRoom(room: Room): SerializedRoom {
  return {
    id: room.id,
    hostId: room.hostId,
    guestId: room.guestId,
    players: Array.from(room.players.values()),
    settings: room.settings,
    status: room.status,
    puzzle: room.puzzle,
    foundWords: room.foundWords,
    gameStartedAt: room.gameStartedAt,
    winnerId: room.winnerId,
    isDraw: room.isDraw,
  };
}
