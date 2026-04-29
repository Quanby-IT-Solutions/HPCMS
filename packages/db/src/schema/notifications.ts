import { index } from "drizzle-orm/pg-core"

import { createTable } from "../utils/table.js"
import { users } from "./auth.js"
import { tenants } from "./tenancy.js"

export const notifications = createTable(
	"notifications",
	t => ({
		id: t.text("id").primaryKey(),
		tenantId: t
			.text("tenant_id")
			.notNull()
			.references(() => tenants.id, { onDelete: "restrict" }),
		userId: t
			.text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		kind: t.text("kind").notNull(),
		title: t.text("title").notNull(),
		body: t.text("body").notNull(),
		targetUrl: t.text("target_url"),
		readAt: t.timestamp("read_at", { withTimezone: true }),
		createdAt: t.timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: t.timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	}),
	t => [index("notifications_user_read_created_idx").on(t.userId, t.readAt, t.createdAt)]
)
