import { index } from "drizzle-orm/pg-core"

import { createTable } from "../utils/table.js"
import { users } from "./auth.js"
import { tenants } from "./tenancy.js"

// bigserial PK is intentional: high-write, append-only, internal table — never user-facing.
// updated_at mirrors the project-wide timestamp convention (Tech Plan §2.1); rows remain immutable by behavior.
export const auditLogs = createTable(
	"audit_logs",
	t => ({
		id: t.bigserial("id", { mode: "number" }).primaryKey(),
		tenantId: t
			.text("tenant_id")
			.notNull()
			.references(() => tenants.id, { onDelete: "restrict" }),
		actorUserId: t
			.text("actor_user_id")
			.references(() => users.id, { onDelete: "set null" }),
		actionKey: t.text("action_key").notNull(),
		targetType: t.text("target_type").notNull(),
		targetId: t.text("target_id").notNull(),
		before: t.jsonb("before"),
		after: t.jsonb("after"),
		requestId: t.text("request_id"),
		ipAddress: t.text("ip_address"),
		userAgent: t.text("user_agent"),
		createdAt: t.timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: t.timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	}),
	t => [
		index("audit_logs_tenant_created_idx").on(t.tenantId, t.createdAt),
		index("audit_logs_target_idx").on(t.targetType, t.targetId, t.createdAt),
	]
)
