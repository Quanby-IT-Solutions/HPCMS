import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

export const PhoneCallDirectionSchema = z.enum(["inbound", "outbound"])
export const PhoneReasonCategorySchema = z.enum([
	"loa_inquiry",
	"appointment",
	"medication_query",
	"billing",
	"complaint",
	"other",
])

export const PhoneCallLogInputSchema = z.object({
	direction: PhoneCallDirectionSchema,
	patientId: z.string().nullable(),
	patientNameFreeform: z.string().nullable(),
	calledAt: z.string().datetime(),
	durationSeconds: z.number().int().positive().max(60 * 60 * 4),
	reasonCategory: PhoneReasonCategorySchema,
	summary: z.string().min(1).max(2000),
	caseRef: z.string().nullable(),
})

export const SocialPlatformSchema = z.enum(["facebook", "twitter", "instagram", "other"])

export const SocialIssueCategorySchema = z.enum([
	"complaint",
	"inquiry",
	"compliment",
	"misinformation",
	"other",
])

export const SocialCaptureInputSchema = z.object({
	platform: SocialPlatformSchema,
	postUrl: z.string().url().nullable(),
	authorHandle: z.string().min(1),
	content: z.string().min(1).max(5000),
	patientId: z.string().nullable(),
	isAnonymous: z.boolean(),
	issueCategory: SocialIssueCategorySchema,
	capturedAt: z.string().datetime(),
})

export const ChannelMutationOutputSchema = z.object({
	inboxItemId: z.string(),
	caseRef: z.string().nullable(),
	createdAt: dateOrString,
})

// Portal chat (Case Agent reads / sends; patient also reads/sends from portal)
export const ChatMessageSchema = z.object({
	id: z.string(),
	caseRef: z.string(),
	direction: z.enum(["inbound", "outbound"]),
	body: z.string(),
	sentAt: dateOrString,
	readAt: dateOrString.nullable(),
	authorName: z.string().nullable(),
})
export const ChatListInputSchema = z.object({ caseRef: z.string() })
export const ChatListOutputSchema = z.object({ messages: z.array(ChatMessageSchema) })
export const ChatSendInputSchema = z.object({
	caseRef: z.string(),
	body: z.string().min(1).max(2000),
})
export const ChatSendOutputSchema = z.object({ id: z.string() })
