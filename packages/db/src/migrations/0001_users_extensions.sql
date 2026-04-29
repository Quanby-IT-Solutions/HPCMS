ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'patient' NOT NULL;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tenant_id" text;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mrn_verify_failed_count" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mrn_verify_locked_until" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
