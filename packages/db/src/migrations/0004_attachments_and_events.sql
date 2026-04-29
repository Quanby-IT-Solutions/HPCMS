CREATE TABLE "case_attachments" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"case_id" text NOT NULL,
	"kind" text NOT NULL,
	"storage_key" text NOT NULL,
	"original_filename" text NOT NULL,
	"content_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"uploaded_by_user_id" text,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "case_attachments_storage_key_unique" UNIQUE("storage_key")
);
--> statement-breakpoint
CREATE TABLE "case_events" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"case_id" text NOT NULL,
	"event_type" text NOT NULL,
	"actor_user_id" text,
	"payload" jsonb,
	"visibility" text DEFAULT 'internal' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "case_attachments" ADD CONSTRAINT "case_attachments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "case_attachments" ADD CONSTRAINT "case_attachments_case_id_healthcare_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."healthcare_cases"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "case_attachments" ADD CONSTRAINT "case_attachments_uploaded_by_user_id_users_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "case_events" ADD CONSTRAINT "case_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "case_events" ADD CONSTRAINT "case_events_case_id_healthcare_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."healthcare_cases"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "case_events" ADD CONSTRAINT "case_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "case_attachments_case_id_idx" ON "case_attachments" USING btree ("case_id");
--> statement-breakpoint
CREATE INDEX "case_events_case_created_idx" ON "case_events" USING btree ("case_id","created_at");
