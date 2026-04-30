import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

const nullableDateOrString = z
	.union([z.date(), z.string()])
	.nullable()
	.transform(v => (v ? (typeof v === "string" ? new Date(v) : v) : null))

export const PortalChatThreadSchema = z.object({
	id: z.string(),
	caseRef: z.string().nullable(),
	subject: z.string(),
	preview: z.string(),
	unreadCount: z.number().int().nonnegative(),
	lastMessageAt: dateOrString,
})
export type PortalChatThread = z.infer<typeof PortalChatThreadSchema>

export const PortalChatAttachmentSchema = z.object({
	id: z.string(),
	filename: z.string(),
	contentType: z.string(),
	sizeBytes: z.number().int().positive(),
})

export const PortalChatMessageSchema = z.object({
	id: z.string(),
	threadId: z.string(),
	direction: z.enum(["inbound", "outbound"]),
	body: z.string(),
	attachments: z.array(PortalChatAttachmentSchema).default([]),
	sentAt: dateOrString,
	readAt: nullableDateOrString,
})
export type PortalChatMessage = z.infer<typeof PortalChatMessageSchema>

export const PortalChatListThreadsOutputSchema = z.object({
	threads: z.array(PortalChatThreadSchema),
})

export const PortalChatThreadIdInputSchema = z.object({ threadId: z.string() })

export const PortalChatThreadDetailSchema = z.object({
	thread: PortalChatThreadSchema,
	messages: z.array(PortalChatMessageSchema),
})

export const PortalChatSendMessageInputSchema = z.object({
	threadId: z.string(),
	body: z.string().min(1).max(2000),
	attachmentKeys: z.array(z.string()).default([]),
})

export const PortalChatSendMessageOutputSchema = z.object({
	message: PortalChatMessageSchema,
})
