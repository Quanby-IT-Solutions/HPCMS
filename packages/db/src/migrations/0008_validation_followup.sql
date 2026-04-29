-- patients: date_of_birth NOT NULL (required for MRN verification Flow 1: MRN + DOB + last name)
ALTER TABLE "patients" ALTER COLUMN "date_of_birth" SET NOT NULL;
--> statement-breakpoint
-- patient_user_links: add standard timestamp columns
ALTER TABLE "patient_user_links" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "patient_user_links" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
-- case_sequences: add standard timestamp columns
ALTER TABLE "case_sequences" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "case_sequences" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
-- case_events: add updated_at (created_at already present)
ALTER TABLE "case_events" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
-- case_attachments: add standard timestamp columns (uploaded_at kept)
ALTER TABLE "case_attachments" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "case_attachments" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
-- notifications: add updated_at (created_at already present)
ALTER TABLE "notifications" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
-- fhir_cache: add standard timestamp columns (synced_at kept)
ALTER TABLE "fhir_cache" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "fhir_cache" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
