CREATE TABLE "userBankAccounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pan_number" text,
	"balance" integer DEFAULT 0,
	"account_holder" uuid
);
--> statement-breakpoint
ALTER TABLE "userBankAccounts" ADD CONSTRAINT "userBankAccounts_account_holder_users_id_fk" FOREIGN KEY ("account_holder") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;