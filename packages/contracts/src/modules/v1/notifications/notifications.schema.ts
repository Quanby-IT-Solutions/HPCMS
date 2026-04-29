import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

const nullableDateOrString = z
	.union([z.date(), z.string()])
	.nullable()
	.transform(v => (v ? (typeof v === "string" ? new Date(v) : v) : null))

export const NotificationSchema = z.object({
	id: z.string(),
	tenantId: z.string(),
	userId: z.string(),
	kind: z.string(),
	title: z.string(),
	body: z.string(),
	targetUrl: z.string().nullable(),
	readAt: nullableDateOrString,
	createdAt: dateOrString,
	updatedAt: dateOrString,
})

export type Notification = z.infer<typeof NotificationSchema>

export const ListNotificationsInputSchema = z.object({
	unreadOnly: z.coerce.boolean().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
})

export const ListNotificationsOutputSchema = z.object({
	items: z.array(NotificationSchema),
	unreadCount: z.number().int(),
	total: z.number().int(),
	page: z.number().int(),
	limit: z.number().int(),
})

export const MarkReadInputSchema = z.object({
	ids: z.array(z.string()).min(1).max(100),
})

export const MarkReadOutputSchema = z.object({
	updated: z.number().int(),
})

export const MarkAllReadOutputSchema = z.object({
	updated: z.number().int(),
})
