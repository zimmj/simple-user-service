CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
