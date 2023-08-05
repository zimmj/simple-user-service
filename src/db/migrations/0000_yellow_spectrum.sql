CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text,
	"email" text PRIMARY KEY NOT NULL,
	"password" text NOT NULL
);
