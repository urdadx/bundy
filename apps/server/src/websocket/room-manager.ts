import type { Room, Player, GameSettings, PuzzleData, WSConnection, FoundWord } from "./types";

// In-memory room storage
const rooms = new Map<string, Room>();

// Player ID to WebSocket connection mapping
const connections = new Map<string, WSConnection>();

// Player ID to Room ID mapping for quick lookup
const playerRooms = new Map<string, string>();

// Constants
const RECONNECT_TIMEOUT = 7000; // 7 seconds
const POINTS_PER_WORD = 2;
const PLAYER_COLORS = {
  host: "#1cb0f6", // Blue
  guest: "#ff4b4b", // Red
};

// Generate a random room code
export function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new room
export function createRoom(hostId: string, hostName: string, hostAvatar: string, settings: GameSettings): Room {
  let roomId = generateRoomCode();
  // Ensure unique room ID
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

// Get a room by ID
export function getRoom(roomId: string): Room | undefined {
  return rooms.get(roomId);
}

// Get room by player ID
export function getRoomByPlayerId(playerId: string): Room | undefined {
  const roomId = playerRooms.get(playerId);
  return roomId ? rooms.get(roomId) : undefined;
}

// Join a room as guest
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

// Set player ready status
export function setPlayerReady(roomId: string, odId: string, ready: boolean): Room | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  const player = room.players.get(odId);
  if (!player) return null;

  player.isReady = ready;

  // Check if both players are ready
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

// Start the game
export function startGame(roomId: string, puzzle: PuzzleData): Room | null {
  const room = rooms.get(roomId);
  if (!room || room.status !== "ready") return null;

  room.status = "playing";
  room.puzzle = puzzle;
  room.gameStartedAt = Date.now();
  room.foundWords = [];

  // Reset player scores and found words
  for (const player of room.players.values()) {
    player.score = 0;
    player.wordsFound = [];
    player.isReady = false;
  }

  return room;
}

// Claim a word
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

  // Check if word was already claimed
  if (room.foundWords.some(fw => fw.word === word)) {
    return { success: false, reason: "Word already claimed" };
  }

  // Validate the word exists in the puzzle
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

  // Claim the word
  const foundWord: FoundWord = {
    word,
    foundBy: odId,
    start: puzzleWord.start,
    end: puzzleWord.end,
  };

  room.foundWords.push(foundWord);
  player.wordsFound.push(word);
  player.score += POINTS_PER_WORD;

  // Check if game is complete (all words found)
  if (room.foundWords.length === room.puzzle.words.length) {
    endGame(room);
  }

  return { success: true, room };
}

// Update player cursor position
export function updateCursor(roomId: string, odId: string, x: number, y: number): Player | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  const player = room.players.get(odId);
  if (!player) return null;

  player.cursor = { x, y };
  return player;
}

// Clear player cursor
export function clearCursor(roomId: string, odId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  const player = room.players.get(odId);
  if (player) {
    player.cursor = null;
  }
}

// End the game
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

// Handle player disconnection
export function handleDisconnect(roomId: string, odId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  const player = room.players.get(odId);
  if (!player) return;

  player.isConnected = false;
  player.cursor = null;

  // Set reconnection timer
  const timer = setTimeout(() => {
    handleReconnectTimeout(roomId, odId);
  }, RECONNECT_TIMEOUT);

  room.disconnectTimers.set(odId, timer);
}

// Handle reconnection timeout
function handleReconnectTimeout(roomId: string, odId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  const player = room.players.get(odId);
  if (!player || player.isConnected) return;

  // Player failed to reconnect - opponent wins if game was in progress
  if (room.status === "playing") {
    const opponent = Array.from(room.players.values()).find(p => p.id !== odId);
    if (opponent) {
      room.winnerId = opponent.id;
      room.isDraw = false;
      room.status = "finished";
      room.gameEndedAt = Date.now();

      // Broadcast to opponent
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
  }

  // Remove player from room
  removePlayerFromRoom(roomId, odId);
}

// Clear disconnect timer
function clearDisconnectTimer(room: Room, odId: string): void {
  const timer = room.disconnectTimers.get(odId);
  if (timer) {
    clearTimeout(timer);
    room.disconnectTimers.delete(odId);
  }
}

// Handle player reconnection
export function handleReconnect(roomId: string, odId: string): Room | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  const player = room.players.get(odId);
  if (!player) return null;

  player.isConnected = true;
  clearDisconnectTimer(room, odId);

  return room;
}

// Remove player from room
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

// Set up rematch
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

// Vote for rematch
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

// Store connection
export function setConnection(odId: string, ws: WSConnection): void {
  connections.set(odId, ws);
}

// Get connection
export function getConnection(odId: string): WSConnection | undefined {
  return connections.get(odId);
}

// Remove connection
export function removeConnection(odId: string): void {
  connections.delete(odId);
}

// Broadcast to all players in a room except sender
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

// Broadcast to all players in a room
export function broadcastToAll(roomId: string, message: object): void {
  broadcastToRoom(roomId, message, undefined);
}

// Get scores for a room
export function getScores(room: Room): { hostScore: number; guestScore: number } {
  const host = room.players.get(room.hostId);
  const guest = room.guestId ? room.players.get(room.guestId) : null;

  return {
    hostScore: host?.score ?? 0,
    guestScore: guest?.score ?? 0,
  };
}

// Export rooms for debugging
export function getAllRooms(): Map<string, Room> {
  return rooms;
}
