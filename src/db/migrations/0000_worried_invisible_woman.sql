DO $$ BEGIN
 CREATE TYPE "house_colors" AS ENUM('red', 'blue', 'green');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "house" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text,
	"color" "house_colors"
);
