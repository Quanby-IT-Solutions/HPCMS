CREATE TYPE "public"."case_status" AS ENUM('submitted', 'in_review', 'approved', 'rejected', 'closed', 'withdrawn');
--> statement-breakpoint
CREATE TYPE "public"."case_priority" AS ENUM('low', 'medium', 'high', 'urgent');
--> statement-breakpoint
CREATE TABLE "case_sequences" (
	"tenant_id" text PRIMARY KEY NOT NULL,
	"last_value" bigint DEFAULT 1000 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "healthcare_cases" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"case_ref" text NOT NULL,
	"case_type" text NOT NULL,
	"status" "case_status" DEFAULT 'submitted' NOT NULL,
	"priority" "case_priority" DEFAULT 'medium' NOT NULL,
	"source_channel" text,
	"patient_id" text NOT NULL,
	"practitioner_id" text,
	"assigned_user_id" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"in_review_at" timestamp with time zone,
	"resolved_at" timestamp with time zone,
	"closed_at" timestamp with time zone,
	"outcome" text,
	"rejection_reason" text,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hc_tenant_case_ref_unique" UNIQUE("tenant_id","case_ref")
);
--> statement-breakpoint
ALTER TABLE "case_sequences" ADD CONSTRAINT "case_sequences_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "healthcare_cases" ADD CONSTRAINT "healthcare_cases_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "healthcare_cases" ADD CONSTRAINT "healthcare_cases_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "healthcare_cases" ADD CONSTRAINT "healthcare_cases_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "healthcare_cases" ADD CONSTRAINT "healthcare_cases_assigned_user_id_users_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "hc_tenant_status_assigned_idx" ON "healthcare_cases" USING btree ("tenant_id","status","assigned_user_id");
--> statement-breakpoint
CREATE INDEX "hc_patient_submitted_idx" ON "healthcare_cases" USING btree ("patient_id","submitted_at");
