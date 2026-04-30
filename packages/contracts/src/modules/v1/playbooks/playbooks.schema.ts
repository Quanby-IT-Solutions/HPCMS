import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

const nullableDateOrString = z
	.union([z.date(), z.string()])
	.nullable()
	.transform(v => (v ? (typeof v === "string" ? new Date(v) : v) : null))

export const PlaybookStepSchema = z.object({
	stepNumber: z.number().int().positive(),
	title: z.string(),
	body: z.string().nullable(),
	deepLink: z.string().nullable(),
})
export type PlaybookStep = z.infer<typeof PlaybookStepSchema>

export const PlaybookSchema = z.object({
	key: z.string(),
	name: z.string(),
	caseType: z.string(),
	description: z.string().nullable(),
	steps: z.array(PlaybookStepSchema),
	updatedAt: dateOrString,
})
export type Playbook = z.infer<typeof PlaybookSchema>

export const PlaybookListInputSchema = z.object({
	caseType: z.string().optional(),
})
export const PlaybookListOutputSchema = z.object({ playbooks: z.array(PlaybookSchema) })

export const CasePlaybookProgressItemSchema = z.object({
	stepNumber: z.number().int().positive(),
	completedAt: nullableDateOrString,
	completedByName: z.string().nullable(),
})

export const CasePlaybookSchema = z.object({
	caseRef: z.string(),
	playbook: PlaybookSchema,
	progress: z.array(CasePlaybookProgressItemSchema),
})
export type CasePlaybook = z.infer<typeof CasePlaybookSchema>

export const CaseRefInputSchema = z.object({ caseRef: z.string() })

export const CompletePlaybookStepInputSchema = z.object({
	caseRef: z.string(),
	stepNumber: z.number().int().positive(),
	completed: z.boolean(),
})
export const PlaybookMutationOutputSchema = z.object({
	caseRef: z.string(),
	stepNumber: z.number().int().positive(),
	completedAt: nullableDateOrString,
})
