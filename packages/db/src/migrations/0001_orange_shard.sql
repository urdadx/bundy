CREATE TABLE `game_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`stage_id` text NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	`time_elapsed` integer,
	`words_found` integer DEFAULT 0 NOT NULL,
	`total_words` integer NOT NULL,
	`xp_earned` integer DEFAULT 0 NOT NULL,
	`diamonds_earned` integer DEFAULT 0 NOT NULL,
	`stars` integer DEFAULT 0 NOT NULL,
	`is_completed` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`stage_id`) REFERENCES `stage`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `gameSession_userId_idx` ON `game_session` (`user_id`);--> statement-breakpoint
CREATE INDEX `gameSession_stageId_idx` ON `game_session` (`stage_id`);--> statement-breakpoint
CREATE INDEX `gameSession_userId_stageId_idx` ON `game_session` (`user_id`,`stage_id`);--> statement-breakpoint
CREATE TABLE `stage` (
	`id` text PRIMARY KEY NOT NULL,
	`world_id` text NOT NULL,
	`stage_number` integer NOT NULL,
	`difficulty` text NOT NULL,
	`grid_size` integer NOT NULL,
	`word_count` integer NOT NULL,
	`time_limit` integer NOT NULL,
	`xp_reward` integer NOT NULL,
	`diamond_reward` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`world_id`) REFERENCES `world`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `stage_worldId_idx` ON `stage` (`world_id`);--> statement-breakpoint
CREATE INDEX `stage_worldId_stageNumber_idx` ON `stage` (`world_id`,`stage_number`);--> statement-breakpoint
CREATE TABLE `stage_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`stage_id` text NOT NULL,
	`is_completed` integer DEFAULT false NOT NULL,
	`stars` integer DEFAULT 0 NOT NULL,
	`best_time` integer,
	`attempts` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`stage_id`) REFERENCES `stage`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `stageProgress_userId_idx` ON `stage_progress` (`user_id`);--> statement-breakpoint
CREATE INDEX `stageProgress_stageId_idx` ON `stage_progress` (`stage_id`);--> statement-breakpoint
CREATE INDEX `stageProgress_userId_stageId_idx` ON `stage_progress` (`user_id`,`stage_id`);--> statement-breakpoint
CREATE TABLE `user_stats` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`total_xp` integer DEFAULT 10 NOT NULL,
	`diamonds` integer DEFAULT 0 NOT NULL,
	`current_world_id` text,
	`games_played` integer DEFAULT 0 NOT NULL,
	`games_won` integer DEFAULT 0 NOT NULL,
	`games_lost` integer DEFAULT 0 NOT NULL,
	`total_play_time` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`current_world_id`) REFERENCES `world`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_stats_user_id_unique` ON `user_stats` (`user_id`);--> statement-breakpoint
CREATE INDEX `userStats_userId_idx` ON `user_stats` (`user_id`);--> statement-breakpoint
CREATE TABLE `world` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`required_xp` integer NOT NULL,
	`theme` text NOT NULL,
	`order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `world_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`world_id` text NOT NULL,
	`is_unlocked` integer DEFAULT false NOT NULL,
	`is_completed` integer DEFAULT false NOT NULL,
	`completed_stages` integer DEFAULT 0 NOT NULL,
	`total_stars` integer DEFAULT 0 NOT NULL,
	`best_time` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`world_id`) REFERENCES `world`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `worldProgress_userId_idx` ON `world_progress` (`user_id`);--> statement-breakpoint
CREATE INDEX `worldProgress_worldId_idx` ON `world_progress` (`world_id`);--> statement-breakpoint
CREATE INDEX `worldProgress_userId_worldId_idx` ON `world_progress` (`user_id`,`world_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_account`("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") SELECT "id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at" FROM `account`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id") SELECT "id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);