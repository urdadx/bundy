import { useCallback, useEffect } from "react";
import { useMultiplayerSocket } from "@/hooks/use-multiplayer-socket";
import { useMultiplayerStore } from "@/stores/multiplayer-store";
import { useSession } from "@/lib/auth-client";
import type { ClientMessage } from "@/lib/multiplayer/types";

interface UseMultiplayerGameOptions {
  roomId?: string;
  autoConnect?: boolean;
}

export function useMultiplayerGame(options: UseMultiplayerGameOptions = {}) {
  const { roomId, autoConnect = false } = options;

  const store = useMultiplayerStore();
  const { data: session } = useSession();
  const {
    odId,
    odName,
    odAvatar,
    room,
    countdown,
    gameStartTime,
    opponentCursor,
    error,
    disconnectedPlayerId,
    reconnectTimeout,
    rematchRequestedBy,
    connectionState,
    setConnectionState,
    handleServerMessage,
    setRoomId,
    setUser,
    reset,
    clearError,
    getCurrentPlayer,
    getOpponent,
    isHost,
    getMyScore,
    getOpponentScore,
    getFoundWords,
    getMyFoundWords,
    getOpponentFoundWords,
    getRemainingWordsCount,
    getGameStatus,
    getWinner,
    getPuzzle,
    getSettings,
  } = store;

  // Sync session user with store
  useEffect(() => {
    if (session?.user && (!odId || !odName)) {
      setUser(session.user.id, session.user.name || "Player", "jack-avatar.png");
    }
  }, [session?.user, odId, odName, setUser]);

  // WebSocket connection
  const { connect, disconnect, send, isConnected } = useMultiplayerSocket({
    onMessage: handleServerMessage,
    onConnect: () => setConnectionState("connected"),
    onDisconnect: () => setConnectionState("disconnected"),
    onReconnecting: () => setConnectionState("reconnecting"),
    autoReconnect: true,
  });

  // Join room callback
  const joinRoom = useCallback(() => {
    if (!odId || !odName || !store.roomId) {
      console.error("Cannot join room: missing user info or room ID");
      return;
    }

    send({
      type: "join_room",
      roomId: store.roomId,
      odId,
      odName,
      avatar: odAvatar || "jack-avatar.png",
    });
  }, [odId, odName, odAvatar, store.roomId, send]);

  // Set room ID if provided
  useEffect(() => {
    if (roomId) {
      setRoomId(roomId);
    }
  }, [roomId, setRoomId]);

  // Auto join if enabled or when required data is ready
  useEffect(() => {
    if ((autoConnect || roomId) && isConnected && odId && odName && store.roomId) {
      joinRoom();
    }
  }, [autoConnect, roomId, isConnected, odId, odName, store.roomId, joinRoom]);

  // Leave room
  const leaveRoom = useCallback(() => {
    send({ type: "leave_room" });
    reset();
  }, [send, reset]);

  // Set ready status
  const setReady = useCallback(
    (ready: boolean) => {
      send({ type: "player_ready", ready });
    },
    [send]
  );

  // Update avatar
  const updateAvatar = useCallback(
    (avatar: string) => {
      send({ type: "update_avatar", avatar });
    },
    [send]
  );

  // Move cursor
  const moveCursor = useCallback(
    (x: number, y: number) => {
      send({ type: "cursor_move", x, y });
    },
    [send]
  );

  // Leave cursor
  const leaveCursor = useCallback(() => {
    send({ type: "cursor_leave" });
  }, [send]);

  // Claim word
  const claimWord = useCallback(
    (word: string, start: { r: number; c: number }, end: { r: number; c: number }) => {
      send({ type: "claim_word", word, start, end });
    },
    [send]
  );

  // Request rematch
  const requestRematch = useCallback(() => {
    send({ type: "request_rematch" });
  }, [send]);

  // Send raw message (for advanced usage)
  const sendMessage = useCallback(
    (message: ClientMessage) => {
      send(message);
    },
    [send]
  );

  return {
    // Connection
    connect,
    disconnect,
    isConnected,
    connectionState,
    isConnecting: connectionState === "connecting" || connectionState === "reconnecting",

    // Room state
    room,
    roomId: store.roomId,

    // User info
    odId,
    odName,
    odAvatar,

    // Game state
    countdown,
    gameStartTime,
    opponentCursor,
    error,
    disconnectedPlayerId,
    reconnectTimeout,
    rematchRequestedBy,

    // Derived state
    currentPlayer: getCurrentPlayer(),
    opponent: getOpponent(),
    isHost: isHost(),
    myScore: getMyScore(),
    opponentScore: getOpponentScore(),
    foundWords: getFoundWords(),
    myFoundWords: getMyFoundWords(),
    opponentFoundWords: getOpponentFoundWords(),
    remainingWordsCount: getRemainingWordsCount(),
    gameStatus: getGameStatus(),
    winner: getWinner(),
    puzzle: getPuzzle(),
    settings: getSettings(),
    phase: room?.status || "waiting",
    players: room?.players || [],
    myPlayerId: odId,

    // Actions
    joinRoom,
    leaveRoom,
    setReady,
    updateAvatar,
    moveCursor,
    leaveCursor,
    claimWord,
    requestRematch,
    sendMessage,
    clearError,
    reset,
  };
}
