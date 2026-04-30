import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

const nullableDateOrString = z
	.union([z.date(), z.string()])
	.nullable()
	.transform(v => (v ? (typeof v === "string" ? new Date(v) : v) : null))

// ============================================================================
// SMART launch validation (CL-BE-02)
// ============================================================================

export const LaunchValidateInputSchema = z.object({
	code: z.string().min(1),
	state: z.string().min(1),
	codeVerifier: z.string().min(1),
	iss: z.string().url(),
	redirectUri: z.string().url(),
})

export const LaunchValidateOutputSchema = z.object({
	patientId: z.string(),
	sessionEstablished: z.boolean(),
})

export type LaunchValidateInput = z.infer<typeof LaunchValidateInputSchema>
export type LaunchValidateOutput = z.infer<typeof LaunchValidateOutputSchema>

// ============================================================================
// Case summary (CL-BE-03)
// ============================================================================

export const ClinicianCaseSummaryStatusSchema = z.enum([
	"submitted",
	"in_review",
	"approved",
	"rejected",
	"closed",
	"withdrawn",
])

export const ClinicianCaseSummaryItemSchema = z.object({
	caseRef: z.string(),
	caseType: z.string(),
	status: ClinicianCaseSummaryStatusSchema,
	priority: z.enum(["low", "medium", "high", "urgent"]),
	openedAt: dateOrString,
	assignedAgentName: z.string().nullable(),
	assignedAgentEmail: z.string().nullable(),
	loaStatus: z.string().nullable(),
	latestNote: z.string().nullable(),
	latestNoteAt: nullableDateOrString,
	flagCount: z.number().int().nonnegative(),
})

export const PatientHeaderSchema = z.object({
	patientId: z.string(),
	mrn: z.string(),
	fullName: z.string(),
	dateOfBirth: nullableDateOrString,
	age: z.number().int().nonnegative(),
	sex: z.enum(["M", "F", "Other", "Unknown"]),
	hasAllergies: z.boolean(),
	linkedToPcms: z.boolean(),
})

export const ClinicianCaseSummaryInputSchema = z.object({
	patientId: z.string().min(1),
})

export const ClinicianCaseSummaryOutputSchema = z.object({
	patient: PatientHeaderSchema,
	activeCount: z.number().int().nonnegative(),
	mostRecentCommunication: z.string().nullable(),
	cases: z.array(ClinicianCaseSummaryItemSchema),
	lastSyncedAt: dateOrString,
})

export type ClinicianCaseSummary = z.infer<typeof ClinicianCaseSummaryOutputSchema>
export type ClinicianCaseSummaryItem = z.infer<typeof ClinicianCaseSummaryItemSchema>
export type PatientHeader = z.infer<typeof PatientHeaderSchema>

// ============================================================================
// Notes & flags (CL-BE-04)
// ============================================================================

export const FlagTypeSchema = z.enum([
	"urgent_review",
	"medication_query",
	"follow_up_required",
	"safety_concern",
])

export type FlagType = z.infer<typeof FlagTypeSchema>

export const AddNoteInputSchema = z.object({
	caseRef: z.string().min(1),
	body: z.string().min(1).max(500),
})

export const FlagCaseInputSchema = z.object({
	caseRef: z.string().min(1),
	flagType: FlagTypeSchema,
	reason: z.string().min(1).max(500),
})

export const ClinicianMutationOutputSchema = z.object({
	caseRef: z.string(),
	eventId: z.string(),
})

export type AddNoteInput = z.infer<typeof AddNoteInputSchema>
export type FlagCaseInput = z.infer<typeof FlagCaseInputSchema>

// ============================================================================
// FHIR enrichment (CL-BE-05)
// ============================================================================

const SyncedSection = <T extends z.ZodTypeAny>(item: T) =>
	z.object({
		items: z.array(item),
		lastSyncedAt: dateOrString,
	})

export const AllergyRowSchema = z.object({
	id: z.string(),
	substance: z.string(),
	severity: z.enum(["mild", "moderate", "severe", "unknown"]).default("unknown"),
	reaction: z.string().nullable(),
	verifiedAt: nullableDateOrString,
})

export const MedicationRowSchema = z.object({
	id: z.string(),
	name: z.string(),
	dose: z.string().nullable(),
	frequency: z.string().nullable(),
	status: z.enum(["active", "completed", "stopped", "on_hold", "unknown"]).default("unknown"),
	prescribedBy: z.string().nullable(),
	startedAt: nullableDateOrString,
})

export const ImmunizationRowSchema = z.object({
	id: z.string(),
	vaccine: z.string(),
	administeredAt: nullableDateOrString,
	lotNumber: z.string().nullable(),
	site: z.string().nullable(),
})

export const ObservationRowSchema = z.object({
	id: z.string(),
	code: z.string(),
	display: z.string(),
	value: z.string(),
	unit: z.string().nullable(),
	category: z.string().nullable(),
	recordedAt: nullableDateOrString,
})

export const CarePlanRowSchema = z.object({
	id: z.string(),
	title: z.string(),
	status: z.string(),
	intent: z.string().nullable(),
	periodStart: nullableDateOrString,
	periodEnd: nullableDateOrString,
	goals: z.array(z.string()),
})

export const DiagnosticRowSchema = z.object({
	id: z.string(),
	name: z.string(),
	status: z.string(),
	conclusion: z.string().nullable(),
	effectiveAt: nullableDateOrString,
})

export const PatientIdInputSchema = z.object({
	patientId: z.string().min(1),
})

export const AllergiesOutputSchema = SyncedSection(AllergyRowSchema)
export const MedicationsOutputSchema = SyncedSection(MedicationRowSchema)
export const ImmunizationsOutputSchema = SyncedSection(ImmunizationRowSchema)
export const ObservationsOutputSchema = SyncedSection(ObservationRowSchema)
export const CarePlansOutputSchema = SyncedSection(CarePlanRowSchema)
export const DiagnosticsOutputSchema = SyncedSection(DiagnosticRowSchema)

export type AllergyRow = z.infer<typeof AllergyRowSchema>
export type MedicationRow = z.infer<typeof MedicationRowSchema>
export type ImmunizationRow = z.infer<typeof ImmunizationRowSchema>
export type ObservationRow = z.infer<typeof ObservationRowSchema>
export type CarePlanRow = z.infer<typeof CarePlanRowSchema>
export type DiagnosticRow = z.infer<typeof DiagnosticRowSchema>
