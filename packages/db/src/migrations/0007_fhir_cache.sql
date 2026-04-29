CREATE TABLE "fhir_cache" (
	"tenant_id" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"raw" jsonb NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fhir_cache_tenant_id_resource_type_resource_id_pk" PRIMARY KEY("tenant_id","resource_type","resource_id")
);
--> statement-breakpoint
ALTER TABLE "fhir_cache" ADD CONSTRAINT "fhir_cache_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
