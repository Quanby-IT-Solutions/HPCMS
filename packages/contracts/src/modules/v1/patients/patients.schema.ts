import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

const nullableDateOrString = z
	.union([z.date(), z.string()])
	.nullable()
	.transform(v => (v ? (typeof v === "string" ? new Date(v) : v) : null))

export const PatientSchema = z.object({
	id: z.string(),
	tenantId: z.string(),
	mrn: z.string(),
	fullName: z.string(),
	lastName: z.string(),
	sexAtBirth: z.string().nullable(),
	dateOfBirth: z.string(),
	ethnicity: z.string().nullable(),
	contact: z.unknown().nullable(),
	dataPrivacyActAcknowledged: z.boolean(),
	dataSharingWithEmrConsent: z.boolean(),
	marketingCommsConsent: z.boolean(),
	researchUseConsent: z.boolean(),
	consentsUpdatedAt: nullableDateOrString,
	fhirResourceId: z.string().nullable(),
	fhirSyncedAt: nullableDateOrString,
	createdAt: dateOrString,
	updatedAt: dateOrString,
})

export type Patient = z.infer<typeof PatientSchema>

export const VerifyMrnInputSchema = z.object({
	mrn: z.string().min(1),
	dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
	lastName: z.string().min(1),
	switchTenantTo: z.string().optional(),
})

export type VerifyMrnInput = z.infer<typeof VerifyMrnInputSchema>

export const VerifyMrnOutputSchema = z.discriminatedUnion("outcome", [
	z.object({ outcome: z.literal("linked"), patient: PatientSchema }),
	z.object({ outcome: z.literal("facilityMismatch"), otherTenantId: z.string() }),
	z.object({ outcome: z.literal("mismatch"), attemptsRemaining: z.number().int() }),
	z.object({ outcome: z.literal("locked"), lockedUntilMs: z.number().int() }),
])

export type VerifyMrnOutput = z.infer<typeof VerifyMrnOutputSchema>

export const PatientIdSchema = z.object({
	id: z.string(),
})

export const PatientSearchInputSchema = z.object({
	query: z.string().min(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
})

// ============================================================================
// Recent patients (CA-FE-03)
// ============================================================================

export const PatientRecentInputSchema = z.object({
	limit: z.coerce.number().int().positive().max(50).default(10),
})

export const RecentPatientSchema = z.object({
	id: z.string(),
	mrn: z.string(),
	fullName: z.string(),
	lastInteractionAt: nullableDateOrString,
	lastInteractionChannel: z.string().nullable(),
	openCaseCount: z.number().int().nonnegative(),
})
export const PatientRecentOutputSchema = z.object({
	patients: z.array(RecentPatientSchema),
})

// ============================================================================
// Patient 360 timeline (CA-FE-04)
// ============================================================================

export const TimelineEntryKindSchema = z.enum([
	"email",
	"phone",
	"portal_chat",
	"social",
	"case_event",
	"fhir_event",
	"consent_event",
])

export const TimelineEntrySchema = z.object({
	id: z.string(),
	kind: TimelineEntryKindSchema,
	occurredAt: dateOrString,
	channel: z.string().nullable(),
	caseRef: z.string().nullable(),
	actorName: z.string().nullable(),
	title: z.string(),
	preview: z.string().nullable(),
	body: z.string().nullable(),
})
export type TimelineEntry = z.infer<typeof TimelineEntrySchema>

export const PatientTimelineInputSchema = z.object({
	patientId: z.string(),
	channel: z.string().optional(),
	caseType: z.string().optional(),
	agentId: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(50),
})
export const PatientTimelineOutputSchema = z.object({
	entries: z.array(TimelineEntrySchema),
	total: z.number().int().nonnegative(),
	page: z.number().int().positive(),
	pageSize: z.number().int().positive(),
})
