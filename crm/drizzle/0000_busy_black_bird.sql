CREATE TABLE `audit_events` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`entity` text NOT NULL,
	`entity_id` text NOT NULL,
	`action` text NOT NULL,
	`summary` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_owner_time` ON `audit_events` (`owner_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`mutation_id` text NOT NULL,
	`name` text NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`product` text NOT NULL,
	`source` text DEFAULT 'Manual' NOT NULL,
	`status` text DEFAULT 'Lead' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`consent` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contacts_id_owner` ON `contacts` (`id`,`owner_id`);--> statement-breakpoint
CREATE INDEX `contacts_owner_status` ON `contacts` (`owner_id`,`status`);--> statement-breakpoint
CREATE TABLE `deals` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`mutation_id` text NOT NULL,
	`title` text NOT NULL,
	`contact_id` text NOT NULL,
	`product` text NOT NULL,
	`stage` text NOT NULL,
	`value` integer DEFAULT 0 NOT NULL,
	`expected_close` text NOT NULL,
	`priority` text DEFAULT 'Média' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`contact_id`,`owner_id`) REFERENCES `contacts`(`id`,`owner_id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "deals_value_nonnegative" CHECK("deals"."value" >= 0)
);
--> statement-breakpoint
CREATE INDEX `deals_owner_stage` ON `deals` (`owner_id`,`stage`);--> statement-breakpoint
CREATE TABLE `demo_runs` (
	`owner_id` text PRIMARY KEY NOT NULL,
	`mutation_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `policies` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`mutation_id` text NOT NULL,
	`number` text NOT NULL,
	`contact_id` text NOT NULL,
	`product` text NOT NULL,
	`insurer` text NOT NULL,
	`premium` integer NOT NULL,
	`commission_rate` real DEFAULT 0 NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`status` text DEFAULT 'Ativa' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`contact_id`,`owner_id`) REFERENCES `contacts`(`id`,`owner_id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "policies_premium_nonnegative" CHECK("policies"."premium" >= 0),
	CONSTRAINT "policies_commission_range" CHECK("policies"."commission_rate" >= 0 AND "policies"."commission_rate" <= 100),
	CONSTRAINT "policies_date_order" CHECK("policies"."end_date" >= "policies"."start_date")
);
--> statement-breakpoint
CREATE INDEX `policies_owner_expiry` ON `policies` (`owner_id`,`end_date`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`mutation_id` text NOT NULL,
	`title` text NOT NULL,
	`contact_id` text,
	`due_date` text NOT NULL,
	`type` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`contact_id`,`owner_id`) REFERENCES `contacts`(`id`,`owner_id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `tasks_owner_due` ON `tasks` (`owner_id`,`done`,`due_date`);