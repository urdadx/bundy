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
    isRematch,
    chatMessages,
    isOpponentTyping,
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

  useEffect(() => {
    if (session?.user && (!odId || !odName)) {
      setUser(session.user.id, session.user.name || "Player", session.user.image || "jack-avatar.png");
    }
  }, [session?.user, odId, odName, setUser]);

  const { connect, disconnect, send, isConnected } = useMultiplayerSocket({
    onMessage: handleServerMessage,
    onConnect: () => setConnectionState("connected"),
    onDisconnect: () => setConnectionState("disconnected"),
    onReconnecting: () => setConnectionState("reconnecting"),
    autoReconnect: true,
  });

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

  useEffect(() => {
    if (roomId) {
      setRoomId(roomId);
    }
  }, [roomId, setRoomId]);

  useEffect(() => {
    if ((autoConnect || roomId) && isConnected && odId && odName && store.roomId) {
      joinRoom();
    }
  }, [autoConnect, roomId, isConnected, odId, odName, store.roomId, joinRoom]);

  const leaveRoom = useCallback(() => {
    send({ type: "leave_room" });
    reset();
  }, [send, reset]);

  const setReady = useCallback(
    (ready: boolean) => {
      send({ type: "player_ready", ready });
    },
    [send]
  );

  const updateAvatar = useCallback(
    (avatar: string) => {
      send({ type: "update_avatar", avatar });
    },
    [send]
  );

  const moveCursor = useCallback(
    (x: number, y: number) => {
      send({ type: "cursor_move", x, y });
    },
    [send]
  );

  const leaveCursor = useCallback(() => {
    send({ type: "cursor_leave" });
  }, [send]);

  const claimWord = useCallback(
    (word: string, start: { r: number; c: number }, end: { r: number; c: number }) => {
      send({ type: "claim_word", word, start, end });
    },
    [send]
  );

  const requestRematch = useCallback(() => {
    send({ type: "request_rematch" });
  }, [send]);

  const sendChatMessage = useCallback(
    (content: string) => {
      if (content.trim()) {
        send({ type: "chat_message", content: content.trim() });
      }
    },
    [send]
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      send({ type: "typing", isTyping });
    },
    [send]
  );

  const sendMessage = useCallback(
    (message: ClientMessage) => {
      send(message);
    },
    [send]
  );

  return {
    connect,
    disconnect,
    isConnected,
    connectionState,
    isConnecting: connectionState === "connecting" || connectionState === "reconnecting",

    room,
    roomId: store.roomId,

    odId,
    odName,
    odAvatar,

    countdown,
    gameStartTime,
    opponentCursor,
    error,
    disconnectedPlayerId,
    reconnectTimeout,
    rematchRequestedBy,
    isRematch,
    chatMessages,
    isOpponentTyping,

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

    joinRoom,
    leaveRoom,
    setReady,
    updateAvatar,
    moveCursor,
    leaveCursor,
    claimWord,
    requestRematch,
    sendChatMessage,
    sendTyping,
    sendMessage,
    clearError,
    reset,
  };
}
