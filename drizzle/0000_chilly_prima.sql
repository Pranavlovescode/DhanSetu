CREATE SCHEMA "userEnums";
--> statement-breakpoint
CREATE TYPE "userEnums"."gender" AS ENUM('male', 'female', 'others');--> statement-breakpoint
CREATE TYPE "userEnums"."role" AS ENUM('user', 'employee', 'admin');--> statement-breakpoint
CREATE TABLE "user_bank_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pan_number" text,
	"balance" integer DEFAULT 0,
	"account_holder" text
);
--> statement-breakpoint
CREATE TABLE "user_transactions" (
	"transaction_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender" text,
	"receiver" text,
	"timestamp" timestamp DEFAULT now(),
	"amount" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"full_name" varchar(500) NOT NULL,
	"phone_number" integer,
	"age" integer,
	"email" text,
	"role" "userEnums"."role" DEFAULT 'user',
	"gender" "userEnums"."gender" DEFAULT 'others',
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "user_bank_accounts" ADD CONSTRAINT "user_bank_accounts_account_holder_users_id_fk" FOREIGN KEY ("account_holder") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_transactions" ADD CONSTRAINT "user_transactions_sender_users_id_fk" FOREIGN KEY ("sender") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_transactions" ADD CONSTRAINT "user_transactions_receiver_users_id_fk" FOREIGN KEY ("receiver") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;