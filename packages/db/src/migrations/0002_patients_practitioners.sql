CREATE TABLE "patients" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"mrn" text NOT NULL,
	"full_name" text NOT NULL,
	"last_name" text NOT NULL,
	"sex_at_birth" text,
	"date_of_birth" date,
	"ethnicity" text,
	"contact" jsonb,
	"data_privacy_act_acknowledged" boolean DEFAULT false NOT NULL,
	"data_sharing_with_emr_consent" boolean DEFAULT false NOT NULL,
	"marketing_comms_consent" boolean DEFAULT false NOT NULL,
	"research_use_consent" boolean DEFAULT false NOT NULL,
	"consents_updated_at" timestamp with time zone,
	"fhir_resource_id" text,
	"fhir_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient_user_links" (
	"id" text PRIMARY KEY NOT NULL,
	"patient_id" text NOT NULL,
	"user_id" text NOT NULL,
	"linked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"verified_method" text DEFAULT 'mrn_dob_lastname' NOT NULL,
	CONSTRAINT "patient_user_unique" UNIQUE("patient_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "practitioners" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text,
	"full_name" text NOT NULL,
	"specialty" text,
	"license_no" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"fhir_resource_id" text,
	"fhir_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "patient_user_links" ADD CONSTRAINT "patient_user_links_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "patient_user_links" ADD CONSTRAINT "patient_user_links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "practitioners" ADD CONSTRAINT "practitioners_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "patients_tenant_mrn_unique" ON "patients" USING btree ("tenant_id","mrn");
--> statement-breakpoint
CREATE INDEX "patients_tenant_name_dob_idx" ON "patients" USING btree ("tenant_id","last_name","date_of_birth");
