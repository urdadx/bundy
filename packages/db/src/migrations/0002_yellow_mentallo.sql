CREATE TABLE `leaderboard` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`rank` integer NOT NULL,
	`diamonds` integer NOT NULL,
	`total_xp` integer NOT NULL,
	`games_won` integer NOT NULL,
	`last_updated` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `leaderboard_user_id_unique` ON `leaderboard` (`user_id`);--> statement-breakpoint
CREATE INDEX `leaderboard_userId_idx` ON `leaderboard` (`user_id`);--> statement-breakpoint
CREATE INDEX `leaderboard_rank_idx` ON `leaderboard` (`rank`);--> statement-breakpoint
CREATE INDEX `leaderboard_diamonds_idx` ON `leaderboard` (`diamonds`);--> statement-breakpoint
CREATE TABLE `shop_item` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`image` text NOT NULL,
	`price` integer NOT NULL,
	`category` text NOT NULL,
	`is_available` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_inventory` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`item_id` text NOT NULL,
	`purchased_at` integer NOT NULL,
	`is_equipped` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`item_id`) REFERENCES `shop_item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `userInventory_userId_idx` ON `user_inventory` (`user_id`);--> statement-breakpoint
CREATE INDEX `userInventory_itemId_idx` ON `user_inventory` (`item_id`);--> statement-breakpoint
CREATE INDEX `userInventory_userId_itemId_idx` ON `user_inventory` (`user_id`,`item_id`);