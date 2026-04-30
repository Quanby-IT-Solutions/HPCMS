import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

const nullableDateOrString = z
	.union([z.date(), z.string()])
	.nullable()
	.transform(v => (v ? (typeof v === "string" ? new Date(v) : v) : null))

export const CaseStatusSchema = z.enum(["submitted", "in_review", "approved", "rejected", "closed", "withdrawn"])
export const CasePrioritySchema = z.enum(["low", "medium", "high", "urgent"])
export const CaseVisibilitySchema = z.enum(["internal", "patient"])

export type CaseStatus = z.infer<typeof CaseStatusSchema>
export type CasePriority = z.infer<typeof CasePrioritySchema>
export type CaseVisibility = z.infer<typeof CaseVisibilitySchema>

export const UploadFileMetaSchema = z.object({
	kind: z.string().min(1),
	filename: z.string().min(1),
	contentType: z.enum(["application/pdf", "image/jpeg", "image/png"]),
	sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
})

export const RequestUploadsInputSchema = z.object({
	files: z.array(UploadFileMetaSchema).min(1).max(7),
})

export const PresignedUploadSchema = z.object({
	kind: z.string(),
	filename: z.string(),
	key: z.string(),
	url: z.string(),
	expiresAt: dateOrString,
})

export const RequestUploadsOutputSchema = z.object({
	uploads: z.array(PresignedUploadSchema),
})

export const AttachmentRefSchema = z.object({
	kind: z.string().min(1),
	key: z.string().min(1),
	filename: z.string().min(1),
})

export const LoaSubmitInputSchema = z.object({
	payload: z.record(z.string(), z.unknown()),
	attachments: z.array(AttachmentRefSchema).min(1).max(7),
})

export const LoaSubmitOutputSchema = z.object({
	caseRef: z.string(),
	caseId: z.string(),
})

export const CaseEventSchema = z.object({
	id: z.string(),
	caseId: z.string(),
	eventType: z.string(),
	actorUserId: z.string().nullable(),
	payload: z.unknown().nullable(),
	visibility: CaseVisibilitySchema,
	createdAt: dateOrString,
	updatedAt: dateOrString,
})

export type CaseEvent = z.infer<typeof CaseEventSchema>

export const CaseAttachmentSchema = z.object({
	id: z.string(),
	tenantId: z.string(),
	caseId: z.string(),
	kind: z.string(),
	storageKey: z.string(),
	originalFilename: z.string(),
	contentType: z.string(),
	sizeBytes: z.number(),
	uploadedByUserId: z.string().nullable(),
	uploadedAt: dateOrString,
	createdAt: dateOrString,
	updatedAt: dateOrString,
})

export type CaseAttachment = z.infer<typeof CaseAttachmentSchema>

export const CaseSchema = z.object({
	id: z.string(),
	tenantId: z.string(),
	caseRef: z.string(),
	caseType: z.string(),
	status: CaseStatusSchema,
	priority: CasePrioritySchema,
	sourceChannel: z.string().nullable(),
	patientId: z.string(),
	practitionerId: z.string().nullable(),
	assignedUserId: z.string().nullable(),
	submittedAt: dateOrString,
	inReviewAt: nullableDateOrString,
	resolvedAt: nullableDateOrString,
	closedAt: nullableDateOrString,
	outcome: z.string().nullable(),
	rejectionReason: z.string().nullable(),
	payload: z.unknown().nullable(),
	createdAt: dateOrString,
	updatedAt: dateOrString,
})

export type Case = z.infer<typeof CaseSchema>

export const CaseDetailSchema = CaseSchema.extend({
	events: z.array(CaseEventSchema),
	attachments: z.array(CaseAttachmentSchema),
})

export type CaseDetail = z.infer<typeof CaseDetailSchema>

export const PaginatedCasesOutputSchema = z.object({
	items: z.array(CaseSchema),
	total: z.number(),
	page: z.number(),
	limit: z.number(),
})

export const CaseMutationOutputSchema = z.object({
	success: z.boolean(),
	caseId: z.string(),
})

export const MyRequestsInputSchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
})

export const GetCaseInputSchema = z.object({ ref: z.string() })

export const WithdrawInputSchema = z.object({ ref: z.string() })

export const CaseListInputSchema = z.object({
	tab: z.enum(["mine", "team", "all_open"]).default("all_open"),
	type: z.string().optional(),
	status: CaseStatusSchema.optional(),
	priority: CasePrioritySchema.optional(),
	sourceChannel: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	sort: z.enum(["oldest_first", "newest_first", "priority_desc"]).default("oldest_first"),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
})

export const ClaimInputSchema = z.object({ ref: z.string() })

export const AssignInputSchema = z.object({
	ref: z.string(),
	assigneeUserId: z.string(),
})

export const ApproveInputSchema = z.object({ ref: z.string() })

export const RejectInputSchema = z.object({
	ref: z.string(),
	reason: z.string().min(1),
})

export const CloseInputSchema = z.object({ ref: z.string() })

export const AddEventInputSchema = z.object({
	ref: z.string(),
	eventType: z.string().min(1),
	payload: z.record(z.string(), z.unknown()).optional(),
	visibility: CaseVisibilitySchema.default("internal"),
})

// ============================================================================
// Queue (CA-BE-04) — extended list + KPIs for the case agent dashboard
// ============================================================================

export const RiskLevelSchema = z.enum(["low", "moderate", "high", "critical"])
export type RiskLevel = z.infer<typeof RiskLevelSchema>

export const QueueRowSchema = CaseSchema.extend({
	patientName: z.string(),
	patientMrn: z.string(),
	assigneeName: z.string().nullable(),
	slaDueAt: nullableDateOrString,
	slaBreached: z.boolean(),
	ageMinutes: z.number().int().nonnegative(),
	riskLevel: RiskLevelSchema.nullable(),
	flagCount: z.number().int().nonnegative().default(0),
})
export type QueueRow = z.infer<typeof QueueRowSchema>

export const QueueListInputSchema = CaseListInputSchema.extend({
	riskLevel: RiskLevelSchema.optional(),
	slaBreaching: z.boolean().optional(),
})

export const QueueListOutputSchema = z.object({
	items: z.array(QueueRowSchema),
	total: z.number(),
	page: z.number(),
	pageSize: z.number(),
})

export const QueueKpisOutputSchema = z.object({
	mineCount: z.number().int().nonnegative(),
	teamCount: z.number().int().nonnegative(),
	allOpenCount: z.number().int().nonnegative(),
	slaBreachingCount: z.number().int().nonnegative(),
	criticalRiskCount: z.number().int().nonnegative(),
})

// ============================================================================
// Resolution (CA-FE-07)
// ============================================================================

export const ResolveCategorySchema = z.enum([
	"resolved_patient_satisfied",
	"escalated_to_clinician",
	"closed_duplicate",
	"closed_no_action",
])
export type ResolveCategory = z.infer<typeof ResolveCategorySchema>

export const ResolveInputSchema = z.object({
	ref: z.string(),
	category: ResolveCategorySchema,
	summary: z.string().min(1).max(2000),
	attachmentKeys: z.array(z.string()).default([]),
	notifyPatient: z.boolean().default(true),
})
