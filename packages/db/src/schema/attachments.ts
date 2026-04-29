import { index } from "drizzle-orm/pg-core"

import { createTable } from "../utils/table.js"
import { users } from "./auth.js"
import { healthcareCases } from "./cases.js"
import { tenants } from "./tenancy.js"

export const caseAttachments = createTable(
	"case_attachments",
	t => ({
		id: t.text("id").primaryKey(),
		tenantId: t
			.text("tenant_id")
			.notNull()
			.references(() => tenants.id, { onDelete: "restrict" }),
		caseId: t
			.text("case_id")
			.notNull()
			.references(() => healthcareCases.id, { onDelete: "cascade" }),
		kind: t.text("kind").notNull(),
		storageKey: t.text("storage_key").notNull().unique(),
		originalFilename: t.text("original_filename").notNull(),
		contentType: t.text("content_type").notNull(),
		sizeBytes: t.integer("size_bytes").notNull(),
		uploadedByUserId: t
			.text("uploaded_by_user_id")
			.references(() => users.id, { onDelete: "set null" }),
		uploadedAt: t.timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
		createdAt: t.timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: t.timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	}),
	t => [index("case_attachments_case_id_idx").on(t.caseId)]
)
