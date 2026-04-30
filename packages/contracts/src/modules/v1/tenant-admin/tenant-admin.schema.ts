import { z } from "zod"

// Shared
export const PaginationMetaSchema = z.object({ total: z.number(), page: z.number(), limit: z.number() })
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>

// Audit
export const AuditEventSchema = z.object({
	id: z.string(),
	tenantId: z.string(),
	actorUserId: z.string(),
	actorName: z.string(),
	actorRole: z.string().nullable().optional(),
	sessionId: z.string().nullable().optional(),
	actionType: z.string(),
	recordType: z.string(),
	recordId: z.string().nullable(),
	ipAddress: z.string().nullable(),
	userAgent: z.string().nullable(),
	before: z.unknown().nullable(),
	after: z.unknown().nullable(),
	createdAt: z.string(),
})
export type AuditEvent = z.infer<typeof AuditEventSchema>

export const AuditListInputSchema = z.object({
	actorUserId: z.string().optional(),
	actionType: z.string().optional(),
	recordType: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(20),
})
export const AuditListOutputSchema = PaginationMetaSchema.extend({ items: z.array(AuditEventSchema) })
export type AuditListOutput = z.infer<typeof AuditListOutputSchema>

// Login Events
export const LoginOutcomeSchema = z.enum(["success", "failed_credentials", "failed_mfa", "blocked", "suspicious"])
export type LoginOutcome = z.infer<typeof LoginOutcomeSchema>

export const LoginEventSchema = z.object({
	id: z.string(),
	userId: z.string(),
	userName: z.string(),
	role: z.string(),
	outcome: LoginOutcomeSchema,
	ipAddress: z.string().nullable(),
	userAgent: z.string().nullable(),
	sessionId: z.string().nullable().optional(),
	occurredAt: z.string(),
})
export type LoginEvent = z.infer<typeof LoginEventSchema>

export const LoginKpiSchema = z.object({
	totalLogins: z.number(),
	successRate: z.number(),
	failedAttempts: z.number(),
	blockedAttempts: z.number(),
	suspiciousCount: z.number(),
	uniqueIps: z.number(),
	loginsToday: z.number().optional(),
	activeSessions: z.number().optional(),
	mfaChallengesIssued: z.number().optional(),
})
export type LoginKpi = z.infer<typeof LoginKpiSchema>

export const LoginEventListInputSchema = z.object({
	outcome: LoginOutcomeSchema.optional(),
	role: z.string().optional(),
	ipAddress: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(20),
})
export const LoginEventListOutputSchema = PaginationMetaSchema.extend({ items: z.array(LoginEventSchema), kpis: LoginKpiSchema })
export type LoginEventListOutput = z.infer<typeof LoginEventListOutputSchema>

// PHI Access
export const PhiAccessRowSchema = z.object({
	id: z.string(),
	userId: z.string(),
	userName: z.string(),
	role: z.string(),
	patientId: z.string(),
	patientName: z.string(),
	resourceType: z.string(),
	accessType: z.string(),
	accessContext: z.string().optional(),
	facility: z.string().optional(),
	ipAddress: z.string().nullable(),
	accessedAt: z.string(),
	isAnomaly: z.boolean(),
	anomalyReason: z.string().nullable(),
})
export type PhiAccessRow = z.infer<typeof PhiAccessRowSchema>

export const PhiAccessReportInputSchema = z.object({
	dateFrom: z.string(),
	dateTo: z.string(),
	userId: z.string().optional(),
	role: z.string().optional(),
	patientId: z.string().optional(),
	anomalyOnly: z.boolean().optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(20),
})
export const PhiAccessReportOutputSchema = PaginationMetaSchema.extend({ items: z.array(PhiAccessRowSchema), anomalyCount: z.number() })
export type PhiAccessReportOutput = z.infer<typeof PhiAccessReportOutputSchema>

// DPA Compliance
export const DpaComplianceStatusSchema = z.enum(["compliant", "partial", "non_compliant", "not_assessed"])
export type DpaComplianceStatus = z.infer<typeof DpaComplianceStatusSchema>

export const DpaKpiSchema = z.object({
	consentCoverage: z.number(),
	retentionComplianceRate: z.number(),
	dataSubjectRequestsOpen: z.number(),
	dataSubjectRequestsOverdue: z.number(),
	lastAuditDate: z.string().nullable(),
	nextReviewDate: z.string().nullable(),
	phiAccessEventCount: z.number().optional(),
	auditCompletenessRate: z.number().optional(),
})
export type DpaKpi = z.infer<typeof DpaKpiSchema>

export const DpaComplianceItemSchema = z.object({
	category: z.string(),
	status: DpaComplianceStatusSchema,
	score: z.number(),
	notes: z.string().nullable(),
	lastChecked: z.string().nullable(),
})
export type DpaComplianceItem = z.infer<typeof DpaComplianceItemSchema>

export const DpaDashboardOutputSchema = z.object({ kpis: DpaKpiSchema, complianceItems: z.array(DpaComplianceItemSchema) })
export type DpaDashboardOutput = z.infer<typeof DpaDashboardOutputSchema>

export const DpaReportInputSchema = z.object({ period: z.string() })
export const DpaPhiAccessSummarySchema = z.object({
	totalEvents: z.number(),
	anomalyCount: z.number(),
	topAccessors: z.array(z.string()),
})
export type DpaPhiAccessSummary = z.infer<typeof DpaPhiAccessSummarySchema>

export const DpaPatientWithoutConsentSchema = z.object({
	patientId: z.string(),
	patientName: z.string(),
	missingCategories: z.array(z.string()),
})
export type DpaPatientWithoutConsent = z.infer<typeof DpaPatientWithoutConsentSchema>

export const DpaReportOutputSchema = z.object({
	period: z.string(),
	generatedAt: z.string(),
	tenantName: z.string(),
	kpis: DpaKpiSchema,
	complianceItems: z.array(DpaComplianceItemSchema),
	findings: z.array(z.object({ area: z.string(), finding: z.string(), severity: z.string(), recommendedAction: z.string() })),
	phiAccessSummary: DpaPhiAccessSummarySchema.optional(),
	patientsWithoutConsent: z.array(DpaPatientWithoutConsentSchema).optional(),
})
export type DpaReportOutput = z.infer<typeof DpaReportOutputSchema>

// JCI Handoffs
export const HandoffEventSchema = z.object({
	id: z.string(),
	caseRef: z.string(),
	patientId: z.string(),
	patientName: z.string(),
	fromAgentName: z.string(),
	toAgentName: z.string(),
	handoffType: z.string(),
	completedAt: z.string(),
	verbalConfirmed: z.boolean(),
	isCompliant: z.boolean(),
	complianceGap: z.string().nullable(),
})
export type HandoffEvent = z.infer<typeof HandoffEventSchema>

export const HandoffListInputSchema = z.object({
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	handoffType: z.string().optional(),
	isCompliant: z.boolean().optional(),
	agentId: z.string().optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(20),
})
export const HandoffListOutputSchema = PaginationMetaSchema.extend({ items: z.array(HandoffEventSchema), complianceRate: z.number() })
export type HandoffListOutput = z.infer<typeof HandoffListOutputSchema>

// Incidents (Phase 3)
export const TaIncidentSeveritySchema = z.enum(["low", "medium", "high", "critical"])
export type TaIncidentSeverity = z.infer<typeof TaIncidentSeveritySchema>

export const TaIncidentRowSchema = z.object({
	incidentId: z.string(),
	title: z.string(),
	severity: TaIncidentSeveritySchema,
	status: z.string(),
	department: z.string().nullable(),
	createdBy: z.string(),
	createdAt: z.string(),
	caseCount: z.number(),
})
export type TaIncidentRow = z.infer<typeof TaIncidentRowSchema>

export const TaIncidentKpiSchema = z.object({
	openCount: z.number(),
	criticalCount: z.number(),
	avgResolutionHours: z.number(),
	resolvedThisMonth: z.number(),
})

export const TaIncidentListInputSchema = z.object({
	severity: TaIncidentSeveritySchema.optional(),
	status: z.string().optional(),
	department: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(20),
})
export const TaIncidentListOutputSchema = PaginationMetaSchema.extend({
	items: z.array(TaIncidentRowSchema),
	kpis: TaIncidentKpiSchema,
	severityBreakdown: z.record(z.string(), z.number()),
})
export type TaIncidentListOutput = z.infer<typeof TaIncidentListOutputSchema>

// Facility Config
export const SlaThresholdSchema = z.object({
	priority: z.string(),
	responseHours: z.number(),
	resolutionHours: z.number(),
	escalationHours: z.number(),
})
export const SlaSettingsSchema = z.object({
	thresholds: z.array(SlaThresholdSchema),
	businessHoursOnly: z.boolean(),
	holidayCalendarId: z.string().nullable(),
})
export type SlaSettings = z.infer<typeof SlaSettingsSchema>

export const NotificationTemplateSchema = z.object({
	id: z.string(),
	name: z.string(),
	channel: z.string(),
	eventType: z.string(),
	subjectTemplate: z.string(),
	bodyTemplate: z.string(),
	isActive: z.boolean(),
	updatedAt: z.string(),
})
export type NotificationTemplate = z.infer<typeof NotificationTemplateSchema>

export const DepartmentSchema = z.object({
	id: z.string(),
	name: z.string(),
	careTeams: z.array(z.string()),
	headUserId: z.string().nullable(),
	isActive: z.boolean(),
})
export type Department = z.infer<typeof DepartmentSchema>

export const RoutingDefaultSchema = z.object({
	caseType: z.string(),
	defaultTeamId: z.string().nullable(),
	defaultDepartmentId: z.string().nullable(),
	defaultPriority: z.string(),
})

export const FacilityConfigOutputSchema = z.object({
	sla: SlaSettingsSchema,
	departments: z.array(DepartmentSchema),
	notificationTemplates: z.array(NotificationTemplateSchema),
	routingDefaults: z.array(RoutingDefaultSchema),
})
export type FacilityConfigOutput = z.infer<typeof FacilityConfigOutputSchema>

export const UpdateSlaInputSchema = SlaSettingsSchema
export const UpdateTemplateInputSchema = z.object({
	id: z.string(),
	subjectTemplate: z.string().optional(),
	bodyTemplate: z.string().optional(),
	isActive: z.boolean().optional(),
})
export const UpsertDepartmentInputSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	careTeams: z.array(z.string()),
	headUserId: z.string().nullable().optional(),
	isActive: z.boolean(),
})

// Shared Policies
export const SharedPolicyStatusSchema = z.enum(["active", "inactive", "draft"])
export type SharedPolicyStatus = z.infer<typeof SharedPolicyStatusSchema>

export const SharedPolicySchema = z.object({
	id: z.string(),
	name: z.string(),
	serviceType: z.string(),
	coveredTenantIds: z.array(z.string()),
	slaHours: z.number(),
	status: SharedPolicyStatusSchema,
	effectiveDate: z.string().nullable(),
	expiryDate: z.string().nullable(),
	notes: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
})
export type SharedPolicy = z.infer<typeof SharedPolicySchema>

export const SharedPoliciesListInputSchema = z.object({
	status: SharedPolicyStatusSchema.optional(),
	serviceType: z.string().optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(20),
})
export const SharedPoliciesListOutputSchema = PaginationMetaSchema.extend({ items: z.array(SharedPolicySchema) })
export const SharedPolicyCreateInputSchema = SharedPolicySchema.omit({ id: true, createdAt: true, updatedAt: true })
export const SharedPolicyUpdateInputSchema = SharedPolicySchema.partial().required({ id: true })
export const SharedPolicyDeleteInputSchema = z.object({ id: z.string() })

// Cross-Facility Reports (Phase 3)
export const CrossFacilityMetricSchema = z.enum(["case_volume", "resolution_time", "sla_compliance", "escalation_rate", "phi_access_count", "incident_count"])
export type CrossFacilityMetric = z.infer<typeof CrossFacilityMetricSchema>

export const CrossFacilityReportInputSchema = z.object({
	tenantIds: z.array(z.string()),
	metrics: z.array(CrossFacilityMetricSchema),
	dateFrom: z.string(),
	dateTo: z.string(),
	groupBy: z.string(),
})
export const CrossFacilityReportOutputSchema = z.object({
	generatedAt: z.string(),
	params: CrossFacilityReportInputSchema,
	dataPoints: z.array(z.record(z.string(), z.unknown())),
	summaryByTenant: z.record(z.string(), z.record(z.string(), z.number())),
})
export type CrossFacilityReportOutput = z.infer<typeof CrossFacilityReportOutputSchema>

// Boundary Violations
export const BoundaryViolationSeveritySchema = z.enum(["low", "medium", "high", "critical"])
export type BoundaryViolationSeverity = z.infer<typeof BoundaryViolationSeveritySchema>

export const BoundaryViolationOutcomeSchema = z.enum(["blocked", "allowed_with_flag"])
export type BoundaryViolationOutcome = z.infer<typeof BoundaryViolationOutcomeSchema>

export const BoundaryViolationSchema = z.object({
	id: z.string(),
	violationType: z.string(),
	severity: BoundaryViolationSeveritySchema,
	outcome: BoundaryViolationOutcomeSchema.optional(),
	actorName: z.string(),
	actorRole: z.string().optional(),
	sourceTenantId: z.string().optional(),
	targetTenantId: z.string(),
	targetResourceType: z.string(),
	ruleViolated: z.string(),
	ipAddress: z.string().nullable(),
	detectedAt: z.string(),
	isResolved: z.boolean(),
	resolutionNote: z.string().nullable(),
})
export type BoundaryViolation = z.infer<typeof BoundaryViolationSchema>

export const BoundaryViolationKpiSchema = z.object({
	openCritical: z.number(),
	openWarning: z.number(),
	resolvedThisWeek: z.number(),
	totalUnresolved: z.number(),
})
export type BoundaryViolationKpi = z.infer<typeof BoundaryViolationKpiSchema>

export const BoundaryViolationListInputSchema = z.object({
	severity: BoundaryViolationSeveritySchema.optional(),
	outcome: BoundaryViolationOutcomeSchema.optional(),
	actorUserId: z.string().optional(),
	isResolved: z.boolean().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(20),
})
export const BoundaryViolationListOutputSchema = PaginationMetaSchema.extend({ items: z.array(BoundaryViolationSchema), kpis: BoundaryViolationKpiSchema })
export type BoundaryViolationListOutput = z.infer<typeof BoundaryViolationListOutputSchema>

export const BoundaryViolationResolveInputSchema = z.object({ id: z.string(), note: z.string() })

// Patient Audit & Consent History (TA-FE-13)
export const PatientAuditRowSchema = z.object({
	id: z.string(),
	actorName: z.string(),
	actorRole: z.string(),
	actionType: z.string(),
	fieldChanged: z.string().nullable(),
	before: z.unknown().nullable(),
	after: z.unknown().nullable(),
	ipAddress: z.string().nullable(),
	occurredAt: z.string(),
})
export type PatientAuditRow = z.infer<typeof PatientAuditRowSchema>

export const PatientAuditListInputSchema = z.object({
	patientId: z.string(),
	actionType: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(20),
})
export const PatientAuditListOutputSchema = PaginationMetaSchema.extend({ items: z.array(PatientAuditRowSchema) })
export type PatientAuditListOutput = z.infer<typeof PatientAuditListOutputSchema>

export const TaConsentHistoryRowSchema = z.object({
	id: z.string(),
	category: z.string(),
	status: z.string(),
	captureMethod: z.string(),
	recordedBy: z.string(),
	recordedByRole: z.string(),
	documentKey: z.string().nullable(),
	recordedAt: z.string(),
})
export type TaConsentHistoryRow = z.infer<typeof TaConsentHistoryRowSchema>

export const ConsentHistoryListInputSchema = z.object({
	patientId: z.string(),
	category: z.string().optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(20),
})
export const ConsentHistoryListOutputSchema = PaginationMetaSchema.extend({ items: z.array(TaConsentHistoryRowSchema) })
export type ConsentHistoryListOutput = z.infer<typeof ConsentHistoryListOutputSchema>
