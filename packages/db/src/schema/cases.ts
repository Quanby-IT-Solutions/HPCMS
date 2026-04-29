import { index, pgEnum, unique } from "drizzle-orm/pg-core"

import { createTable } from "../utils/table.js"
import { users } from "./auth.js"
import { patients } from "./patients.js"
import { practitioners } from "./practitioners.js"
import { tenants } from "./tenancy.js"

export const caseStatusEnum = pgEnum("case_status", [
	"submitted",
	"in_review",
	"approved",
	"rejected",
	"closed",
	"withdrawn",
])

export const casePriorityEnum = pgEnum("case_priority", ["low", "medium", "high", "urgent"])

export const caseSequences = createTable("case_sequences", t => ({
	tenantId: t
		.text("tenant_id")
		.primaryKey()
		.references(() => tenants.id, { onDelete: "restrict" }),
	lastValue: t.bigint("last_value", { mode: "number" }).notNull().default(1000),
	createdAt: t.timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: t.timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}))

export const healthcareCases = createTable(
	"healthcare_cases",
	t => ({
		id: t.text("id").primaryKey(),
		tenantId: t
			.text("tenant_id")
			.notNull()
			.references(() => tenants.id, { onDelete: "restrict" }),
		caseRef: t.text("case_ref").notNull(),
		caseType: t.text("case_type").notNull(),
		status: caseStatusEnum("status").notNull().default("submitted"),
		priority: casePriorityEnum("priority").notNull().default("medium"),
		sourceChannel: t.text("source_channel"),
		patientId: t
			.text("patient_id")
			.notNull()
			.references(() => patients.id, { onDelete: "restrict" }),
		practitionerId: t
			.text("practitioner_id")
			.references(() => practitioners.id, { onDelete: "set null" }),
		assignedUserId: t
			.text("assigned_user_id")
			.references(() => users.id, { onDelete: "set null" }),
		submittedAt: t
			.timestamp("submitted_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		inReviewAt: t.timestamp("in_review_at", { withTimezone: true }),
		resolvedAt: t.timestamp("resolved_at", { withTimezone: true }),
		closedAt: t.timestamp("closed_at", { withTimezone: true }),
		outcome: t.text("outcome"),
		rejectionReason: t.text("rejection_reason"),
		payload: t.jsonb("payload"),
		createdAt: t.timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: t.timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	}),
	t => [
		unique("hc_tenant_case_ref_unique").on(t.tenantId, t.caseRef),
		index("hc_tenant_status_assigned_idx").on(t.tenantId, t.status, t.assignedUserId),
		index("hc_patient_submitted_idx").on(t.patientId, t.submittedAt),
	]
)

export const caseEvents = createTable(
	"case_events",
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
		eventType: t.text("event_type").notNull(),
		actorUserId: t
			.text("actor_user_id")
			.references(() => users.id, { onDelete: "set null" }),
		payload: t.jsonb("payload"),
		visibility: t
			.text("visibility")
			.$type<"internal" | "patient">()
			.notNull()
			.default("internal"),
		createdAt: t.timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: t.timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	}),
	t => [index("case_events_case_created_idx").on(t.caseId, t.createdAt)]
)
