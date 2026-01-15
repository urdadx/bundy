CREATE TABLE `multiplayer_room` (
	`id` text PRIMARY KEY NOT NULL,
	`host_id` text NOT NULL,
	`guest_id` text,
	`theme` text DEFAULT 'animals' NOT NULL,
	`difficulty` text DEFAULT 'medium' NOT NULL,
	`grid_size` integer DEFAULT 10 NOT NULL,
	`word_count` integer DEFAULT 7 NOT NULL,
	`time_limit` integer DEFAULT 600 NOT NULL,
	`status` text DEFAULT 'waiting' NOT NULL,
	`host_ready` integer DEFAULT false NOT NULL,
	`guest_ready` integer DEFAULT false NOT NULL,
	`puzzle_data` text,
	`host_score` integer DEFAULT 0 NOT NULL,
	`guest_score` integer DEFAULT 0 NOT NULL,
	`found_words` text DEFAULT '[]',
	`winner_id` text,
	`is_draw` integer DEFAULT false NOT NULL,
	`game_started_at` integer,
	`game_ended_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`host_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`winner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `multiplayerRoom_hostId_idx` ON `multiplayer_room` (`host_id`);--> statement-breakpoint
CREATE INDEX `multiplayerRoom_guestId_idx` ON `multiplayer_room` (`guest_id`);--> statement-breakpoint
CREATE INDEX `multiplayerRoom_status_idx` ON `multiplayer_room` (`status`);--> statement-breakpoint
CREATE TABLE `multiplayer_session` (
	`id` text PRIMARY KEY NOT NULL,
	`room_id` text NOT NULL,
	`user_id` text NOT NULL,
	`words_found` integer DEFAULT 0 NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`is_winner` integer DEFAULT false NOT NULL,
	`xp_earned` integer DEFAULT 0 NOT NULL,
	`diamonds_earned` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `multiplayer_room`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `multiplayerSession_roomId_idx` ON `multiplayer_session` (`room_id`);--> statement-breakpoint
CREATE INDEX `multiplayerSession_userId_idx` ON `multiplayer_session` (`user_id`);--> statement-breakpoint
CREATE INDEX `multiplayerSession_roomId_userId_idx` ON `multiplayer_session` (`room_id`,`user_id`);--> statement-breakpoint
ALTER TABLE `user` ADD `avatar` text DEFAULT 'jack-avatar.png';--> statement-breakpoint
ALTER TABLE `stage` ADD `words` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user_stats` ADD `is_online` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `world` ADD `description` text;--> statement-breakpoint
ALTER TABLE `world` ADD `color` text DEFAULT 'primary' NOT NULL;