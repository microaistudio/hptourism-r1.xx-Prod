CREATE TABLE "credit_ledger" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"reason" varchar(100) NOT NULL,
	"correction_action_id" varchar,
	"previous_fee" numeric(10, 2) NOT NULL,
	"new_fee" numeric(10, 2) NOT NULL,
	"credit_amount" numeric(10, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'recorded' NOT NULL,
	"applied_to_application_id" varchar,
	"applied_at" timestamp,
	"notes" text,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "homestay_applications" ALTER COLUMN "form_completion_time_seconds" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "application_actions" ADD COLUMN "correction_type" varchar(50);--> statement-breakpoint
ALTER TABLE "homestay_applications" ADD COLUMN "pending_correction_type" varchar(50);--> statement-breakpoint
ALTER TABLE "homestay_applications" ADD COLUMN "previous_category" varchar(20);--> statement-breakpoint
ALTER TABLE "homestay_applications" ADD COLUMN "previous_validity_years" integer;--> statement-breakpoint
ALTER TABLE "homestay_applications" ADD COLUMN "previous_total_fee" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "inspection_reports" ADD COLUMN "verified_single_bed_rooms" integer;--> statement-breakpoint
ALTER TABLE "inspection_reports" ADD COLUMN "verified_double_bed_rooms" integer;--> statement-breakpoint
ALTER TABLE "inspection_reports" ADD COLUMN "verified_family_suites" integer;--> statement-breakpoint
ALTER TABLE "inspection_reports" ADD COLUMN "room_correction_notes" text;--> statement-breakpoint
ALTER TABLE "inspection_reports" ADD COLUMN "aadhaar_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "inspection_reports" ADD COLUMN "verified_aadhaar_number" varchar(20);--> statement-breakpoint
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_application_id_homestay_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."homestay_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_correction_action_id_application_actions_id_fk" FOREIGN KEY ("correction_action_id") REFERENCES "public"."application_actions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_applied_to_application_id_homestay_applications_id_fk" FOREIGN KEY ("applied_to_application_id") REFERENCES "public"."homestay_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "credit_ledger_user_idx" ON "credit_ledger" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "credit_ledger_app_idx" ON "credit_ledger" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "credit_ledger_status_idx" ON "credit_ledger" USING btree ("status");