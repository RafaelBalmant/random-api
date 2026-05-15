ALTER TABLE `messages` ADD `message_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `messages` ADD `type` text DEFAULT 'text';--> statement-breakpoint
ALTER TABLE `messages` ADD `media_url` text;--> statement-breakpoint
ALTER TABLE `messages` ADD `is_read` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `messages` ADD `is_edited` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `messages` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `messages` ADD `status` text DEFAULT 'sent';--> statement-breakpoint
CREATE UNIQUE INDEX `messages_message_id_unique` ON `messages` (`message_id`);