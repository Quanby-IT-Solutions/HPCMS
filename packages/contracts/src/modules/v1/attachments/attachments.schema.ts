import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

export const SignDownloadInputSchema = z.object({
	caseRef: z.string(),
	attachmentId: z.string(),
})

export const SignDownloadOutputSchema = z.object({
	url: z.string(),
	expiresAt: dateOrString,
})
