import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

const nullableDateOrString = z
	.union([z.date(), z.string()])
	.nullable()
	.transform(v => (v ? (typeof v === "string" ? new Date(v) : v) : null))

export const UserRoleSchema = z.enum([
	"patient",
	"case_agent",
	"case_supervisor",
	"tenant_admin",
	"system_admin",
	"clinician",
])

export const StaffUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	emailVerified: z.boolean(),
	role: UserRoleSchema,
	tenantId: z.string().nullable(),
	createdAt: dateOrString,
	updatedAt: dateOrString,
})

export type StaffUser = z.infer<typeof StaffUserSchema>

export const ListUsersInputSchema = z.object({
	role: UserRoleSchema.optional(),
	query: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
})

export const ListUsersOutputSchema = z.object({
	items: z.array(StaffUserSchema),
	total: z.number().int(),
	page: z.number().int(),
	limit: z.number().int(),
})

export const InviteUserInputSchema = z.object({
	email: z.string().email(),
	role: UserRoleSchema,
	tenantId: z.string().optional(),
})

export const InviteUserOutputSchema = z.object({
	userId: z.string(),
	email: z.string(),
})

export const SetRoleInputSchema = z.object({
	userId: z.string(),
	role: UserRoleSchema,
})

export const SetRoleOutputSchema = z.object({
	success: z.boolean(),
})

export const AuditLogSchema = z.object({
	id: z.number(),
	tenantId: z.string(),
	actorUserId: z.string().nullable(),
	actionKey: z.string(),
	targetType: z.string(),
	targetId: z.string(),
	before: z.unknown().nullable(),
	after: z.unknown().nullable(),
	requestId: z.string().nullable(),
	ipAddress: z.string().nullable(),
	userAgent: z.string().nullable(),
	createdAt: dateOrString,
	updatedAt: dateOrString,
})

export type AuditLog = z.infer<typeof AuditLogSchema>

export const ListAuditLogsInputSchema = z.object({
	targetType: z.string().optional(),
	actorUserId: z.string().optional(),
	actionKey: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
})

export const ListAuditLogsOutputSchema = z.object({
	items: z.array(AuditLogSchema),
	total: z.number().int(),
	page: z.number().int(),
	limit: z.number().int(),
})

// ─── Users (extend) ───────────────────────────────────────────────
export const GetUserInputSchema = z.object({ userId: z.string() })

export const UserChangeHistoryItemSchema = z.object({
	id: z.string(),
	field: z.string(),
	oldValue: z.string().nullable(),
	newValue: z.string().nullable(),
	changedBy: z.string(),
	changedAt: z.string(),
	reason: z.string().nullable(),
})

export const UserTenantAssignmentSchema = z.object({
	tenantId: z.string(),
	tenantName: z.string(),
	accessLevel: z.enum(["none", "read_only", "full"]),
	crossFacility: z.boolean(),
})

export const GetUserOutputSchema = StaffUserSchema.extend({
	jobTitle: z.string().nullable(),
	department: z.string().nullable(),
	lastLogin: z.union([z.date(), z.string()]).nullable(),
	status: z.enum(["active", "pending_activation", "inactive"]),
	tenants: z.array(UserTenantAssignmentSchema),
	changeHistory: z.array(UserChangeHistoryItemSchema),
	openCaseCount: z.number().int(),
})

export const DeactivateUserInputSchema = z.object({
	userId: z.string(),
	reason: z.string().min(1),
})

export const ActivateUserInputSchema = z.object({ userId: z.string() })

export const ActiveSessionSchema = z.object({
	sessionId: z.string(),
	userId: z.string(),
	userName: z.string(),
	role: z.string(),
	ip: z.string().nullable(),
	lastActivity: z.string(),
})

export const UserSessionsOutputSchema = z.object({
	sessions: z.array(ActiveSessionSchema),
})

// ─── Roles ────────────────────────────────────────────────────────
export const RoleMatrixRowSchema = z.object({
	role: UserRoleSchema,
	permissions: z.record(z.string(), z.boolean()),
})

export const RoleMatrixOutputSchema = z.object({
	rows: z.array(RoleMatrixRowSchema),
	permKeys: z.array(z.string()),
})

export const PermissionDiffItemSchema = z.object({
	role: UserRoleSchema,
	permKey: z.string(),
	enabled: z.boolean(),
})

export const UpdateRoleMatrixInputSchema = z.object({
	changes: z.array(PermissionDiffItemSchema),
})

export const UpdateRoleMatrixOutputSchema = z.object({ success: z.boolean() })

// ─── Security ─────────────────────────────────────────────────────
export const PasswordPolicySchema = z.object({
	minLength: z.number().int().min(8).max(64).default(12),
	requireUpper: z.boolean().default(true),
	requireLower: z.boolean().default(true),
	requireDigit: z.boolean().default(true),
	requireSymbol: z.boolean().default(true),
	expirationDays: z.number().int().nullable().default(90),
	reuseHistoryCount: z.number().int().min(0).max(24).default(5),
})

export const SessionPolicySchema = z.object({
	idleTimeoutMinutes: z.record(z.string(), z.number().int()),
	warningBannerOffsetMinutes: z.number().int().default(5),
	forceLogoutIdle: z.boolean().default(true),
})

export const MfaPolicySchema = z.object({
	enforcement: z.record(z.string(), z.enum(["required", "optional", "disabled"])),
	allowedMethods: z.array(z.enum(["sms", "totp", "email"])),
})

export const ConcurrencyPolicySchema = z.object({
	maxSessionsPerRole: z.record(z.string(), z.number().int()),
	singleSessionRoles: z.array(z.string()),
})

export const SecurityPolicySchema = z.object({
	passwordPolicy: PasswordPolicySchema,
	sessionPolicy: SessionPolicySchema,
	mfaPolicy: MfaPolicySchema,
	concurrencyPolicy: ConcurrencyPolicySchema,
})

export const UpdateSecurityPolicyInputSchema = SecurityPolicySchema.partial().extend({
	tab: z.enum(["password", "session", "mfa", "concurrency"]),
})

export const TerminateSessionInputSchema = z.object({ sessionId: z.string() })
export const ResetMfaInputSchema = z.object({ userId: z.string() })

// ─── Tenants ──────────────────────────────────────────────────────
export const TenantSchema = z.object({
	id: z.string(),
	shortCode: z.string(),
	name: z.string(),
	status: z.enum(["active", "inactive", "provisioning"]),
	userCount: z.number().int(),
	caseCount: z.number().int(),
})

export const EffectiveAccessRowSchema = z.object({
	userId: z.string(),
	userName: z.string(),
	tenantId: z.string(),
	resourceType: z.string(),
	level: z.enum(["none", "read_only", "full"]),
})

export const TenantUserRowSchema = z.object({
	userId: z.string(),
	userName: z.string(),
	role: z.string(),
	accessLevel: z.enum(["none", "read_only", "full"]),
	crossFacility: z.boolean(),
})

export const TenantDetailSchema = TenantSchema.extend({
	address: z.string().nullable(),
	contactEmail: z.string().nullable(),
	users: z.array(TenantUserRowSchema),
	effectiveAccess: z.array(EffectiveAccessRowSchema),
})

export const ListTenantsOutputSchema = z.object({ tenants: z.array(TenantSchema) })

export const AssignUserTenantInputSchema = z.object({
	userId: z.string(),
	tenantId: z.string(),
	accessLevel: z.enum(["none", "read_only", "full"]),
	crossFacility: z.boolean().default(false),
	justification: z.string().optional(),
})

export const EffectiveAccessMatrixOutputSchema = z.object({
	rows: z.array(EffectiveAccessRowSchema),
})

// ─── Case Types ───────────────────────────────────────────────────
export const CaseTypeSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	defaultPriority: z.enum(["low", "medium", "high", "urgent"]),
	slaHours: z.number().int().positive(),
	defaultTeam: z.string().nullable(),
	requiredFields: z.array(z.string()),
	optionalFields: z.array(z.string()),
	defaultRoutingRuleId: z.string().nullable(),
	status: z.enum(["active", "archived"]),
})

export const CaseTypeInputSchema = CaseTypeSchema.omit({ id: true, status: true })
export const ListCaseTypesOutputSchema = z.object({ items: z.array(CaseTypeSchema) })
export const CaseTypeIdInputSchema = z.object({ id: z.string() })

// ─── Routing Rules ────────────────────────────────────────────────
export const ConditionFieldSchema = z.enum([
	"case_type", "priority", "source_channel", "hmo_type", "keyword",
])

export const RuleConditionSchema = z.object({
	field: ConditionFieldSchema,
	operator: z.enum(["equals", "contains", "not_equals"]),
	value: z.string(),
})

export const RuleActionSchema = z.object({
	type: z.enum(["assign_team", "assign_agent", "set_priority", "add_label"]),
	value: z.string(),
})

export const RoutingRuleSchema = z.object({
	id: z.string(),
	name: z.string(),
	order: z.number().int(),
	conditions: z.array(RuleConditionSchema),
	action: RuleActionSchema,
	active: z.boolean(),
})

export const RoutingRuleInputSchema = RoutingRuleSchema.omit({ id: true, order: true })
export const ListRoutingRulesOutputSchema = z.object({ rules: z.array(RoutingRuleSchema) })
export const ReorderRulesInputSchema = z.object({ orderedIds: z.array(z.string()) })
export const ToggleRuleInputSchema = z.object({ id: z.string() })
export const UpdateRoutingRuleInputSchema = RoutingRuleInputSchema.extend({ id: z.string() })

export const RoutingLogRowSchema = z.object({
	caseId: z.string(),
	matchedRuleId: z.string().nullable(),
	matchedRuleName: z.string().nullable(),
	assignedTeam: z.string().nullable(),
	timestamp: z.string(),
})

export const RoutingLogOutputSchema = z.object({ rows: z.array(RoutingLogRowSchema) })

// ─── AI Triage ────────────────────────────────────────────────────
export const TriageCategorySchema = z.object({
	id: z.string(),
	name: z.string(),
	triggerKeywords: z.array(z.string()),
	negativeKeywords: z.array(z.string()),
	threshold: z.number().min(0).max(1),
	routingRuleId: z.string().nullable(),
	status: z.enum(["active", "inactive"]),
	order: z.number().int(),
})

export const TriageCategoryInputSchema = TriageCategorySchema.omit({ id: true, order: true })
export const UpdateTriageCategoryInputSchema = TriageCategoryInputSchema.extend({ id: z.string() })
export const ListTriageCategoriesOutputSchema = z.object({ categories: z.array(TriageCategorySchema) })
export const ReorderTriageCategoriesInputSchema = z.object({ orderedIds: z.array(z.string()) })

export const SimulateTriageInputSchema = z.object({ message: z.string().min(1) })
export const SimulateTriageOutputSchema = z.object({
	matchedCategoryId: z.string().nullable(),
	matchedCategoryName: z.string().nullable(),
	confidence: z.number(),
	highlightedKeywords: z.array(z.string()),
})

// ─── FHIR Settings ────────────────────────────────────────────────
export const FhirResourcePermSchema = z.object({
	resourceType: z.string(),
	read: z.boolean(),
	write: z.boolean(),
})

export const FhirPermissionsOutputSchema = z.object({
	permissions: z.array(FhirResourcePermSchema),
})

export const UpdateFhirPermissionsInputSchema = z.object({
	permissions: z.array(FhirResourcePermSchema),
})

export const FhirOAuthSchema = z.object({
	authServerUrl: z.string(),
	clientId: z.string(),
	clientSecretMasked: z.string().nullable(),
	allowedScopes: z.array(z.string()),
	tokenExpirySeconds: z.number().int(),
	refreshExpirySeconds: z.number().int(),
})

export const UpdateFhirOAuthInputSchema = FhirOAuthSchema.extend({
	clientSecret: z.string().optional(),
}).omit({ clientSecretMasked: true })

export const FhirConnectionTestOutputSchema = z.object({
	success: z.boolean(),
	responseTimeMs: z.number().nullable(),
	status: z.number().nullable(),
	errorDetail: z.string().nullable(),
})

// ─── Facilities ───────────────────────────────────────────────────
export const FacilityDepartmentSchema = z.object({
	name: z.string(),
	careTeams: z.array(z.string()),
})

export const FacilityIdentitySchema = z.object({
	name: z.string().min(1),
	shortCode: z.string().min(2).max(10),
	address: z.string().nullable(),
	contactEmail: z.string().email().nullable(),
	contactPhone: z.string().nullable(),
})

export const FacilityDefaultSettingsSchema = z.object({
	defaultCaseTypeIds: z.array(z.string()),
	defaultSlaHours: z.number().int().positive(),
	notificationTemplateId: z.string().nullable(),
})

export const FacilityInitialAdminSchema = z.object({
	email: z.string().email(),
	fullName: z.string().min(1),
})

export const FacilityProvisionInputSchema = z.object({
	identity: FacilityIdentitySchema,
	defaultSettings: FacilityDefaultSettingsSchema,
	departments: z.array(FacilityDepartmentSchema),
	initialAdmin: FacilityInitialAdminSchema.optional(),
})

export const FacilityProvisionOutputSchema = z.object({
	tenantId: z.string(),
	activationEmailSent: z.boolean(),
})

// ─── Data Segregation ────────────────────────────────────────────
export const SegregationLevelSchema = z.enum(["isolated", "shared_policy", "fully_shared"])

export const SegregationCellSchema = z.object({
	entityType: z.string(),
	tenantPair: z.string(),
	level: SegregationLevelSchema,
	policyRef: z.string().nullable(),
	justification: z.string().nullable(),
	lastReviewed: z.string().nullable(),
})

export const SegregationMatrixOutputSchema = z.object({
	cells: z.array(SegregationCellSchema),
	lastReviewed: z.string().nullable(),
	summary: z.object({
		isolated: z.number().int(),
		sharedPolicy: z.number().int(),
		fullyShared: z.number().int(),
	}),
})
