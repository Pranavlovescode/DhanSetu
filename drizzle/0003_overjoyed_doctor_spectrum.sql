ALTER TABLE "userBankAccounts" RENAME TO "user_bank_accounts";--> statement-breakpoint
ALTER TABLE "user_bank_accounts" DROP CONSTRAINT "userBankAccounts_account_holder_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_bank_accounts" ADD CONSTRAINT "user_bank_accounts_account_holder_users_id_fk" FOREIGN KEY ("account_holder") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;