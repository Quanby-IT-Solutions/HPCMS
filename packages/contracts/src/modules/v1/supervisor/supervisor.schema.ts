import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

const nullableDateOrString = z
	.union([z.date(), z.string()])
	.nullable()
	.transform(v => (v ? (typeof v === "string" ? new Date(v) : v) : null))

// ============================================================================
// Patient management (SUP-FE-03, 04, 05)
// ============================================================================

export const DuplicateCandidateSchema = z.object({
	patientId: z.string(),
	fullName: z.string(),
	dateOfBirth: z.string(),
	mrn: z.string(),
	matchScore: z.number().min(0).max(1),
})
export type DuplicateCandidate = z.infer<typeof DuplicateCandidateSchema>

export const SupervisorPatientRegisterInputSchema = z.object({
	fullName: z.string().min(1),
	lastName: z.string().min(1),
	dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	sexAtBirth: z.enum(["male", "female", "other", "prefer_not_to_say"]),
	ethnicity: z.string().nullable().optional(),
	address: z.object({
		street: z.string(),
		city: z.string(),
		province: z.string(),
		postalCode: z.string(),
	}).optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	emergencyContact: z.object({
		name: z.string(),
		relationship: z.string(),
		phone: z.string(),
	}).optional(),
	hmoCardNumber: z.string().optional(),
	hmoProvider: z.string().optional(),
	consentDataProcessing: z.boolean().default(false),
	consentCommunications: z.boolean().default(false),
	consentMarketing: z.boolean().default(false),
	consentResearchUse: z.boolean().default(false),
	consentServiceCategories: z.boolean().default(false),
})
export type SupervisorPatientRegisterInput = z.infer<typeof SupervisorPatientRegisterInputSchema>

export const SupervisorPatientRegisterOutputSchema = z.object({
	patientId: z.string(),
	isDuplicate: z.boolean(),
	duplicateCandidates: z.array(DuplicateCandidateSchema),
})

export const CheckDuplicatesInputSchema = z.object({
	fullName: z.string().min(1),
	dateOfBirth: z.string(),
	phone: z.string().optional(),
})
export const CheckDuplicatesOutputSchema = z.object({
	candidates: z.array(DuplicateCandidateSchema),
})

export const MergePatientsInputSchema = z.object({
	survivorId: z.string(),
	supersededId: z.string(),
	fieldResolutions: z.record(z.string(), z.string()),
	reason: z.string().min(1).max(500),
})
export const MergePatientsOutputSchema = z.object({
	survivorId: z.string(),
	mergedAt: dateOrString,
})

export const UpdateDemographicsInputSchema = z.object({
	patientId: z.string(),
	fullName: z.string().optional(),
	lastName: z.string().optional(),
	dateOfBirth: z.string().optional(),
	sexAtBirth: z.string().optional(),
	ethnicity: z.string().nullable().optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	address: z.unknown().optional(),
	emergencyContact: z.unknown().optional(),
	hmoCardNumber: z.string().optional(),
	hmoProvider: z.string().optional(),
	changeReason: z.string().min(1).max(500),
})
export const UpdateDemographicsOutputSchema = z.object({
	patientId: z.string(),
	updatedAt: dateOrString,
})

// MRN linking + FHIR sync (SUP-FE-05)
export const MrnLinkInputSchema = z.object({
	patientId: z.string(),
	fhirPatientId: z.string().min(1),
	issuer: z.string().optional(),
})
export const MrnLinkOutputSchema = z.object({
	patientId: z.string(),
	mrn: z.string(),
	linkedAt: dateOrString,
})

export const FhirSyncTriggerInputSchema = z.object({ patientId: z.string() })
export const FhirSyncTriggerOutputSchema = z.object({
	syncedAt: dateOrString,
	changedFields: z.array(z.string()),
})

// Cross-facility patient context (SUP-FE-20)
export const FacilityAccessLevelSchema = z.enum(["full", "read_only", "none"])
export const FacilityContextItemSchema = z.object({
	tenantId: z.string(),
	facilityName: z.string(),
	caseCount: z.number().int().nonnegative(),
	lastInteractionAt: nullableDateOrString,
	accessLevel: FacilityAccessLevelSchema,
})
export const CrossFacilityContextOutputSchema = z.object({
	patientId: z.string(),
	facilities: z.array(FacilityContextItemSchema),
})

export const RequestCrossFacilityAccessInputSchema = z.object({
	patientId: z.string(),
	targetTenantId: z.string(),
	requestedLevel: z.enum(["read_only", "full"]),
	justification: z.string().min(1).max(1000),
})
export const RequestCrossFacilityAccessOutputSchema = z.object({
	requestId: z.string(),
	status: z.enum(["pending", "approved", "denied"]),
})

export type FacilityContextItem = z.infer<typeof FacilityContextItemSchema>
export type CrossFacilityContextOutput = z.infer<typeof CrossFacilityContextOutputSchema>

// ============================================================================
// Consent management (SUP-FE-06)
// ============================================================================

export const ConsentCategorySchema = z.enum([
	"data_processing",
	"communications",
	"marketing",
	"research_use",
	"service_specific",
])
export type ConsentCategory = z.infer<typeof ConsentCategorySchema>

export const ConsentStatusSchema = z.enum(["granted", "withdrawn", "not_collected"])
export type ConsentStatus = z.infer<typeof ConsentStatusSchema>

export const ConsentCaptureMethodSchema = z.enum([
	"written",
	"verbal_witnessed",
	"electronic",
])

export const ConsentRecordInputSchema = z.object({
	patientId: z.string(),
	category: ConsentCategorySchema,
	status: ConsentStatusSchema,
	captureMethod: ConsentCaptureMethodSchema,
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	documentKey: z.string().optional(),
})

export const ConsentWithdrawInputSchema = z.object({
	patientId: z.string(),
	category: ConsentCategorySchema,
	effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	reason: z.string().min(1).max(500),
})

export const ConsentHistoryItemSchema = z.object({
	id: z.string(),
	category: ConsentCategorySchema,
	status: ConsentStatusSchema,
	captureMethod: ConsentCaptureMethodSchema.nullable(),
	recordedAt: dateOrString,
	recordedBy: z.string(),
	documentKey: z.string().nullable().optional(),
})
export type ConsentHistoryItem = z.infer<typeof ConsentHistoryItemSchema>

export const ConsentCategoryStatusSchema = z.object({
	category: ConsentCategorySchema,
	status: ConsentStatusSchema,
	effectiveDate: nullableDateOrString,
})
export const ConsentListOutputSchema = z.object({
	categories: z.array(ConsentCategoryStatusSchema),
	history: z.array(ConsentHistoryItemSchema),
})
export type ConsentListOutput = z.infer<typeof ConsentListOutputSchema>

export const ConsentMutationOutputSchema = z.object({
	patientId: z.string(),
	category: ConsentCategorySchema,
	status: ConsentStatusSchema,
	recordedAt: dateOrString,
})

// ============================================================================
// Case operations (SUP-FE-08, 09, 10)
// ============================================================================

export const SupervisorCaseCreateInputSchema = z.object({
	patientId: z.string(),
	caseType: z.string().min(1),
	sourceChannel: z.string().optional(),
	priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
	practitionerFhirId: z.string().optional(),
	description: z.string().min(1).max(2000),
	teamId: z.string().optional(),
	hmoAuthNumber: z.string().optional(),
	complaintCategory: z.string().optional(),
	referringDept: z.string().optional(),
})
export const SupervisorCaseCreateOutputSchema = z.object({
	caseRef: z.string(),
	caseId: z.string(),
})

export const CaseAssignInputSchema = z.object({
	ref: z.string(),
	teamId: z.string(),
	agentUserId: z.string(),
	routingNotes: z.string().max(500).optional(),
})
export const CaseAssignOutputSchema = z.object({
	caseRef: z.string(),
	assignedAt: dateOrString,
})

export const EscalationLevelSchema = z.enum([
	"senior_coordinator",
	"department_head",
	"incident_management",
])
export type EscalationLevel = z.infer<typeof EscalationLevelSchema>

export const CaseEscalateInputSchema = z.object({
	ref: z.string(),
	escalationLevel: EscalationLevelSchema,
	reasonCategory: z.string().min(1),
	notes: z.string().min(1).max(2000),
})
export const CaseEscalateOutputSchema = z.object({
	caseRef: z.string(),
	status: z.string(),
	escalatedAt: dateOrString,
})

export const EscalationHistoryItemSchema = z.object({
	id: z.string(),
	level: EscalationLevelSchema,
	reasonCategory: z.string(),
	notes: z.string(),
	escalatedBy: z.string(),
	escalatedAt: dateOrString,
})
export type EscalationHistoryItem = z.infer<typeof EscalationHistoryItemSchema>

export const EscalationHistoryOutputSchema = z.object({
	caseRef: z.string(),
	history: z.array(EscalationHistoryItemSchema),
})

export const RelationshipTypeSchema = z.enum([
	"follow_up_from",
	"spawned_from",
	"duplicate_of",
	"part_of_incident",
])
export type RelationshipType = z.infer<typeof RelationshipTypeSchema>

export const RelatedCaseLinkInputSchema = z.object({
	ref: z.string(),
	relatedCaseRef: z.string(),
	relationshipType: RelationshipTypeSchema,
})
export const RelatedCaseLinkSchema = z.object({
	caseRef: z.string(),
	caseType: z.string(),
	status: z.string(),
	patientName: z.string().nullable(),
	relationshipType: RelationshipTypeSchema,
	linkedAt: dateOrString,
})
export type RelatedCaseLink = z.infer<typeof RelatedCaseLinkSchema>

export const RelatedCasesOutputSchema = z.object({
	caseRef: z.string(),
	links: z.array(RelatedCaseLinkSchema),
})

export const UnlinkRelatedCaseInputSchema = z.object({
	ref: z.string(),
	relatedCaseRef: z.string(),
})

// ============================================================================
// Program enrollment (SUP-FE-16)
// ============================================================================

export const EnrollmentStatusSchema = z.enum([
	"active",
	"suspended",
	"completed",
	"withdrawn",
])
export type EnrollmentStatus = z.infer<typeof EnrollmentStatusSchema>

export const SupervisorEnrollInputSchema = z.object({
	patientId: z.string(),
	programId: z.string(),
	startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	coordinatorUserId: z.string().optional(),
	status: EnrollmentStatusSchema.default("active"),
	notes: z.string().max(500).optional(),
})
export const SupervisorEnrollOutputSchema = z.object({
	enrollmentId: z.string(),
	status: EnrollmentStatusSchema,
	enrolledAt: dateOrString,
})

export const EnrollmentStatusUpdateInputSchema = z.object({
	enrollmentId: z.string(),
	status: EnrollmentStatusSchema,
	endDate: z.string().optional(),
	reason: z.string().min(1).max(500),
})

export const EnrollmentHistoryItemSchema = z.object({
	id: z.string(),
	status: EnrollmentStatusSchema,
	reason: z.string().nullable(),
	updatedBy: z.string(),
	updatedAt: dateOrString,
})

export const EnrollmentDetailSchema = z.object({
	enrollmentId: z.string(),
	patientId: z.string(),
	patientName: z.string(),
	programId: z.string(),
	programName: z.string(),
	status: EnrollmentStatusSchema,
	startDate: nullableDateOrString,
	endDate: nullableDateOrString,
	coordinatorName: z.string().nullable(),
	notes: z.string().nullable(),
	statusHistory: z.array(EnrollmentHistoryItemSchema),
})
export type EnrollmentDetail = z.infer<typeof EnrollmentDetailSchema>

export const EnrollmentListInputSchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(25),
	programId: z.string().optional(),
	status: EnrollmentStatusSchema.optional(),
	coordinatorUserId: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
})
export const EnrollmentListRowSchema = z.object({
	enrollmentId: z.string(),
	patientId: z.string(),
	patientName: z.string(),
	programName: z.string(),
	status: EnrollmentStatusSchema,
	startDate: nullableDateOrString,
	coordinatorName: z.string().nullable(),
})
export const EnrollmentListOutputSchema = z.object({
	rows: z.array(EnrollmentListRowSchema),
	total: z.number().int().nonnegative(),
	page: z.number().int().positive(),
	pageSize: z.number().int().positive(),
})

// ============================================================================
// Medical devices (SUP-FE-17)
// ============================================================================

export const DeviceStatusSchema = z.enum([
	"assigned",
	"in_use",
	"returned",
	"decommissioned",
	"under_maintenance",
])
export type DeviceStatus = z.infer<typeof DeviceStatusSchema>

export const MaintenanceTypeSchema = z.enum([
	"routine",
	"repair",
	"calibration",
	"inspection",
])

export const SupervisorDeviceAssignInputSchema = z.object({
	patientId: z.string(),
	serialNumber: z.string().min(1),
	deviceType: z.string().min(1),
	assignmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	caseRef: z.string().optional(),
	initialStatus: DeviceStatusSchema.default("assigned"),
})
export const SupervisorDeviceAssignOutputSchema = z.object({
	deviceId: z.string(),
	status: DeviceStatusSchema,
	assignedAt: dateOrString,
})

export const DeviceMaintenanceAddInputSchema = z.object({
	deviceId: z.string(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	maintenanceType: MaintenanceTypeSchema,
	technician: z.string().min(1),
	notes: z.string().max(1000).optional(),
})
export const DeviceMaintenanceRecordSchema = z.object({
	id: z.string(),
	date: nullableDateOrString,
	maintenanceType: MaintenanceTypeSchema,
	technician: z.string(),
	notes: z.string().nullable(),
	recordedAt: dateOrString,
})

export const DeviceStatusUpdateInputSchema = z.object({
	deviceId: z.string(),
	status: DeviceStatusSchema,
})

export const DeviceDetailSchema = z.object({
	deviceId: z.string(),
	serialNumber: z.string(),
	deviceType: z.string(),
	status: DeviceStatusSchema,
	patientId: z.string().nullable(),
	patientName: z.string().nullable(),
	caseRef: z.string().nullable(),
	assignmentDate: nullableDateOrString,
	lastServiceDate: nullableDateOrString,
	maintenanceHistory: z.array(DeviceMaintenanceRecordSchema),
})
export type DeviceDetail = z.infer<typeof DeviceDetailSchema>

export const DeviceInventoryInputSchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(25),
	status: DeviceStatusSchema.optional(),
	deviceType: z.string().optional(),
})
export const DeviceInventoryRowSchema = z.object({
	deviceId: z.string(),
	serialNumber: z.string(),
	deviceType: z.string(),
	status: DeviceStatusSchema,
	patientName: z.string().nullable(),
	lastServiceDate: nullableDateOrString,
})
export const DeviceInventoryOutputSchema = z.object({
	rows: z.array(DeviceInventoryRowSchema),
	total: z.number().int().nonnegative(),
	page: z.number().int().positive(),
	pageSize: z.number().int().positive(),
})

// ============================================================================
// Major incidents (SUP-FE-15)
// ============================================================================

export const IncidentSeveritySchema = z.enum([
	"low",
	"medium",
	"high",
	"critical",
])
export type IncidentSeverity = z.infer<typeof IncidentSeveritySchema>

export const IncidentStatusSchema = z.enum([
	"detected",
	"investigating",
	"mitigating",
	"resolved",
	"closed",
])
export type IncidentStatus = z.infer<typeof IncidentStatusSchema>

export const IncidentSchema = z.object({
	incidentId: z.string(),
	title: z.string(),
	description: z.string(),
	severity: IncidentSeveritySchema,
	status: IncidentStatusSchema,
	caseRefs: z.array(z.string()),
	rootCauseNotes: z.string().nullable(),
	resolutionDoc: z.string().nullable(),
	createdBy: z.string(),
	createdAt: dateOrString,
	updatedAt: dateOrString,
})
export type Incident = z.infer<typeof IncidentSchema>

export const IncidentCreateInputSchema = z.object({
	title: z.string().min(1).max(200),
	description: z.string().min(1).max(2000),
	severity: IncidentSeveritySchema,
	caseRefs: z.array(z.string()).min(2),
})
export const IncidentCreateOutputSchema = z.object({
	incidentId: z.string(),
	createdAt: dateOrString,
})

export const IncidentUpdateInputSchema = z.object({
	id: z.string(),
	severity: IncidentSeveritySchema.optional(),
	status: IncidentStatusSchema.optional(),
	rootCauseNotes: z.string().max(2000).optional(),
	resolutionDoc: z.string().max(5000).optional(),
})

export const IncidentStatusEventSchema = z.object({
	id: z.string(),
	status: IncidentStatusSchema,
	note: z.string().nullable(),
	updatedBy: z.string(),
	updatedAt: dateOrString,
})

export const IncidentDetailSchema = IncidentSchema.extend({
	statusTimeline: z.array(IncidentStatusEventSchema),
	affectedScope: z.object({
		departments: z.array(z.string()),
		cohorts: z.array(z.string()),
		systems: z.array(z.string()),
	}).nullable(),
})
export type IncidentDetail = z.infer<typeof IncidentDetailSchema>

export const IncidentListOutputSchema = z.object({
	rows: z.array(IncidentSchema),
	total: z.number().int().nonnegative(),
})

export const IncidentAddCaseInputSchema = z.object({
	id: z.string(),
	caseRef: z.string(),
})
export const IncidentRemoveCaseInputSchema = z.object({
	id: z.string(),
	caseRef: z.string(),
})

// ============================================================================
// Knowledge base authoring (SUP-FE-14)
// ============================================================================

export const KbArticleStatusSchema = z.enum(["draft", "published", "archived"])
export type KbArticleStatus = z.infer<typeof KbArticleStatusSchema>

export const SupervisorKbArticleSchema = z.object({
	id: z.string(),
	title: z.string(),
	categoryId: z.string().nullable(),
	categoryName: z.string().nullable(),
	tags: z.array(z.string()),
	bodyMarkdown: z.string(),
	status: KbArticleStatusSchema,
	publishedAt: nullableDateOrString,
	createdBy: z.string(),
	createdAt: dateOrString,
	updatedAt: dateOrString,
})
export type SupervisorKbArticle = z.infer<typeof SupervisorKbArticleSchema>

export const KbArticleCreateInputSchema = z.object({
	title: z.string().min(1).max(200),
	categoryId: z.string().optional(),
	tags: z.array(z.string()).default([]),
	bodyMarkdown: z.string().min(1),
})
export const KbArticleUpdateInputSchema = z.object({
	id: z.string(),
	title: z.string().min(1).max(200).optional(),
	categoryId: z.string().nullable().optional(),
	tags: z.array(z.string()).optional(),
	bodyMarkdown: z.string().min(1).optional(),
})
export const KbArticlePublishInputSchema = z.object({ id: z.string() })

export const KbArticleListInputSchema = z.object({
	status: KbArticleStatusSchema.optional(),
	categoryId: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(25),
})
export const KbArticleListOutputSchema = z.object({
	rows: z.array(SupervisorKbArticleSchema),
	total: z.number().int().nonnegative(),
})

export const SupervisorKbCategorySchema = z.object({
	id: z.string(),
	name: z.string(),
	parentId: z.string().nullable(),
	articleCount: z.number().int().nonnegative(),
})
export type SupervisorKbCategory = z.infer<typeof SupervisorKbCategorySchema>

export const KbCategoryUpsertInputSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1).max(100),
	parentId: z.string().nullable().optional(),
})

export const KbMutationOutputSchema = z.object({ id: z.string() })

// ============================================================================
// AI Insights (SUP-FE-11)
// ============================================================================

export const TrendAlertSeveritySchema = z.enum(["info", "warning", "critical"])
export type TrendAlertSeverity = z.infer<typeof TrendAlertSeveritySchema>

export const TrendAlertSchema = z.object({
	alertId: z.string(),
	severity: TrendAlertSeveritySchema,
	title: z.string(),
	alertType: z.string(),
	affectedCaseRefs: z.array(z.string()),
	channelBreakdown: z.record(z.string(), z.number()).nullable(),
	lastUpdated: dateOrString,
	acknowledgedAt: nullableDateOrString,
	acknowledgedBy: z.string().nullable(),
	acknowledgeNote: z.string().nullable(),
})
export type TrendAlert = z.infer<typeof TrendAlertSchema>

export const TrendAlertListOutputSchema = z.object({
	alerts: z.array(TrendAlertSchema),
})

export const TrendAlertAcknowledgeInputSchema = z.object({
	alertId: z.string(),
	note: z.string().max(500),
})
export const TrendAlertAcknowledgeOutputSchema = z.object({
	alertId: z.string(),
	acknowledgedAt: dateOrString,
})

// ============================================================================
// Workload balancing (SUP-FE-13)
// ============================================================================

export const AgentWorkloadSchema = z.object({
	userId: z.string(),
	name: z.string(),
	role: z.string(),
	openCaseCount: z.number().int().nonnegative(),
	saturation: z.number().min(0).max(1),
	isSuggested: z.boolean(),
})
export type AgentWorkload = z.infer<typeof AgentWorkloadSchema>

export const TeamWorkloadInputSchema = z.object({
	teamId: z.string().optional(),
})
export const TeamWorkloadOutputSchema = z.object({
	agents: z.array(AgentWorkloadSchema),
})

// ============================================================================
// FHIR resource viewer (SUP-FE-19)
// ============================================================================

export const FhirResourceTypeSchema = z.enum([
	"Encounter",
	"Condition",
	"ServiceRequest",
])
export type FhirResourceType = z.infer<typeof FhirResourceTypeSchema>

export const FhirResourceQueryInputSchema = z.object({
	patientId: z.string(),
	resourceType: FhirResourceTypeSchema,
})
export const FhirResourceRowSchema = z.object({
	id: z.string(),
	resourceType: FhirResourceTypeSchema,
	display: z.string(),
	date: nullableDateOrString,
	status: z.string().nullable(),
})
export type FhirResourceRow = z.infer<typeof FhirResourceRowSchema>

export const FhirResourceQueryOutputSchema = z.object({
	rows: z.array(FhirResourceRowSchema),
	syncedAt: dateOrString,
})

export const FhirLinkResourceInputSchema = z.object({
	caseRef: z.string(),
	fhirResourceId: z.string(),
	resourceType: FhirResourceTypeSchema,
})
export const FhirLinkResourceOutputSchema = z.object({
	caseRef: z.string(),
	linkedAt: dateOrString,
})
