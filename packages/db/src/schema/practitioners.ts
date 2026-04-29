import { createTable } from "../utils/table.js"
import { tenants } from "./tenancy.js"

export const practitioners = createTable("practitioners", t => ({
	id: t.text("id").primaryKey(),
	tenantId: t
		.text("tenant_id")
		.references(() => tenants.id, { onDelete: "set null" }),
	fullName: t.text("full_name").notNull(),
	specialty: t.text("specialty"),
	licenseNo: t.text("license_no"),
	isActive: t.boolean("is_active").notNull().default(true),
	fhirResourceId: t.text("fhir_resource_id"),
	fhirSyncedAt: t.timestamp("fhir_synced_at", { withTimezone: true }),
	createdAt: t.timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: t.timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}))
