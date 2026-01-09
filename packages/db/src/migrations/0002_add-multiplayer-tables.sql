-- Add avatar field to user table
ALTER TABLE "user" ADD COLUMN "avatar" TEXT DEFAULT 'jack-avatar.png';

-- Create multiplayer_room table
CREATE TABLE "multiplayer_room" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "host_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "guest_id" TEXT REFERENCES "user"("id") ON DELETE SET NULL,
  "theme" TEXT NOT NULL DEFAULT 'animals',
  "difficulty" TEXT NOT NULL DEFAULT 'medium',
  "grid_size" INTEGER NOT NULL DEFAULT 10,
  "word_count" INTEGER NOT NULL DEFAULT 7,
  "time_limit" INTEGER NOT NULL DEFAULT 600,
  "status" TEXT NOT NULL DEFAULT 'waiting',
  "host_ready" INTEGER NOT NULL DEFAULT 0,
  "guest_ready" INTEGER NOT NULL DEFAULT 0,
  "puzzle_data" TEXT,
  "host_score" INTEGER NOT NULL DEFAULT 0,
  "guest_score" INTEGER NOT NULL DEFAULT 0,
  "found_words" TEXT DEFAULT '[]',
  "winner_id" TEXT REFERENCES "user"("id") ON DELETE SET NULL,
  "is_draw" INTEGER NOT NULL DEFAULT 0,
  "game_started_at" INTEGER,
  "game_ended_at" INTEGER,
  "created_at" INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
  "updated_at" INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
);

-- Create indexes for multiplayer_room
CREATE INDEX "multiplayerRoom_hostId_idx" ON "multiplayer_room"("host_id");
CREATE INDEX "multiplayerRoom_guestId_idx" ON "multiplayer_room"("guest_id");
CREATE INDEX "multiplayerRoom_status_idx" ON "multiplayer_room"("status");

-- Create multiplayer_session table
CREATE TABLE "multiplayer_session" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "room_id" TEXT NOT NULL REFERENCES "multiplayer_room"("id") ON DELETE CASCADE,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "words_found" INTEGER NOT NULL DEFAULT 0,
  "score" INTEGER NOT NULL DEFAULT 0,
  "is_winner" INTEGER NOT NULL DEFAULT 0,
  "xp_earned" INTEGER NOT NULL DEFAULT 0,
  "diamonds_earned" INTEGER NOT NULL DEFAULT 0,
  "created_at" INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
  "updated_at" INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
);

-- Create indexes for multiplayer_session
CREATE INDEX "multiplayerSession_roomId_idx" ON "multiplayer_session"("room_id");
CREATE INDEX "multiplayerSession_userId_idx" ON "multiplayer_session"("user_id");
CREATE INDEX "multiplayerSession_roomId_userId_idx" ON "multiplayer_session"("room_id", "user_id");
