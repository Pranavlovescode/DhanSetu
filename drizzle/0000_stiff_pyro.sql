CREATE SCHEMA "userSchema";
--> statement-breakpoint
CREATE TYPE "userSchema"."gender" AS ENUM('male', 'female', 'others');--> statement-breakpoint
CREATE TYPE "userSchema"."role" AS ENUM('user', 'employee', 'admin');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(500) NOT NULL,
	"phone" varchar(256),
	"age" integer,
	"email" text,
	"role" "userSchema"."role" DEFAULT 'user',
	"gender" "userSchema"."gender" DEFAULT 'others'
);
