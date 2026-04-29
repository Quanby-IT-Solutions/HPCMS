import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

const nullableDateOrString = z
	.union([z.date(), z.string()])
	.nullable()
	.transform(v => (v ? (typeof v === "string" ? new Date(v) : v) : null))

export const UserRoleSchema = z.enum([
	"patient",
	"case_agent",
	"case_supervisor",
	"tenant_admin",
	"system_admin",
	"clinician",
])

export const StaffUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	emailVerified: z.boolean(),
	role: UserRoleSchema,
	tenantId: z.string().nullable(),
	createdAt: dateOrString,
	updatedAt: dateOrString,
})

export type StaffUser = z.infer<typeof StaffUserSchema>

export const ListUsersInputSchema = z.object({
	role: UserRoleSchema.optional(),
	query: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
})

export const ListUsersOutputSchema = z.object({
	items: z.array(StaffUserSchema),
	total: z.number().int(),
	page: z.number().int(),
	limit: z.number().int(),
})

export const InviteUserInputSchema = z.object({
	email: z.string().email(),
	role: UserRoleSchema,
	tenantId: z.string().optional(),
})

export const InviteUserOutputSchema = z.object({
	userId: z.string(),
	email: z.string(),
})

export const SetRoleInputSchema = z.object({
	userId: z.string(),
	role: UserRoleSchema,
})

export const SetRoleOutputSchema = z.object({
	success: z.boolean(),
})

export const AuditLogSchema = z.object({
	id: z.number(),
	tenantId: z.string(),
	actorUserId: z.string().nullable(),
	actionKey: z.string(),
	targetType: z.string(),
	targetId: z.string(),
	before: z.unknown().nullable(),
	after: z.unknown().nullable(),
	requestId: z.string().nullable(),
	ipAddress: z.string().nullable(),
	userAgent: z.string().nullable(),
	createdAt: dateOrString,
	updatedAt: dateOrString,
})

export type AuditLog = z.infer<typeof AuditLogSchema>

export const ListAuditLogsInputSchema = z.object({
	targetType: z.string().optional(),
	actorUserId: z.string().optional(),
	actionKey: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
})

export const ListAuditLogsOutputSchema = z.object({
	items: z.array(AuditLogSchema),
	total: z.number().int(),
	page: z.number().int(),
	limit: z.number().int(),
})
