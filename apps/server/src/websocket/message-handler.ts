import type { ClientMessage, WSConnection, ServerMessage, GameSettings } from "./types";
import { serializeRoom } from "./types";
import {
  createRoom,
  getRoom,
  joinRoom,
  setPlayerReady,
  startGame,
  claimWord,
  updateCursor,
  clearCursor,
  handleDisconnect,
  removePlayerFromRoom,
  setupRematch,
  voteForRematch,
  setConnection,
  removeConnection,
  broadcastToRoom,
  broadcastToAll,
  getScores,
} from "./room-manager";
import { generatePuzzle } from "./puzzle-generator";

// Send message to a specific connection
function send(ws: WSConnection, message: ServerMessage): void {
  ws.send(JSON.stringify(message));
}

// Handle incoming WebSocket message
export function handleMessage(ws: WSConnection, rawMessage: string): void {
  try {
    const message = JSON.parse(rawMessage) as ClientMessage;

    switch (message.type) {
      case "join_room":
        handleJoinRoom(ws, message.roomId, message.odId, message.odName, message.avatar);
        break;

      case "leave_room":
        handleLeaveRoom(ws);
        break;

      case "player_ready":
        handlePlayerReady(ws, message.ready);
        break;

      case "update_avatar":
        handleUpdateAvatar(ws, message.avatar);
        break;

      case "cursor_move":
        handleCursorMove(ws, message.x, message.y);
        break;

      case "cursor_leave":
        handleCursorLeave(ws);
        break;

      case "claim_word":
        handleClaimWord(ws, message.word, message.start, message.end);
        break;

      case "request_rematch":
        handleRematchRequest(ws);
        break;

      case "ping":
        send(ws, { type: "pong" });
        break;

      default:
        send(ws, { type: "error", message: "Unknown message type" });
    }
  } catch (error) {
    console.error("Error handling message:", error);
    send(ws, { type: "error", message: "Invalid message format" });
  }
}

// Handle join room
function handleJoinRoom(
  ws: WSConnection,
  roomId: string,
  odId: string,
  odName: string,
  avatar: string
): void {
  // Update WebSocket data
  ws.data.odId = odId;
  ws.data.odName = odName;
  ws.data.roomId = roomId;
  ws.data.odAvatar = avatar;

  // Store connection
  setConnection(odId, ws);

  // Try to join room
  const result = joinRoom(roomId, odId, odName, avatar);

  if (!result) {
    send(ws, { type: "error", message: "Cannot join room. Room may be full or not exist." });
    return;
  }

  const { room, isReconnection } = result;
  const player = room.players.get(odId);
  if (!player) return;

  // Send current room state to joining player
  send(ws, { type: "room_state", room: serializeRoom(room) });

  // Notify other players - use appropriate message type
  if (isReconnection) {
    broadcastToRoom(roomId, { type: "player_reconnected", odId }, odId);
  } else {
    broadcastToRoom(roomId, { type: "player_joined", player }, odId);
  }
}

export function handleCreateRoom(
  odId: string,
  odName: string,
  odAvatar: string,
  settings: GameSettings
): { roomId: string } {
  const room = createRoom(odId, odName, odAvatar, settings);
  return { roomId: room.id };
}

function handleLeaveRoom(ws: WSConnection): void {
  const { odId, roomId } = ws.data;
  if (!roomId || !odId) return;

  const room = getRoom(roomId);
  if (!room) return;

  // Notify other players before removing
  broadcastToRoom(roomId, { type: "player_left", odId }, odId);

  // If game was in progress, end it with opponent as winner
  if (room.status === "playing") {
    const opponent = Array.from(room.players.values()).find(p => p.id !== odId);
    if (opponent) {
      room.winnerId = opponent.id;
      room.isDraw = false;
      room.status = "finished";
      room.gameEndedAt = Date.now();

      broadcastToRoom(roomId, {
        type: "game_ended",
        winnerId: opponent.id,
        isDraw: false,
        ...getScores(room),
      }, odId);
    }
  }

  removePlayerFromRoom(roomId, odId);
  removeConnection(odId);
}

// Handle player ready
function handlePlayerReady(ws: WSConnection, ready: boolean): void {
  const { odId, roomId } = ws.data;
  if (!roomId || !odId) return;

  const room = setPlayerReady(roomId, odId, ready);
  if (!room) return;

  // Broadcast ready state change
  broadcastToAll(roomId, { type: "player_ready_changed", odId, ready });

  // If both players are ready, start countdown and game
  if (room.status === "ready") {
    startGameCountdown(roomId);
  }
}

// Handle avatar update
function handleUpdateAvatar(ws: WSConnection, avatar: string): void {
  const { odId, roomId } = ws.data;
  if (!roomId || !odId) return;

  const room = getRoom(roomId);
  if (!room) return;

  const player = room.players.get(odId);
  if (!player) return;

  // Update player avatar
  player.avatar = avatar;

  // Broadcast avatar change to all players in the room
  broadcastToAll(roomId, { type: "player_avatar_changed", odId, avatar });
}

// Start game countdown
async function startGameCountdown(roomId: string): Promise<void> {
  const room = getRoom(roomId);
  if (!room || room.status !== "ready") return;

  // 3-second countdown
  for (let i = 3; i > 0; i--) {
    broadcastToAll(roomId, { type: "game_starting", countdown: i });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if room still exists and both players still ready
    const currentRoom = getRoom(roomId);
    if (!currentRoom || currentRoom.status !== "ready") return;
  }

  // Generate puzzle
  const puzzle = generatePuzzle(room.settings);

  // Start the game
  const updatedRoom = startGame(roomId, puzzle);
  if (!updatedRoom) return;

  // Broadcast game started
  broadcastToAll(roomId, {
    type: "game_started",
    puzzle,
    startTime: updatedRoom.gameStartedAt!,
  });

  // Set up game end timer (10 minutes)
  setTimeout(() => {
    handleGameTimeout(roomId);
  }, room.settings.timeLimit * 1000);
}

// Handle game timeout
function handleGameTimeout(roomId: string): void {
  const room = getRoom(roomId);
  if (!room || room.status !== "playing") return;

  // End the game
  room.status = "finished";
  room.gameEndedAt = Date.now();

  // Determine winner by score
  const host = room.players.get(room.hostId);
  const guest = room.guestId ? room.players.get(room.guestId) : null;

  if (host && guest) {
    if (host.score > guest.score) {
      room.winnerId = host.id;
      room.isDraw = false;
    } else if (guest.score > host.score) {
      room.winnerId = guest.id;
      room.isDraw = false;
    } else {
      room.winnerId = null;
      room.isDraw = true;
    }
  }

  broadcastToAll(roomId, {
    type: "game_ended",
    winnerId: room.winnerId,
    isDraw: room.isDraw,
    ...getScores(room),
  });
}

// Handle cursor move
function handleCursorMove(ws: WSConnection, x: number, y: number): void {
  const { odId, roomId } = ws.data;
  if (!roomId || !odId) return;

  const player = updateCursor(roomId, odId, x, y);
  if (!player) return;

  // Broadcast cursor position to other player
  broadcastToRoom(roomId, { type: "cursor_update", odId, x, y }, odId);
}

// Handle cursor leave
function handleCursorLeave(ws: WSConnection): void {
  const { odId, roomId } = ws.data;
  if (!roomId || !odId) return;

  clearCursor(roomId, odId);
  broadcastToRoom(roomId, { type: "cursor_left", odId }, odId);
}

// Handle word claim
function handleClaimWord(
  ws: WSConnection,
  word: string,
  start: { r: number; c: number },
  end: { r: number; c: number }
): void {
  const { odId, roomId } = ws.data;
  if (!roomId || !odId) return;

  const result = claimWord(roomId, odId, word, start, end);

  if (!result.success) {
    send(ws, { type: "word_claim_rejected", word, reason: result.reason || "Unknown error" });
    return;
  }

  const room = result.room!;
  const player = room.players.get(odId)!;

  // Broadcast successful word claim
  broadcastToAll(roomId, {
    type: "word_claimed",
    word,
    odId,
    playerName: player.name,
    start,
    end,
    ...getScores(room),
  });

  // Check if game ended
  if (room.status === "finished") {
    broadcastToAll(roomId, {
      type: "game_ended",
      winnerId: room.winnerId,
      isDraw: room.isDraw,
      ...getScores(room),
    });
  }
}

// Handle rematch request
function handleRematchRequest(ws: WSConnection): void {
  const { odId, roomId } = ws.data;
  if (!roomId || !odId) return;

  const room = getRoom(roomId);
  if (!room) return;

  // Use the new voting system
  const { room: updatedRoom } = voteForRematch(roomId, odId);

  // Notify other players about rematch request if game hasn't restarted yet
  if (!updatedRoom) {
    broadcastToAll(roomId, { type: "rematch_requested", odId });
  } else {
    // If both players agreed, restart
    broadcastToAll(roomId, { type: "rematch_starting" });
    broadcastToAll(roomId, { type: "room_state", room: serializeRoom(updatedRoom) });
  }
}

// Handle WebSocket open
export function handleOpen(_ws: WSConnection): void {
  console.log("WebSocket connection opened");
}

// Handle WebSocket close
export function handleClose(ws: WSConnection): void {
  const odId = ws.data?.odId;
  const roomId = ws.data?.roomId;
  console.log(`WebSocket connection closed for user ${odId || 'unknown'} in room ${roomId || 'unknown'}`);

  if (odId && roomId) {
    handleDisconnect(roomId, odId);
    
    // Notify other players
    broadcastToRoom(roomId, {
      type: "player_disconnected",
      odId,
      reconnectTimeout: 7000,
    }, odId);
  }
}

// Handle WebSocket error
export function handleError(_ws: WSConnection, error: Error): void {
  console.error("WebSocket error:", error);
}
