import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

export const KbCategorySchema = z.object({
	key: z.string(),
	label: z.string(),
	icon: z.string().nullable(),
	articleCount: z.number().int().nonnegative(),
})
export type KbCategory = z.infer<typeof KbCategorySchema>

export const KbArticleSummarySchema = z.object({
	slug: z.string(),
	title: z.string(),
	excerpt: z.string(),
	category: z.string(),
	updatedAt: dateOrString,
	helpfulCount: z.number().int().nonnegative(),
})
export type KbArticleSummary = z.infer<typeof KbArticleSummarySchema>

export const KbArticleSchema = z.object({
	slug: z.string(),
	title: z.string(),
	bodyMarkdown: z.string(),
	category: z.string(),
	tags: z.array(z.string()),
	updatedAt: dateOrString,
	helpfulCount: z.number().int().nonnegative(),
	notHelpfulCount: z.number().int().nonnegative(),
	related: z.array(KbArticleSummarySchema),
})
export type KbArticle = z.infer<typeof KbArticleSchema>

export const KbSearchInputSchema = z.object({
	q: z.string().default(""),
	category: z.string().optional(),
	limit: z.coerce.number().int().positive().max(50).default(20),
})

export const KbSearchOutputSchema = z.object({
	articles: z.array(KbArticleSummarySchema),
	categories: z.array(KbCategorySchema),
	popular: z.array(KbArticleSummarySchema),
})

export const KbGetArticleInputSchema = z.object({ slug: z.string() })

export const KbVoteFeedbackInputSchema = z.object({
	slug: z.string(),
	helpful: z.boolean(),
	note: z.string().max(500).optional(),
})

export const KbVoteFeedbackOutputSchema = z.object({
	slug: z.string(),
	helpfulCount: z.number().int().nonnegative(),
	notHelpfulCount: z.number().int().nonnegative(),
})
