CREATE TABLE "help_resources" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(20) NOT NULL,
	"content_url" text,
	"content_body" text,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "homestay_applications" ADD COLUMN "da_recommendation" varchar(20);--> statement-breakpoint
ALTER TABLE "help_resources" ADD CONSTRAINT "help_resources_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;