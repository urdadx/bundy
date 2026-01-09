import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

// Multiplayer room - stores room configuration and state
export const multiplayerRoom = sqliteTable(
  "multiplayer_room",
  {
    id: text("id").primaryKey(), // Room code like "ABC123"
    hostId: text("host_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    guestId: text("guest_id").references(() => user.id, { onDelete: "set null" }),
    
    // Game settings
    theme: text("theme").notNull().default("animals"), // animals, food, science, etc.
    difficulty: text("difficulty").notNull().default("medium"), // easy, medium, hard, expert
    gridSize: integer("grid_size").notNull().default(10),
    wordCount: integer("word_count").notNull().default(7),
    timeLimit: integer("time_limit").notNull().default(600), // 10 minutes in seconds
    
    // Room state
    status: text("status").notNull().default("waiting"), // waiting, ready, playing, finished
    hostReady: integer("host_ready", { mode: "boolean" }).notNull().default(false),
    guestReady: integer("guest_ready", { mode: "boolean" }).notNull().default(false),
    
    // Generated puzzle data (stored as JSON string)
    puzzleData: text("puzzle_data"), // JSON: { grid: string[][], words: WordInfo[] }
    
    // Scores
    hostScore: integer("host_score").notNull().default(0),
    guestScore: integer("guest_score").notNull().default(0),
    
    // Found words tracking (JSON array of { word: string, foundBy: 'host' | 'guest' })
    foundWords: text("found_words").default("[]"),
    
    // Winner
    winnerId: text("winner_id").references(() => user.id, { onDelete: "set null" }),
    isDraw: integer("is_draw", { mode: "boolean" }).notNull().default(false),
    
    // Timing
    gameStartedAt: integer("game_started_at", { mode: "timestamp_ms" }),
    gameEndedAt: integer("game_ended_at", { mode: "timestamp_ms" }),
    
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("multiplayerRoom_hostId_idx").on(table.hostId),
    index("multiplayerRoom_guestId_idx").on(table.guestId),
    index("multiplayerRoom_status_idx").on(table.status),
  ]
);

// Multiplayer game session - tracks individual player performance in a multiplayer game
export const multiplayerSession = sqliteTable(
  "multiplayer_session",
  {
    id: text("id").primaryKey(),
    roomId: text("room_id")
      .notNull()
      .references(() => multiplayerRoom.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    
    // Performance
    wordsFound: integer("words_found").notNull().default(0),
    score: integer("score").notNull().default(0),
    
    // Result
    isWinner: integer("is_winner", { mode: "boolean" }).notNull().default(false),
    xpEarned: integer("xp_earned").notNull().default(0),
    diamondsEarned: integer("diamonds_earned").notNull().default(0),
    
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("multiplayerSession_roomId_idx").on(table.roomId),
    index("multiplayerSession_userId_idx").on(table.odId),
    index("multiplayerSession_roomId_userId_idx").on(table.roomId, table.odId),
  ]
);

// Relations
export const multiplayerRoomRelations = relations(multiplayerRoom, ({ one, many }) => ({
  host: one(user, {
    fields: [multiplayerRoom.hostId],
    references: [user.id],
    relationName: "hostUser",
  }),
  guest: one(user, {
    fields: [multiplayerRoom.guestId],
    references: [user.id],
    relationName: "guestUser",
  }),
  winner: one(user, {
    fields: [multiplayerRoom.winnerId],
    references: [user.id],
    relationName: "winnerUser",
  }),
  sessions: many(multiplayerSession),
}));

export const multiplayerSessionRelations = relations(multiplayerSession, ({ one }) => ({
  room: one(multiplayerRoom, {
    fields: [multiplayerSession.roomId],
    references: [multiplayerRoom.id],
  }),
  user: one(user, {
    fields: [multiplayerSession.userId],
    references: [user.id],
  }),
}));
