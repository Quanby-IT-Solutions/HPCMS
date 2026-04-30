import { z } from "zod"

export const CodeSystemSchema = z.enum(["icd10", "phic_cpt", "loinc", "ndc", "internal"])

export const CodeRowSchema = z.object({
	system: CodeSystemSchema,
	code: z.string(),
	display: z.string(),
	category: z.string().nullable(),
})
export type CodeRow = z.infer<typeof CodeRowSchema>

export const CodeLookupInputSchema = z.object({
	system: CodeSystemSchema,
	q: z.string().min(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
})
export const CodeLookupOutputSchema = z.object({ rows: z.array(CodeRowSchema) })
