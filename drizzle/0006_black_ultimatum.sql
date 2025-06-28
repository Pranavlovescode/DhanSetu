CREATE TABLE "user_investment_profile" (
	"profile_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tolerance_level" text DEFAULT '',
	"experience" text DEFAULT '',
	"goal" text DEFAULT '',
	"time_horizon" text DEFAULT '',
	"monthly_investment_amount" integer,
	"sector" text[],
	"user_id" text
);
--> statement-breakpoint
ALTER TABLE "user_investment_profile" ADD CONSTRAINT "user_investment_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;