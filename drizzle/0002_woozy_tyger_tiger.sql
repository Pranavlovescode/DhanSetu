CREATE TABLE "user_transactions" (
	"transaction_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender" uuid,
	"receiver" uuid,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_transactions" ADD CONSTRAINT "user_transactions_sender_users_id_fk" FOREIGN KEY ("sender") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_transactions" ADD CONSTRAINT "user_transactions_receiver_users_id_fk" FOREIGN KEY ("receiver") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;