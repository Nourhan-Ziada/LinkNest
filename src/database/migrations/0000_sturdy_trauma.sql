CREATE TABLE `links_table` (
	`id` text PRIMARY KEY NOT NULL,
	`original_url` text NOT NULL,
	`short_slug` text NOT NULL,
	`created_by` text,
	`created_at` text NOT NULL,
	`expires_at` text,
	`click_count` integer DEFAULT 0,
	`password_hash` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `links_table_short_slug_unique` ON `links_table` (`short_slug`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`hashed_password` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `visits_table` (
	`id` text PRIMARY KEY NOT NULL,
	`link_id` text NOT NULL,
	`clicked_at` text,
	`user_agent` text,
	`ip_address` text,
	`referrer` text,
	`country` text
);
