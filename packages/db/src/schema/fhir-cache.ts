import { primaryKey } from "drizzle-orm/pg-core"

import { createTable } from "../utils/table.js"
import { tenants } from "./tenancy.js"

export const fhirCache = createTable(
	"fhir_cache",
	t => ({
		tenantId: t
			.text("tenant_id")
			.notNull()
			.references(() => tenants.id, { onDelete: "cascade" }),
		resourceType: t.text("resource_type").notNull(),
		resourceId: t.text("resource_id").notNull(),
		raw: t.jsonb("raw").notNull(),
		syncedAt: t.timestamp("synced_at", { withTimezone: true }).notNull().defaultNow(),
		createdAt: t.timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: t.timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	}),
	t => [primaryKey({ columns: [t.tenantId, t.resourceType, t.resourceId] })]
)
