import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

export const OutboundChannelSchema = z.enum(["email", "portal_chat"])

export const OutboundAttachmentSchema = z.object({
	key: z.string(),
	filename: z.string(),
	contentType: z.string(),
	sizeBytes: z.number().int().positive(),
})

export const SendOutboundInputSchema = z.object({
	channel: OutboundChannelSchema,
	caseRef: z.string(),
	to: z.array(z.string().min(1)).min(1),
	cc: z.array(z.string()).default([]),
	subject: z.string().min(1).max(500),
	bodyHtml: z.string().min(1),
	bodyText: z.string().optional(),
	templateKey: z.string().nullable(),
	attachments: z.array(OutboundAttachmentSchema).default([]),
})

export const SendOutboundOutputSchema = z.object({
	messageId: z.string(),
	caseRef: z.string(),
	sentAt: dateOrString,
})
