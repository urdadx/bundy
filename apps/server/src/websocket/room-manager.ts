import type { Room, Player, GameSettings, PuzzleData, WSConnection, FoundWord } from "./types";
import { serializeRoom } from "./types";

// In-memory room storage
const rooms = new Map<string, Room>();

// Player ID to WebSocket connection mapping
const connections = new Map<string, WSConnection>();

// Player ID to Room ID mapping for quick lookup
const playerRooms = new Map<string, string>();

const RECONNECT_TIMEOUT = 10000; 
const POINTS_PER_WORD = 2;
const PLAYER_COLORS = {
  host: "#1cb0f6", 
  guest: "#ff4b4b", 
};

export function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function createRoom(hostId: string, hostName: string, hostAvatar: string, settings: GameSettings): Room {
  let roomId = generateRoomCode();
  while (rooms.has(roomId)) {
    roomId = generateRoomCode();
  }

  const host: Player = {
    id: hostId,
    name: hostName,
    avatar: hostAvatar,
    isHost: true,
    isReady: false,
    isConnected: true,
    score: 0,
    wordsFound: [],
    cursor: null,
    color: PLAYER_COLORS.host,
  };

  const room: Room = {
    id: roomId,
    hostId,
    guestId: null,
    players: new Map([[hostId, host]]),
    settings,
    status: "waiting",
    puzzle: null,
    foundWords: [],
    gameStartedAt: null,
    gameEndedAt: null,
    winnerId: null,
    isDraw: false,
    disconnectTimers: new Map(),
    rematchVotes: new Set(),
  };

  rooms.set(roomId, room);
  playerRooms.set(hostId, roomId);

  return room;
}

export function getRoom(roomId: string): Room | undefined {
  return rooms.get(roomId);
}

export function getRoomByPlayerId(playerId: string): Room | undefined {
  const roomId = playerRooms.get(playerId);
  return roomId ? rooms.get(roomId) : undefined;
}

export function joinRoom(roomId: string, odId: string, odName: string, odAvatar: string): { room: Room; isReconnection: boolean } | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  // Check if this is a reconnection FIRST - allow reconnecting to any room status
  const existingPlayer = room.players.get(odId);
  if (existingPlayer) {
    existingPlayer.isConnected = true;
    clearDisconnectTimer(room, odId);
    return { room, isReconnection: true };
  }

  // For new players, only allow joining if room is in waiting status
  if (room.status !== "waiting") return null;
  if (room.guestId && room.guestId !== odId) return null; // Room full

  const guest: Player = {
    id: odId,
    name: odName,
    avatar: odAvatar,
    isHost: false,
    isReady: false,
    isConnected: true,
    score: 0,
    wordsFound: [],
    cursor: null,
    color: PLAYER_COLORS.guest,
  };

  room.players.set(odId, guest);
  room.guestId = odId;
  playerRooms.set(odId, roomId);

  return { room, isReconnection: false };
}

export function setPlayerReady(roomId: string, odId: string, ready: boolean): Room | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  const player = room.players.get(odId);
  if (!player) return null;

  player.isReady = ready;

  if (room.players.size === 2) {
    const players = Array.from(room.players.values());
    if (players.every(p => p.isReady)) {
      room.status = "ready";
    } else {
      room.status = "waiting";
    }
  }

  return room;
}

export function startGame(roomId: string, puzzle: PuzzleData): Room | null {
  const room = rooms.get(roomId);
  if (!room || room.status !== "ready") return null;

  room.status = "playing";
  room.puzzle = puzzle;
  room.gameStartedAt = Date.now();
  room.foundWords = [];

  for (const player of room.players.values()) {
    player.score = 0;
    player.wordsFound = [];
    player.isReady = false;
  }

  return room;
}

export function claimWord(
  roomId: string,
  odId: string,
  word: string,
  start: { r: number; c: number },
  end: { r: number; c: number }
): { success: boolean; room?: Room; reason?: string } {
  const room = rooms.get(roomId);
  if (!room) return { success: false, reason: "Room not found" };
  if (room.status !== "playing") return { success: false, reason: "Game not in progress" };

  const player = room.players.get(odId);
  if (!player) return { success: false, reason: "Player not in room" };

  if (room.foundWords.some(fw => fw.word === word)) {
    return { success: false, reason: "Word already claimed" };
  }

  if (!room.puzzle) return { success: false, reason: "No puzzle data" };
  
  const puzzleWord = room.puzzle.words.find(w => w.word === word);
  if (!puzzleWord) {
    return { success: false, reason: "Word not in puzzle" };
  }

  // Validate start and end positions match
  const isValidPosition = 
    (puzzleWord.start.r === start.r && puzzleWord.start.c === start.c &&
     puzzleWord.end.r === end.r && puzzleWord.end.c === end.c) ||
    // Also allow reverse selection
    (puzzleWord.start.r === end.r && puzzleWord.start.c === end.c &&
     puzzleWord.end.r === start.r && puzzleWord.end.c === start.c);

  if (!isValidPosition) {
    return { success: false, reason: "Invalid word position" };
  }

  const foundWord: FoundWord = {
    word,
    foundBy: odId,
    start: puzzleWord.start,
    end: puzzleWord.end,
  };

  room.foundWords.push(foundWord);
  player.wordsFound.push(word);
  player.score += POINTS_PER_WORD;

  if (room.foundWords.length === room.puzzle.words.length) {
    endGame(room);
  }

  return { success: true, room };
}

export function updateCursor(roomId: string, odId: string, x: number, y: number): Player | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  const player = room.players.get(odId);
  if (!player) return null;

  player.cursor = { x, y };
  return player;
}

export function clearCursor(roomId: string, odId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  const player = room.players.get(odId);
  if (player) {
    player.cursor = null;
  }
}

export function endGame(room: Room): void {
  room.status = "finished";
  room.gameEndedAt = Date.now();

  const players = Array.from(room.players.values());
  const host = players.find(p => p.isHost);
  const guest = players.find(p => !p.isHost);

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
}

export function handleDisconnect(roomId: string, odId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  const player = room.players.get(odId);
  if (!player) return;

  player.isConnected = false;
  player.cursor = null;

  broadcastToRoom(roomId, { 
    type: "player_disconnected", 
    odId, 
    odName: player.name,
    reconnectTimeout: RECONNECT_TIMEOUT 
  }, odId);

  // Set reconnection timer
  const timer = setTimeout(() => {
    handleReconnectTimeout(roomId, odId);
  }, RECONNECT_TIMEOUT);

  room.disconnectTimers.set(odId, timer);
}

function handleReconnectTimeout(roomId: string, odId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  const player = room.players.get(odId);
  if (!player || player.isConnected) return;

  const odName = player.name;

  // Player failed to reconnect - opponent wins if game was in progress
  if (room.status === "playing") {
    const opponent = Array.from(room.players.values()).find(p => p.id !== odId);
    if (opponent) {
      room.winnerId = opponent.id;
      room.isDraw = false;
      room.status = "finished";
      room.gameEndedAt = Date.now();

      const opponentWs = connections.get(opponent.id);
      if (opponentWs) {
        opponentWs.send(JSON.stringify({
          type: "opponent_left",
          reason: "Opponent disconnected",
        }));
        opponentWs.send(JSON.stringify({
          type: "game_ended",
          winnerId: opponent.id,
          isDraw: false,
          hostScore: room.players.get(room.hostId)?.score ?? 0,
          guestScore: room.guestId ? room.players.get(room.guestId)?.score ?? 0 : 0,
        }));
      }
    }
  } else {
    broadcastToRoom(roomId, { type: "player_left", odId, odName }, odId);
  }

  removePlayerFromRoom(roomId, odId);

  // Broadcast updated room state to remaining players if they are in lobby
  if (room.status !== "playing" && room.status !== "finished") {
    broadcastToRoom(roomId, { type: "room_state", room: serializeRoom(room) }, odId);
  }
}

function clearDisconnectTimer(room: Room, odId: string): void {
  const timer = room.disconnectTimers.get(odId);
  if (timer) {
    clearTimeout(timer);
    room.disconnectTimers.delete(odId);
  }
}

export function handleReconnect(roomId: string, odId: string): Room | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  const player = room.players.get(odId);
  if (!player) return null;

  player.isConnected = true;
  clearDisconnectTimer(room, odId);

  return room;
}

export function removePlayerFromRoom(roomId: string, odId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  clearDisconnectTimer(room, odId);
  room.players.delete(odId);
  room.rematchVotes.delete(odId);
  playerRooms.delete(odId);
  connections.delete(odId);

  if (odId === room.guestId) {
    room.guestId = null;
  }

  // If room is empty, delete it
  if (room.players.size === 0) {
    rooms.delete(roomId);
    return;
  }

  // If host left, make guest the host or delete room
  if (odId === room.hostId) {
    if (room.guestId) {
      room.hostId = room.guestId;
      const newHost = room.players.get(room.guestId);
      if (newHost) {
        newHost.isHost = true;
        newHost.color = PLAYER_COLORS.host;
      }
      room.guestId = null;
    } else {
      rooms.delete(roomId);
    }
  }
}

export function setupRematch(roomId: string): Room | null {
  const room = rooms.get(roomId);
  if (!room || room.status !== "finished") return null;

  room.status = "waiting";
  room.puzzle = null;
  room.foundWords = [];
  room.gameStartedAt = null;
  room.gameEndedAt = null;
  room.winnerId = null;
  room.isDraw = false;
  room.rematchVotes.clear();

  for (const player of room.players.values()) {
    player.score = 0;
    player.wordsFound = [];
    player.isReady = false;
    player.cursor = null;
  }

  return room;
}

export function voteForRematch(roomId: string, odId: string): { room: Room | null, totalVotes: number } {
  const room = rooms.get(roomId);
  if (!room || room.status !== "finished") return { room: null, totalVotes: 0 };

  room.rematchVotes.add(odId);

  // If both players requested, or it's a single player (shouldn't happen)
  if (room.rematchVotes.size >= room.players.size) {
    return { room: setupRematch(roomId), totalVotes: room.rematchVotes.size };
  }

  return { room: null, totalVotes: room.rematchVotes.size };
}

export function setConnection(odId: string, ws: WSConnection): void {
  connections.set(odId, ws);
}

export function getConnection(odId: string): WSConnection | undefined {
  return connections.get(odId);
}

export function removeConnection(odId: string): void {
  connections.delete(odId);
}

export function broadcastToRoom(roomId: string, message: object, excludeId?: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  const messageStr = JSON.stringify(message);
  
  for (const player of room.players.values()) {
    if (player.id === excludeId) continue;
    
    const ws = connections.get(player.id);
    if (ws && player.isConnected) {
      ws.send(messageStr);
    }
  }
}

export function broadcastToAll(roomId: string, message: object): void {
  broadcastToRoom(roomId, message, undefined);
}

export function getScores(room: Room): { hostScore: number; guestScore: number } {
  const host = room.players.get(room.hostId);
  const guest = room.guestId ? room.players.get(room.guestId) : null;

  return {
    hostScore: host?.score ?? 0,
    guestScore: guest?.score ?? 0,
  };
}

export function getAllRooms(): Map<string, Room> {
  return rooms;
}
