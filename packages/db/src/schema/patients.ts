import { index, unique } from "drizzle-orm/pg-core"

import { createTable } from "../utils/table.js"
import { users } from "./auth.js"
import { tenants } from "./tenancy.js"

export const patients = createTable(
	"patients",
	t => ({
		id: t.text("id").primaryKey(),
		tenantId: t
			.text("tenant_id")
			.notNull()
			.references(() => tenants.id, { onDelete: "restrict" }),
		mrn: t.text("mrn").notNull(),
		fullName: t.text("full_name").notNull(),
		lastName: t.text("last_name").notNull(),
		sexAtBirth: t.text("sex_at_birth"),
		dateOfBirth: t.date("date_of_birth").notNull(),
		ethnicity: t.text("ethnicity"),
		contact: t.jsonb("contact"),
		dataPrivacyActAcknowledged: t.boolean("data_privacy_act_acknowledged").notNull().default(false),
		dataSharingWithEmrConsent: t
			.boolean("data_sharing_with_emr_consent")
			.notNull()
			.default(false),
		marketingCommsConsent: t.boolean("marketing_comms_consent").notNull().default(false),
		researchUseConsent: t.boolean("research_use_consent").notNull().default(false),
		consentsUpdatedAt: t.timestamp("consents_updated_at", { withTimezone: true }),
		fhirResourceId: t.text("fhir_resource_id"),
		fhirSyncedAt: t.timestamp("fhir_synced_at", { withTimezone: true }),
		createdAt: t.timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: t.timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	}),
	t => [
		unique("patients_tenant_mrn_unique").on(t.tenantId, t.mrn),
		index("patients_tenant_name_dob_idx").on(t.tenantId, t.lastName, t.dateOfBirth),
	]
)

export const patientUserLinks = createTable(
	"patient_user_links",
	t => ({
		id: t.text("id").primaryKey(),
		patientId: t
			.text("patient_id")
			.notNull()
			.references(() => patients.id, { onDelete: "cascade" }),
		userId: t
			.text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		linkedAt: t.timestamp("linked_at", { withTimezone: true }).notNull().defaultNow(),
		verifiedMethod: t.text("verified_method").notNull().default("mrn_dob_lastname"),
		createdAt: t.timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: t.timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	}),
	t => [unique("patient_user_unique").on(t.patientId, t.userId)]
)
