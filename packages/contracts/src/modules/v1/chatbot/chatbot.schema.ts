import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

export const ChatbotIntentSchema = z.enum([
	"greeting",
	"submit_request",
	"track_request",
	"find_info",
	"ask_question",
	"schedule_consult",
	"escalate",
	"freeform",
])

export const ChatbotMessageSchema = z.object({
	id: z.string(),
	role: z.enum(["bot", "patient"]),
	body: z.string(),
	intent: ChatbotIntentSchema.nullable(),
	quickReplies: z
		.array(
			z.object({
				key: z.string(),
				label: z.string(),
				intent: ChatbotIntentSchema.nullable(),
				href: z.string().nullable(),
			})
		)
		.default([]),
	relatedArticles: z
		.array(z.object({ slug: z.string(), title: z.string() }))
		.default([]),
	sentAt: dateOrString,
})
export type ChatbotMessage = z.infer<typeof ChatbotMessageSchema>

export const ChatbotStartSessionOutputSchema = z.object({
	sessionId: z.string(),
	messages: z.array(ChatbotMessageSchema),
})

export const ChatbotSendMessageInputSchema = z.object({
	sessionId: z.string(),
	body: z.string().min(1).max(2000),
	quickReplyKey: z.string().nullable().optional(),
})

export const ChatbotSendMessageOutputSchema = z.object({
	messages: z.array(ChatbotMessageSchema),
})

export const ChatbotEscalateInputSchema = z.object({
	sessionId: z.string(),
	reason: z.string().max(500).optional(),
})

export const ChatbotEscalateOutputSchema = z.object({
	threadId: z.string(),
})
