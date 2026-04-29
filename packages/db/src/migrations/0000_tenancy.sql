CREATE TYPE "public"."user_role" AS ENUM('patient', 'case_agent', 'case_supervisor', 'tenant_admin', 'system_admin', 'clinician');
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_code_unique" UNIQUE("code")
);
