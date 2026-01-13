import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

// World definitions - 6 worlds with progression
export const world = sqliteTable("world", {
  id: text("id").primaryKey(), // meadow, relic, volcano, cyber, void, malyka
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").notNull().default("primary"),
  requiredXp: integer("required_xp").notNull(), // XP required to unlock this world
  theme: text("theme").notNull(), // animals, food, science, vocabulary, sports, countries
  order: integer("order").notNull(), // 1-6 for ordering worlds
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});

// Stage definitions - 5 stages per world with increasing difficulty
export const stage = sqliteTable(
  "stage",
  {
    id: text("id").primaryKey(), // e.g., meadow-1, meadow-2, etc.
    worldId: text("world_id")
      .notNull()
      .references(() => world.id, { onDelete: "cascade" }),
    stageNumber: integer("stage_number").notNull(), // 1-5
    difficulty: text("difficulty").notNull(), // easy, medium, hard, expert, master
    gridSize: integer("grid_size").notNull(), // e.g., 8, 10, 12, 15, 20
    wordCount: integer("word_count").notNull(), // number of words in the puzzle
    timeLimit: integer("time_limit").notNull(), // time in seconds to complete
    xpReward: integer("xp_reward").notNull(), // XP earned on completion
    diamondReward: integer("diamond_reward").notNull(), // diamonds earned on completion
    words: text("words").notNull(), // Comma-separated words
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("stage_worldId_idx").on(table.worldId),
    index("stage_worldId_stageNumber_idx").on(table.worldId, table.stageNumber),
  ],
);

// User stats - tracks XP, diamonds, and overall progress
export const userStats = sqliteTable(
  "user_stats",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    totalXp: integer("total_xp").notNull().default(10), // starts with 10 XP
    diamonds: integer("diamonds").notNull().default(0), // starts with 0 diamonds
    currentWorldId: text("current_world_id")
      .references(() => world.id)
      .default("meadow"), // current world player is in, starts at meadow
    gamesPlayed: integer("games_played").notNull().default(0),
    gamesWon: integer("games_won").notNull().default(0),
    gamesLost: integer("games_lost").notNull().default(0),
    totalPlayTime: integer("total_play_time").notNull().default(0), // in seconds
    isOnline: integer("is_online", { mode: "boolean" }).default(false).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("userStats_userId_idx").on(table.userId)],
);

// World progress - tracks which worlds are unlocked and completed
export const worldProgress = sqliteTable(
  "world_progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    worldId: text("world_id")
      .notNull()
      .references(() => world.id, { onDelete: "cascade" }),
    isUnlocked: integer("is_unlocked", { mode: "boolean" }).notNull().default(false),
    isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
    completedStages: integer("completed_stages").notNull().default(0), // 0-5
    totalStars: integer("total_stars").notNull().default(0), // stars earned across all stages
    bestTime: integer("best_time"), // best completion time across all stages in seconds
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("worldProgress_userId_idx").on(table.userId),
    index("worldProgress_worldId_idx").on(table.worldId),
    index("worldProgress_userId_worldId_idx").on(table.userId, table.worldId),
  ],
);

// Stage progress - tracks individual stage completion
export const stageProgress = sqliteTable(
  "stage_progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    stageId: text("stage_id")
      .notNull()
      .references(() => stage.id, { onDelete: "cascade" }),
    isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
    stars: integer("stars").notNull().default(0), // 0-3 stars based on performance
    bestTime: integer("best_time"), // best completion time in seconds
    attempts: integer("attempts").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("stageProgress_userId_idx").on(table.userId),
    index("stageProgress_stageId_idx").on(table.stageId),
    index("stageProgress_userId_stageId_idx").on(table.userId, table.stageId),
  ],
);

// Game session - tracks individual game plays
export const gameSession = sqliteTable(
  "game_session",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    stageId: text("stage_id")
      .notNull()
      .references(() => stage.id, { onDelete: "cascade" }),
    startedAt: integer("started_at", { mode: "timestamp_ms" }).notNull(),
    completedAt: integer("completed_at", { mode: "timestamp_ms" }),
    timeElapsed: integer("time_elapsed"), // in seconds
    wordsFound: integer("words_found").notNull().default(0),
    totalWords: integer("total_words").notNull(),
    xpEarned: integer("xp_earned").notNull().default(0),
    diamondsEarned: integer("diamonds_earned").notNull().default(0),
    stars: integer("stars").notNull().default(0), // 0-3 stars
    isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("gameSession_userId_idx").on(table.userId),
    index("gameSession_stageId_idx").on(table.stageId),
    index("gameSession_userId_stageId_idx").on(table.userId, table.stageId),
  ],
);

// Shop item - items available for purchase with diamonds
export const shopItem = sqliteTable("shop_item", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image").notNull(), // URL or path to item image
  price: integer("price").notNull(), // price in diamonds
  category: text("category").notNull(), // e.g., 'avatar', 'theme', 'powerup', 'booster'
  isAvailable: integer("is_available", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0), // for ordering in shop UI
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});

// User inventory - tracks items purchased by users
export const userInventory = sqliteTable(
  "user_inventory",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => shopItem.id, { onDelete: "cascade" }),
    purchasedAt: integer("purchased_at", { mode: "timestamp_ms" }).notNull(),
    isEquipped: integer("is_equipped", { mode: "boolean" }).notNull().default(false), // for items that can be equipped (avatars, themes, etc.)
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("userInventory_userId_idx").on(table.userId),
    index("userInventory_itemId_idx").on(table.itemId),
    index("userInventory_userId_itemId_idx").on(table.userId, table.itemId),
  ],
);

// Leaderboard - tracks top players ranked by diamonds
export const leaderboard = sqliteTable(
  "leaderboard",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    rank: integer("rank").notNull(),
    diamonds: integer("diamonds").notNull(),
    totalXp: integer("total_xp").notNull(),
    gamesWon: integer("games_won").notNull(),
    lastUpdated: integer("last_updated", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("leaderboard_userId_idx").on(table.userId),
    index("leaderboard_rank_idx").on(table.rank),
    index("leaderboard_diamonds_idx").on(table.diamonds),
  ],
);

// Relations
export const worldRelations = relations(world, ({ many }) => ({
  stages: many(stage),
  worldProgress: many(worldProgress),
}));

export const stageRelations = relations(stage, ({ one, many }) => ({
  world: one(world, {
    fields: [stage.worldId],
    references: [world.id],
  }),
  stageProgress: many(stageProgress),
  gameSessions: many(gameSession),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(user, {
    fields: [userStats.userId],
    references: [user.id],
  }),
}));

export const worldProgressRelations = relations(worldProgress, ({ one }) => ({
  user: one(user, {
    fields: [worldProgress.userId],
    references: [user.id],
  }),
  world: one(world, {
    fields: [worldProgress.worldId],
    references: [world.id],
  }),
}));

export const stageProgressRelations = relations(stageProgress, ({ one }) => ({
  user: one(user, {
    fields: [stageProgress.userId],
    references: [user.id],
  }),
  stage: one(stage, {
    fields: [stageProgress.stageId],
    references: [stage.id],
  }),
}));

export const gameSessionRelations = relations(gameSession, ({ one }) => ({
  user: one(user, {
    fields: [gameSession.userId],
    references: [user.id],
  }),
  stage: one(stage, {
    fields: [gameSession.stageId],
    references: [stage.id],
  }),
}));

export const shopItemRelations = relations(shopItem, ({ many }) => ({
  userInventory: many(userInventory),
}));

export const userInventoryRelations = relations(userInventory, ({ one }) => ({
  user: one(user, {
    fields: [userInventory.userId],
    references: [user.id],
  }),
  item: one(shopItem, {
    fields: [userInventory.itemId],
    references: [shopItem.id],
  }),
}));

export const leaderboardRelations = relations(leaderboard, ({ one }) => ({
  user: one(user, {
    fields: [leaderboard.userId],
    references: [user.id],
  }),
}));
