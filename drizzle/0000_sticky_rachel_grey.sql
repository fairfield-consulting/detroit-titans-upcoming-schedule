CREATE TABLE `game_updates` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`sport_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	`game_id` integer NOT NULL,
	`sport_id` integer NOT NULL,
	`opponent_id` integer NOT NULL,
	`opponent_name` text NOT NULL,
	`opponent_logo_url` text,
	`date` integer NOT NULL,
	`time` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `games_game_id_unique` ON `games` (`game_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `game_id_idx` ON `games` (`game_id`);