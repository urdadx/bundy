import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { toast } from "sonner";
import type {
  SerializedRoom,
  Player,
  PuzzleData,
  FoundWord,
  GameSettings,
  RoomStatus,
  ServerMessage,
  ConnectionState,
} from "@/lib/multiplayer/types";

interface OpponentCursor {
  odId: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: number;
}

interface MultiplayerState {
  connectionState: ConnectionState;

  odId: string | null;
  odName: string | null;
  odAvatar: string | null;

  room: SerializedRoom | null;
  roomId: string | null;

  countdown: number | null;
  gameStartTime: number | null;

  opponentCursor: OpponentCursor | null;

  rematchRequestedBy: string | null;
  isRematch: boolean;

  error: string | null;

  disconnectedPlayerId: string | null;
  reconnectTimeout: number | null;

  chatMessages: ChatMessage[];
  isOpponentTyping: boolean;
}

interface MultiplayerActions {
  setUser: (odId: string, odName: string, odAvatar: string) => void;

  setConnectionState: (state: ConnectionState) => void;

  setRoom: (room: SerializedRoom | null) => void;
  setRoomId: (roomId: string | null) => void;

  handleServerMessage: (message: ServerMessage) => void;

  setCountdown: (countdown: number | null) => void;

  reset: () => void;
  clearError: () => void;
}

interface MultiplayerGetters {
  getCurrentPlayer: () => Player | null;

  getOpponent: () => Player | null;

  isHost: () => boolean;

  getMyScore: () => number;

  getOpponentScore: () => number;

  getFoundWords: () => FoundWord[];

  getMyFoundWords: () => FoundWord[];

  getOpponentFoundWords: () => FoundWord[];

  getRemainingWordsCount: () => number;

  getGameStatus: () => RoomStatus | null;

  getWinner: () => { player: Player; isDraw: boolean } | null;

  getPuzzle: () => PuzzleData | null;

  getSettings: () => GameSettings | null;
}

type MultiplayerStore = MultiplayerState & MultiplayerActions & MultiplayerGetters;

const initialState: MultiplayerState = {
  connectionState: "disconnected",
  odId: null,
  odName: null,
  odAvatar: null,
  room: null,
  roomId: null,
  countdown: null,
  gameStartTime: null,
  opponentCursor: null,
  rematchRequestedBy: null,
  isRematch: false,
  error: null,
  disconnectedPlayerId: null,
  reconnectTimeout: null,
  chatMessages: [],
  isOpponentTyping: false,
};

export const useMultiplayerStore = create<MultiplayerStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // ============ Actions ============

    setUser: (odId, odName, odAvatar) => {
      set({ odId, odName, odAvatar });
    },

    setConnectionState: (connectionState) => {
      set({ connectionState });
    },

    setRoom: (room) => {
      set({ room, roomId: room?.id ?? null });
    },

    setRoomId: (roomId) => {
      set({ roomId });
    },

    setCountdown: (countdown) => {
      set({ countdown });
    },

    clearError: () => {
      set({ error: null });
    },

    reset: () => {
      set(initialState);
    },

    handleServerMessage: (message) => {
      const state = get();

      switch (message.type) {
        case "room_state":
          set({ room: message.room, roomId: message.room.id, error: null });
          break;

        case "player_joined": {
          const room = state.room;
          if (!room) break;

          if (message.player.id !== state.odId) {
            toast.success(`${message.player.name} has joined the game`);
          }

          // Check if player already exists
          const existingIndex = room.players.findIndex((p) => p.id === message.player.id);
          const updatedPlayers =
            existingIndex >= 0
              ? room.players.map((p, i) => (i === existingIndex ? message.player : p))
              : [...room.players, message.player];

          set({
            room: {
              ...room,
              players: updatedPlayers,
              guestId: message.player.isHost ? room.guestId : message.player.id,
            },
          });
          break;
        }

        case "player_left": {
          const room = state.room;
          if (!room) break;

          toast.info(`${message.odName} has left the game`, {
            duration: 4000,
          });

          set({
            room: {
              ...room,
              players: room.players.filter((p) => p.id !== message.odId),
              guestId: room.guestId === message.odId ? null : room.guestId,
            },
            opponentCursor:
              state.opponentCursor?.odId === message.odId ? null : state.opponentCursor,
          });
          break;
        }

        case "player_ready_changed": {
          const room = state.room;
          if (!room) break;

          set({
            room: {
              ...room,
              players: room.players.map((p) =>
                p.id === message.odId ? { ...p, isReady: message.ready } : p,
              ),
            },
          });
          break;
        }

        case "player_avatar_changed": {
          const room = state.room;
          if (!room) break;

          set({
            room: {
              ...room,
              players: room.players.map((p) =>
                p.id === message.odId ? { ...p, avatar: message.avatar } : p,
              ),
            },
          });
          break;
        }

        case "game_starting":
          set({ countdown: message.countdown });
          break;

        case "game_started": {
          const room = state.room;
          if (!room) break;

          set({
            room: {
              ...room,
              status: "playing",
              puzzle: message.puzzle,
              foundWords: [],
              gameStartedAt: message.startTime,
            },
            gameStartTime: message.startTime,
            countdown: null,
            isRematch: false,
          });
          break;
        }

        case "cursor_update": {
          const room = state.room;
          if (!room || message.odId === state.odId) break;

          const player = room.players.find((p) => p.id === message.odId);
          if (!player) break;

          set({
            opponentCursor: {
              odId: message.odId,
              x: message.x,
              y: message.y,
              color: player.color,
              name: player.name,
            },
          });
          break;
        }

        case "cursor_left":
          if (state.opponentCursor?.odId === message.odId) {
            set({ opponentCursor: null });
          }
          break;

        case "word_claimed": {
          const room = state.room;
          if (!room) break;

          const newFoundWord: FoundWord = {
            word: message.word,
            foundBy: message.odId,
            start: message.start,
            end: message.end,
          };

          set({
            room: {
              ...room,
              foundWords: [...room.foundWords, newFoundWord],
              players: room.players.map((p) => {
                if (p.id === room.hostId) {
                  return { ...p, score: message.hostScore };
                }
                if (p.id === room.guestId) {
                  return { ...p, score: message.guestScore };
                }
                return p;
              }),
            },
          });
          break;
        }

        case "word_claim_rejected":
          console.warn(`Word claim rejected: ${message.word} - ${message.reason}`);
          break;

        case "game_ended": {
          const room = state.room;
          if (!room) break;

          set({
            room: {
              ...room,
              status: "finished",
              winnerId: message.winnerId,
              isDraw: message.isDraw,
              players: room.players.map((p) => {
                if (p.id === room.hostId) {
                  return { ...p, score: message.hostScore };
                }
                if (p.id === room.guestId) {
                  return { ...p, score: message.guestScore };
                }
                return p;
              }),
            },
            opponentCursor: null,
          });
          break;
        }

        case "player_disconnected":
          toast.info(`${message.odName} disconnected`);
          set({
            disconnectedPlayerId: message.odId,
            reconnectTimeout: message.reconnectTimeout,
          });
          break;

        case "player_reconnected": {
          const room = state.room;
          if (!room) break;

          const player = room.players.find((p) => p.id === message.odId);
          if (player) {
            toast.success(`${player.name} reconnected`);
          }

          set({
            room: {
              ...room,
              players: room.players.map((p) =>
                p.id === message.odId ? { ...p, isConnected: true } : p,
              ),
            },
            disconnectedPlayerId: null,
            reconnectTimeout: null,
          });
          break;
        }

        case "opponent_left":
          set({ error: message.reason });
          break;

        case "rematch_requested":
          set({ rematchRequestedBy: message.odId });
          break;

        case "rematch_starting": {
          const room = state.room;
          if (!room) break;

          set({
            room: {
              ...room,
              status: "ready",
              puzzle: null,
              foundWords: [],
              gameStartedAt: null,
              winnerId: null,
              isDraw: false,
              players: room.players.map((p) => ({
                ...p,
                score: 0,
                wordsFound: [],
                isReady: true,
                cursor: null,
              })),
            },
            gameStartTime: null,
            countdown: message.countdown,
            rematchRequestedBy: null,
            opponentCursor: null,
            isRematch: true,
          });
          break;
        }

        case "chat_message": {
          const newMessage: ChatMessage = {
            id: message.id,
            senderId: message.senderId,
            senderName: message.senderName,
            senderAvatar: message.senderAvatar,
            content: message.content,
            timestamp: message.timestamp,
          };
          set({ chatMessages: [...state.chatMessages, newMessage] });
          break;
        }

        case "player_typing": {
          if (message.odId !== state.odId) {
            set({ isOpponentTyping: message.isTyping });
          }
          break;
        }

        case "error":
          set({ error: message.message });
          break;

        case "pong":
          break;
      }
    },

    // ============ Getters ============

    getCurrentPlayer: () => {
      const { room, odId } = get();
      if (!room || !odId) return null;
      return room.players.find((p) => p.id === odId) ?? null;
    },

    getOpponent: () => {
      const { room, odId } = get();
      if (!room || !odId) return null;
      return room.players.find((p) => p.id !== odId) ?? null;
    },

    isHost: () => {
      const { room, odId } = get();
      if (!room || !odId) return false;
      return room.hostId === odId;
    },

    getMyScore: () => {
      return get().getCurrentPlayer()?.score ?? 0;
    },

    getOpponentScore: () => {
      return get().getOpponent()?.score ?? 0;
    },

    getFoundWords: () => {
      return get().room?.foundWords ?? [];
    },

    getMyFoundWords: () => {
      const { room, odId } = get();
      if (!room || !odId) return [];
      return room.foundWords.filter((fw) => fw.foundBy === odId);
    },

    getOpponentFoundWords: () => {
      const { room, odId } = get();
      if (!room || !odId) return [];
      return room.foundWords.filter((fw) => fw.foundBy !== odId);
    },

    getRemainingWordsCount: () => {
      const room = get().room;
      if (!room?.puzzle) return 0;
      return room.puzzle.words.length - room.foundWords.length;
    },

    getGameStatus: () => {
      return get().room?.status ?? null;
    },

    getWinner: () => {
      const room = get().room;
      if (!room || room.status !== "finished") return null;

      if (room.isDraw) {
        return { player: room.players[0], isDraw: true };
      }

      const winner = room.players.find((p) => p.id === room.winnerId);
      if (!winner) return null;

      return { player: winner, isDraw: false };
    },

    getPuzzle: () => {
      return get().room?.puzzle ?? null;
    },

    getSettings: () => {
      return get().room?.settings ?? null;
    },
  })),
);

export const useCurrentPlayer = () => useMultiplayerStore((state) => state.getCurrentPlayer());
export const useOpponent = () => useMultiplayerStore((state) => state.getOpponent());
export const useGameStatus = () => useMultiplayerStore((state) => state.getGameStatus());
export const usePuzzle = () => useMultiplayerStore((state) => state.getPuzzle());
export const useOpponentCursor = () => useMultiplayerStore((state) => state.opponentCursor);
export const useCountdown = () => useMultiplayerStore((state) => state.countdown);
export const useRoomId = () => useMultiplayerStore((state) => state.roomId);
export const useIsHost = () => useMultiplayerStore((state) => state.isHost());
