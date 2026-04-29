import { createTable } from "../utils/table.js"

export const tenants = createTable("tenants", t => ({
	id: t.text("id").primaryKey(),
	code: t.text("code").notNull().unique(),
	name: t.text("name").notNull(),
	isActive: t.boolean("is_active").notNull().default(true),
	createdAt: t.timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: t.timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}))
