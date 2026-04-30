import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

const nullableDateOrString = z
	.union([z.date(), z.string()])
	.nullable()
	.transform(v => (v ? (typeof v === "string" ? new Date(v) : v) : null))

export const ChannelSchema = z.enum(["email", "phone", "portal_chat", "social_media"])
export type Channel = z.infer<typeof ChannelSchema>

export const InboxStatusSchema = z.enum(["new", "in_progress", "linked", "resolved"])
export type InboxStatus = z.infer<typeof InboxStatusSchema>

export const SocialPlatformSchema = z.enum(["facebook", "twitter", "instagram", "other"])

export const AISuggestionSchema = z.object({
	categoryKey: z.string(),
	categoryLabel: z.string(),
	confidence: z.number().min(0).max(1),
	model: z.string().nullable(),
	// CA-FE-14: panel must show recommended case type + routing team.
	suggestedCaseType: z.string().nullable().optional(),
	routingTeam: z.string().nullable().optional(),
})

export const InboxItemSchema = z.object({
	id: z.string(),
	channel: ChannelSchema,
	subject: z.string(),
	preview: z.string(),
	senderName: z.string().nullable(),
	senderHandle: z.string().nullable(),
	patientId: z.string().nullable(),
	patientName: z.string().nullable(),
	caseRef: z.string().nullable(),
	status: InboxStatusSchema,
	receivedAt: dateOrString,
	unansweredMinutes: z.number().int().nonnegative().nullable(),
	aiSuggestion: AISuggestionSchema.nullable(),
	hasAttachments: z.boolean(),
	// Optional sub-channel (e.g. social platform). Surfaces on the feed
	// row as a small glyph next to the channel badge (CA-FE-11 AC4).
	socialPlatform: SocialPlatformSchema.nullable().optional(),
})
export type InboxItem = z.infer<typeof InboxItemSchema>

export const InboxListInputSchema = z.object({
	channel: ChannelSchema.optional(),
	status: InboxStatusSchema.optional(),
	assignedAgentId: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	sort: z.enum(["recent", "priority", "unanswered"]).default("recent"),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(25),
})

export const InboxListOutputSchema = z.object({
	items: z.array(InboxItemSchema),
	total: z.number().int().nonnegative(),
	page: z.number().int().positive(),
	pageSize: z.number().int().positive(),
})

export const EmailMessageSchema = z.object({
	id: z.string(),
	from: z.string(),
	to: z.array(z.string()),
	cc: z.array(z.string()).default([]),
	subject: z.string(),
	bodyHtml: z.string(),
	bodyText: z.string(),
	sentAt: dateOrString,
	direction: z.enum(["inbound", "outbound"]),
	attachments: z
		.array(z.object({ id: z.string(), filename: z.string(), sizeBytes: z.number() }))
		.default([]),
})
export type EmailMessage = z.infer<typeof EmailMessageSchema>

export const InboxItemDetailSchema = z.object({
	item: InboxItemSchema,
	emailThread: z.array(EmailMessageSchema).nullable(),
	transcript: z.string().nullable(),
	chatMessages: z
		.array(
			z.object({
				id: z.string(),
				direction: z.enum(["inbound", "outbound"]),
				body: z.string(),
				sentAt: dateOrString,
			})
		)
		.nullable(),
	socialPost: z
		.object({
			platform: SocialPlatformSchema,
			handle: z.string(),
			postUrl: z.string().nullable(),
			content: z.string(),
		})
		.nullable(),
})

export const InboxIdInputSchema = z.object({ id: z.string() })

export const AttachToCaseInputSchema = z.object({
	inboxItemId: z.string(),
	// CA-FE-12 spec: multi-select. Backend accepts one or more case refs.
	caseRefs: z.array(z.string().min(1)).min(1),
	// Optional attachment note recorded with the link event.
	note: z.string().max(500).nullable().optional(),
})

export const ResolveInboxInputSchema = z.object({
	inboxItemId: z.string(),
	resolution: z.string().min(1).max(500),
})

export const InboxMutationOutputSchema = z.object({
	id: z.string(),
	status: InboxStatusSchema,
})

export const InboxSearchInputSchema = z.object({
	q: z.string().default(""),
	channel: ChannelSchema.optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	agentId: z.string().optional(),
	caseType: z.string().optional(),
	status: InboxStatusSchema.optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(25),
})

export const InboxSearchResultRowSchema = z.object({
	id: z.string(),
	channel: ChannelSchema,
	patientName: z.string().nullable(),
	caseRef: z.string().nullable(),
	receivedAt: dateOrString,
	snippet: z.string(),
	agentName: z.string().nullable(),
	// Audit-grade fields — only populated for Tenant Admin exports (CA-FE-13)
	actorIp: z.string().nullable().optional(),
	sessionId: z.string().nullable().optional(),
})
export const InboxSearchOutputSchema = z.object({
	rows: z.array(InboxSearchResultRowSchema),
	total: z.number().int().nonnegative(),
	page: z.number().int().positive(),
	pageSize: z.number().int().positive(),
})
export type InboxSearchResultRow = z.infer<typeof InboxSearchResultRowSchema>

// AI suggestion override
export const AcceptSuggestionInputSchema = z.object({
	inboxItemId: z.string(),
})
export const OverrideSuggestionInputSchema = z.object({
	inboxItemId: z.string(),
	correctCategoryKey: z.string(),
	reason: z.string().min(1).max(500),
})
export const SuggestionMutationOutputSchema = z.object({
	inboxItemId: z.string(),
	categoryKey: z.string(),
	caseRef: z.string().nullable(),
})
