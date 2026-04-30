/**
 * Central contract registry
 * Re-exports version routers
 */

// V1 contracts (routers)
export { v1Contract } from "./modules/v1/v1.contract.js"
export type { V1Contract } from "./modules/v1/v1.contract.js"

// Schema types (cases)
export type {
	Case,
	CaseDetail,
	CaseStatus,
	CasePriority,
	CaseVisibility,
	CaseEvent,
	CaseAttachment,
} from "./modules/v1/cases/cases.schema.js"

export { CaseListInputSchema } from "./modules/v1/cases/cases.schema.js"

// Schema types (patients)
export type { Patient, VerifyMrnInput, VerifyMrnOutput } from "./modules/v1/patients/patients.schema.js"

// Schema types (staff-admin)
export type {
	StaffUser,
	AuditLog,
} from "./modules/v1/staff-admin/staff-admin.schema.js"

export {
	ListUsersInputSchema,
	ListAuditLogsInputSchema,
	UserRoleSchema,
} from "./modules/v1/staff-admin/staff-admin.schema.js"

// Schema types (notifications)
export type { Notification } from "./modules/v1/notifications/notifications.schema.js"

// Schema types (clinician)
export type {
	LaunchValidateInput,
	LaunchValidateOutput,
	ClinicianCaseSummary,
	ClinicianCaseSummaryItem,
	PatientHeader,
	AddNoteInput,
	FlagCaseInput,
	FlagType,
	AllergyRow,
	MedicationRow,
	ImmunizationRow,
	ObservationRow,
	CarePlanRow,
	DiagnosticRow,
} from "./modules/v1/clinician/clinician.schema.js"

export {
	FlagTypeSchema,
	ClinicianCaseSummaryStatusSchema,
} from "./modules/v1/clinician/clinician.schema.js"

// Schema types (cases — queue + resolve extensions)
export type {
	QueueRow,
	RiskLevel,
	ResolveCategory,
} from "./modules/v1/cases/cases.schema.js"

export {
	RiskLevelSchema,
	ResolveCategorySchema,
} from "./modules/v1/cases/cases.schema.js"

// Schema types (patients — recent + timeline extensions)
export type {
	TimelineEntry,
} from "./modules/v1/patients/patients.schema.js"

// Schema types (inbox)
export type {
	Channel,
	InboxStatus,
	InboxItem,
	EmailMessage,
	InboxSearchResultRow,
} from "./modules/v1/inbox/inbox.schema.js"

export {
	ChannelSchema,
	InboxStatusSchema,
} from "./modules/v1/inbox/inbox.schema.js"

// Schema types (channels)
export {
	PhoneCallDirectionSchema,
	PhoneReasonCategorySchema,
	SocialPlatformSchema,
	SocialIssueCategorySchema,
} from "./modules/v1/channels/channels.schema.js"

// Schema types (outbound)
export { OutboundChannelSchema } from "./modules/v1/outbound/outbound.schema.js"

// Schema types (playbooks)
export type {
	Playbook,
	PlaybookStep,
	CasePlaybook,
} from "./modules/v1/playbooks/playbooks.schema.js"

// Schema types (claims)
export type {
	ClaimHeader,
	ClaimLine,
	ClaimStatus,
	ClaimType,
	Payer,
	DrgRow,
} from "./modules/v1/claims/claims.schema.js"

export {
	ClaimStatusSchema,
	ClaimTypeSchema,
} from "./modules/v1/claims/claims.schema.js"

// Schema types (codes)
export type { CodeRow } from "./modules/v1/codes/codes.schema.js"
export { CodeSystemSchema } from "./modules/v1/codes/codes.schema.js"

// Schema types (programs / devices)
export type { ProgramEnrollment } from "./modules/v1/programs/programs.schema.js"
export type { AssignedDevice } from "./modules/v1/devices/devices.schema.js"

// Schema types (knowledge base)
export type {
	KbArticle,
	KbArticleSummary,
	KbCategory,
} from "./modules/v1/kb/kb.schema.js"

// Schema types (chatbot)
export type { ChatbotMessage } from "./modules/v1/chatbot/chatbot.schema.js"
export { ChatbotIntentSchema } from "./modules/v1/chatbot/chatbot.schema.js"

// Schema types (portal chat)
export type {
	PortalChatThread,
	PortalChatMessage,
} from "./modules/v1/portalChat/portal-chat.schema.js"

// Schema types (supervisor)
export type {
	DuplicateCandidate,
	SupervisorPatientRegisterInput,
	ConsentCategory,
	ConsentStatus,
	ConsentHistoryItem,
	ConsentListOutput,
	EscalationLevel,
	EscalationHistoryItem,
	RelationshipType,
	RelatedCaseLink,
	EnrollmentStatus,
	EnrollmentDetail,
	DeviceStatus,
	DeviceDetail,
	IncidentSeverity,
	IncidentStatus,
	Incident,
	IncidentDetail,
	KbArticleStatus,
	SupervisorKbArticle,
	SupervisorKbCategory,
	TrendAlertSeverity,
	TrendAlert,
	AgentWorkload,
	FhirResourceType,
	FhirResourceRow,
	CrossFacilityContextOutput,
} from "./modules/v1/supervisor/supervisor.schema.js"

export {
	ConsentCategorySchema,
	ConsentStatusSchema,
	EscalationLevelSchema,
	RelationshipTypeSchema,
	EnrollmentStatusSchema,
	DeviceStatusSchema,
	IncidentSeveritySchema,
	IncidentStatusSchema,
	KbArticleStatusSchema,
	TrendAlertSeveritySchema,
	FhirResourceTypeSchema,
} from "./modules/v1/supervisor/supervisor.schema.js"

// Schema types (tenant-admin)
export type {
	PaginationMeta,
	AuditEvent,
	AuditListOutput,
	LoginOutcome,
	LoginEvent,
	LoginKpi,
	LoginEventListOutput,
	PhiAccessRow,
	PhiAccessReportOutput,
	DpaComplianceStatus,
	DpaKpi,
	DpaComplianceItem,
	DpaDashboardOutput,
	DpaReportOutput,
	DpaPhiAccessSummary,
	DpaPatientWithoutConsent,
	HandoffEvent,
	HandoffListOutput,
	TaIncidentSeverity,
	TaIncidentRow,
	TaIncidentListOutput,
	SlaSettings,
	NotificationTemplate,
	Department,
	FacilityConfigOutput,
	SharedPolicyStatus,
	SharedPolicy,
	CrossFacilityMetric,
	CrossFacilityReportOutput,
	BoundaryViolationSeverity,
	BoundaryViolation,
	BoundaryViolationKpi,
	BoundaryViolationListOutput,
	PatientAuditRow,
	PatientAuditListOutput,
	TaConsentHistoryRow,
	ConsentHistoryListOutput,
} from "./modules/v1/tenant-admin/tenant-admin.schema.js"

export {
	LoginOutcomeSchema,
	DpaComplianceStatusSchema,
	TaIncidentSeveritySchema,
	SharedPolicyStatusSchema,
	CrossFacilityMetricSchema,
	BoundaryViolationSeveritySchema,
} from "./modules/v1/tenant-admin/tenant-admin.schema.js"

// Future versions:
// export { v2Contract, type V2Contract } from "./modules/v2/v2.contract.js"
// export const v2 = { ... }
// export type { Todo as V2Todo, ... } from "./modules/v2/..."
