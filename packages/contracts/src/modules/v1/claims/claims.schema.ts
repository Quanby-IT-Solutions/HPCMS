import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

const nullableDateOrString = z
	.union([z.date(), z.string()])
	.nullable()
	.transform(v => (v ? (typeof v === "string" ? new Date(v) : v) : null))

export const ClaimStatusSchema = z.enum([
	"draft",
	"submitted",
	"under_review",
	"approved",
	"rejected",
	"appealed",
	"paid",
])
export type ClaimStatus = z.infer<typeof ClaimStatusSchema>

export const ClaimTypeSchema = z.enum(["loa", "hospitalization", "outpatient"])
export type ClaimType = z.infer<typeof ClaimTypeSchema>

export const PayerSchema = z.object({
	id: z.string(),
	name: z.string(),
	code: z.string().nullable(),
	contactEmail: z.string().nullable(),
	createdAt: dateOrString,
})
export type Payer = z.infer<typeof PayerSchema>

export const CoverageSchema = z.object({
	id: z.string(),
	payerId: z.string(),
	patientId: z.string(),
	memberId: z.string(),
	planName: z.string(),
	effectiveFrom: nullableDateOrString,
	effectiveTo: nullableDateOrString,
})

export const ClaimHeaderSchema = z.object({
	id: z.string(),
	caseRef: z.string(),
	patientId: z.string(),
	patientName: z.string(),
	payerId: z.string(),
	payerName: z.string(),
	coverageId: z.string().nullable(),
	memberId: z.string().nullable(),
	claimType: ClaimTypeSchema,
	submissionDate: nullableDateOrString,
	totalAmount: z.number(),
	approvedAmount: z.number().nullable(),
	status: ClaimStatusSchema,
	createdAt: dateOrString,
	updatedAt: dateOrString,
})
export type ClaimHeader = z.infer<typeof ClaimHeaderSchema>

export const ClaimLineSchema = z.object({
	id: z.string(),
	claimId: z.string(),
	lineNumber: z.number().int().positive(),
	codeSystem: z.enum(["icd10", "phic_cpt", "ndc", "loinc", "internal"]),
	code: z.string(),
	description: z.string(),
	quantity: z.number(),
	billedAmount: z.number(),
	approvedAmount: z.number().nullable(),
})
export type ClaimLine = z.infer<typeof ClaimLineSchema>

// Inputs
export const ClaimIdInputSchema = z.object({ claimId: z.string() })
export const ClaimsListInputSchema = z.object({
	status: ClaimStatusSchema.optional(),
	payerId: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(25),
})
export const ClaimsListOutputSchema = z.object({
	headers: z.array(ClaimHeaderSchema),
	total: z.number().int().nonnegative(),
	page: z.number().int().positive(),
	pageSize: z.number().int().positive(),
})

export const UpsertClaimHeaderInputSchema = z.object({
	id: z.string().nullable(),
	caseRef: z.string(),
	patientId: z.string(),
	payerId: z.string(),
	coverageId: z.string().nullable(),
	memberId: z.string().nullable(),
	claimType: ClaimTypeSchema,
	submissionDate: z.string().datetime().nullable(),
	totalAmount: z.number().nonnegative(),
})

export const UpsertClaimLineInputSchema = z.object({
	id: z.string().nullable(),
	claimId: z.string(),
	codeSystem: z.enum(["icd10", "phic_cpt", "ndc", "loinc", "internal"]),
	code: z.string(),
	description: z.string(),
	approvedAmount: z.number().nullable().optional(),
	quantity: z.number().positive(),
	billedAmount: z.number().nonnegative(),
})

export const ClaimMutationOutputSchema = z.object({ claimId: z.string() })

export const UpdateClaimStatusInputSchema = z.object({
	claimId: z.string(),
	nextStatus: ClaimStatusSchema,
	note: z.string().max(2000).optional(),
})

// KPI / Aging
export const ClaimsKpiSchema = z.object({
	totalDraft: z.number().int().nonnegative(),
	totalSubmitted: z.number().int().nonnegative(),
	totalUnderReview: z.number().int().nonnegative(),
	totalApproved: z.number().int().nonnegative(),
	totalRejected: z.number().int().nonnegative(),
	totalPaid: z.number().int().nonnegative(),
	outstandingAmount: z.number().nonnegative(),
	slaBreaching: z.number().int().nonnegative(),
})

export const AgingBucketSchema = z.object({
	bucket: z.enum(["0-30", "31-60", "61-90", "90+"]),
	count: z.number().int().nonnegative(),
	totalAmount: z.number().nonnegative(),
})
export const AgingReportOutputSchema = z.object({
	buckets: z.array(AgingBucketSchema),
	rows: z.array(
		z.object({
			claimId: z.string(),
			caseRef: z.string(),
			patientName: z.string(),
			payerName: z.string(),
			ageDays: z.number().int().nonnegative(),
			amount: z.number().nonnegative(),
			status: ClaimStatusSchema,
		})
	),
})

// DRG
export const DrgRowSchema = z.object({
	id: z.string(),
	claimId: z.string(),
	rank: z.number().int().positive(),
	codeSystem: z.enum(["icd10", "phic_cpt"]),
	code: z.string(),
	description: z.string(),
})
export type DrgRow = z.infer<typeof DrgRowSchema>

export const UpsertDrgRowInputSchema = z.object({
	id: z.string().nullable(),
	claimId: z.string(),
	kind: z.enum(["diagnosis", "procedure"]),
	rank: z.number().int().positive(),
	codeSystem: z.enum(["icd10", "phic_cpt"]),
	code: z.string(),
	description: z.string(),
})
export const ReorderDrgInputSchema = z.object({
	claimId: z.string(),
	kind: z.enum(["diagnosis", "procedure"]),
	orderedIds: z.array(z.string()),
})
export const DrgValidateInputSchema = z.object({ claimId: z.string() })
export const DrgValidateOutputSchema = z.object({
	ok: z.boolean(),
	errors: z.array(
		z.object({ code: z.string(), message: z.string(), severity: z.enum(["error", "warn"]) })
	),
})

// XML export
export const XmlExportInputSchema = z.object({ claimId: z.string() })
export const XmlExportOutputSchema = z.object({
	claimId: z.string(),
	xml: z.string(),
	hash: z.string(),
	generatedAt: dateOrString,
	validationErrors: z.array(z.object({ code: z.string(), message: z.string() })),
})
