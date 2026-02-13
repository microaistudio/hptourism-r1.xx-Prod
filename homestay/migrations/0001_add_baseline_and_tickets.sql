-- Safe Migration for Patch v1.0.27
-- Manually curated to fix missing tables on PROD without conflicting with existing ones

-- 1. District Baseline Stats (Critical Fix)
CREATE TABLE IF NOT EXISTS "district_baseline_stats" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"district" varchar(100) NOT NULL,
	"total_count" integer DEFAULT 0 NOT NULL,
	"approved_count" integer DEFAULT 0 NOT NULL,
	"rejected_count" integer DEFAULT 0 NOT NULL,
	"pending_count" integer DEFAULT 0 NOT NULL,
	"description" text DEFAULT 'Manual Processing (June 2025 - Jan 2026)',
	"updated_by" varchar REFERENCES "public"."users"("id"),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "district_baseline_stats_district_unique" UNIQUE("district")
);

-- 2. Support Tickets (Likely missing)
CREATE TABLE IF NOT EXISTS "support_tickets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_number" varchar(50) NOT NULL,
	"applicant_id" varchar NOT NULL REFERENCES "public"."users"("id"),
	"application_id" varchar REFERENCES "public"."homestay_applications"("id"),
	"service_type" varchar(50) DEFAULT 'homestay',
	"category" varchar(50) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" varchar(30) DEFAULT 'open' NOT NULL,
	"priority" varchar(20) DEFAULT 'medium' NOT NULL,
	"assigned_to" varchar REFERENCES "public"."users"("id"),
	"assigned_at" timestamp,
	"escalated_from" varchar REFERENCES "public"."users"("id"),
	"escalated_at" timestamp,
	"escalation_level" integer DEFAULT 0,
	"sla_deadline" timestamp,
	"sla_breach" boolean DEFAULT false,
	"resolved_at" timestamp,
	"resolved_by" varchar REFERENCES "public"."users"("id"),
	"resolution_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "support_tickets_ticket_number_unique" UNIQUE("ticket_number")
);

-- 3. Grievances (Likely missing)
CREATE TABLE IF NOT EXISTS "grievances" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_number" varchar(50) NOT NULL,
	"ticket_type" varchar(20) DEFAULT 'owner_grievance',
	"user_id" varchar REFERENCES "public"."users"("id"),
	"application_id" varchar REFERENCES "public"."homestay_applications"("id"),
	"category" varchar(50) NOT NULL,
	"priority" varchar(20) DEFAULT 'medium',
	"status" varchar(20) DEFAULT 'open',
	"subject" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"assigned_to" varchar REFERENCES "public"."users"("id"),
	"resolution_notes" text,
	"attachments" jsonb,
	"last_comment_at" timestamp,
	"last_read_by_owner" timestamp,
	"last_read_by_officer" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"resolved_at" timestamp,
	CONSTRAINT "grievances_ticket_number_unique" UNIQUE("ticket_number")
);