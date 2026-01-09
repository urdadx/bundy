import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
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

// Opponent cursor position
interface OpponentCursor {
  odId: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

// Store state
interface MultiplayerState {
  // Connection
  connectionState: ConnectionState;
  
  // User info
  odId: string | null;
  odName: string | null;
  odAvatar: string | null;
  
  // Room state
  room: SerializedRoom | null;
  roomId: string | null;
  
  // Game state
  countdown: number | null;
  gameStartTime: number | null;
  
  // Opponent cursor
  opponentCursor: OpponentCursor | null;
  
  // Rematch
  rematchRequestedBy: string | null;
  
  // Error
  error: string | null;
  
  // Disconnection
  disconnectedPlayerId: string | null;
  reconnectTimeout: number | null;
}

// Store actions
interface MultiplayerActions {
  // User setup
  setUser: (odId: string, odName: string, odAvatar: string) => void;
  
  // Connection
  setConnectionState: (state: ConnectionState) => void;
  
  // Room
  setRoom: (room: SerializedRoom | null) => void;
  setRoomId: (roomId: string | null) => void;
  
  // Handle server messages
  handleServerMessage: (message: ServerMessage) => void;
  
  // Game actions
  setCountdown: (countdown: number | null) => void;
  
  // Clear state
  reset: () => void;
  clearError: () => void;
}

// Derived getters
interface MultiplayerGetters {
  // Get current player
  getCurrentPlayer: () => Player | null;
  
  // Get opponent player
  getOpponent: () => Player | null;
  
  // Get if current user is host
  isHost: () => boolean;
  
  // Get current player's score
  getMyScore: () => number;
  
  // Get opponent's score
  getOpponentScore: () => number;
  
  // Get all found words
  getFoundWords: () => FoundWord[];
  
  // Get words found by current player
  getMyFoundWords: () => FoundWord[];
  
  // Get words found by opponent
  getOpponentFoundWords: () => FoundWord[];
  
  // Get remaining words count
  getRemainingWordsCount: () => number;
  
  // Get game status
  getGameStatus: () => RoomStatus | null;
  
  // Get winner info
  getWinner: () => { player: Player; isDraw: boolean } | null;
  
  // Get puzzle
  getPuzzle: () => PuzzleData | null;
  
  // Get settings
  getSettings: () => GameSettings | null;
}

type MultiplayerStore = MultiplayerState & MultiplayerActions & MultiplayerGetters;

// Initial state
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
  error: null,
  disconnectedPlayerId: null,
  reconnectTimeout: null,
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

    // Handle incoming server messages
    handleServerMessage: (message) => {
      const state = get();

      switch (message.type) {
        case "room_state":
          set({ room: message.room, roomId: message.room.id, error: null });
          break;

        case "player_joined": {
          const room = state.room;
          if (!room) break;
          
          // Check if player already exists
          const existingIndex = room.players.findIndex(p => p.id === message.player.id);
          const updatedPlayers = existingIndex >= 0
            ? room.players.map((p, i) => i === existingIndex ? message.player : p)
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
          
          set({
            room: {
              ...room,
              players: room.players.filter(p => p.id !== message.odId),
              guestId: room.guestId === message.odId ? null : room.guestId,
            },
            opponentCursor: state.opponentCursor?.odId === message.odId ? null : state.opponentCursor,
          });
          break;
        }

        case "player_ready_changed": {
          const room = state.room;
          if (!room) break;
          
          set({
            room: {
              ...room,
              players: room.players.map(p =>
                p.id === message.odId ? { ...p, isReady: message.ready } : p
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
              players: room.players.map(p =>
                p.id === message.odId ? { ...p, avatar: message.avatar } : p
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
          });
          break;
        }

        case "cursor_update": {
          const room = state.room;
          if (!room || message.odId === state.odId) break;
          
          const player = room.players.find(p => p.id === message.odId);
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
              players: room.players.map(p => {
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
          // Could show a toast or visual feedback
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
              players: room.players.map(p => {
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
          set({
            disconnectedPlayerId: message.odId,
            reconnectTimeout: message.reconnectTimeout,
          });
          break;

        case "player_reconnected": {
          const room = state.room;
          if (!room) break;
          
          set({
            room: {
              ...room,
              players: room.players.map(p =>
                p.id === message.odId ? { ...p, isConnected: true } : p
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
              status: "waiting",
              puzzle: null,
              foundWords: [],
              gameStartedAt: null,
              winnerId: null,
              isDraw: false,
              players: room.players.map(p => ({
                ...p,
                score: 0,
                wordsFound: [],
                isReady: false,
                cursor: null,
              })),
            },
            gameStartTime: null,
            countdown: null,
            rematchRequestedBy: null,
            opponentCursor: null,
          });
          break;
        }

        case "error":
          set({ error: message.message });
          break;

        case "pong":
          // Connection is alive, no action needed
          break;
      }
    },

    // ============ Getters ============

    getCurrentPlayer: () => {
      const { room, odId } = get();
      if (!room || !odId) return null;
      return room.players.find(p => p.id === odId) ?? null;
    },

    getOpponent: () => {
      const { room, odId } = get();
      if (!room || !odId) return null;
      return room.players.find(p => p.id !== odId) ?? null;
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
      return room.foundWords.filter(fw => fw.foundBy === odId);
    },

    getOpponentFoundWords: () => {
      const { room, odId } = get();
      if (!room || !odId) return [];
      return room.foundWords.filter(fw => fw.foundBy !== odId);
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
      
      const winner = room.players.find(p => p.id === room.winnerId);
      if (!winner) return null;
      
      return { player: winner, isDraw: false };
    },

    getPuzzle: () => {
      return get().room?.puzzle ?? null;
    },

    getSettings: () => {
      return get().room?.settings ?? null;
    },
  }))
);

// Selector hooks for common patterns
export const useCurrentPlayer = () => useMultiplayerStore(state => state.getCurrentPlayer());
export const useOpponent = () => useMultiplayerStore(state => state.getOpponent());
export const useGameStatus = () => useMultiplayerStore(state => state.getGameStatus());
export const usePuzzle = () => useMultiplayerStore(state => state.getPuzzle());
export const useOpponentCursor = () => useMultiplayerStore(state => state.opponentCursor);
export const useCountdown = () => useMultiplayerStore(state => state.countdown);
export const useRoomId = () => useMultiplayerStore(state => state.roomId);
export const useIsHost = () => useMultiplayerStore(state => state.isHost());
