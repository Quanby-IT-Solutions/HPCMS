import { oc } from "@orpc/contract"
import { z } from "zod"

import {
	ActivateUserInputSchema,
	AssignUserTenantInputSchema,
	CaseTypeIdInputSchema,
	CaseTypeInputSchema,
	CaseTypeSchema,
	DeactivateUserInputSchema,
	EffectiveAccessMatrixOutputSchema,
	FacilityProvisionInputSchema,
	FacilityProvisionOutputSchema,
	FhirConnectionTestOutputSchema,
	FhirOAuthSchema,
	FhirPermissionsOutputSchema,
	GetUserInputSchema,
	GetUserOutputSchema,
	InviteUserInputSchema,
	InviteUserOutputSchema,
	ListAuditLogsInputSchema,
	ListAuditLogsOutputSchema,
	ListCaseTypesOutputSchema,
	ListRoutingRulesOutputSchema,
	ListTenantsOutputSchema,
	ListTriageCategoriesOutputSchema,
	ListUsersInputSchema,
	ListUsersOutputSchema,
	ReorderRulesInputSchema,
	ReorderTriageCategoriesInputSchema,
	ResetMfaInputSchema,
	RoleMatrixOutputSchema,
	RoutingLogOutputSchema,
	RoutingRuleInputSchema,
	RoutingRuleSchema,
	SecurityPolicySchema,
	SegregationMatrixOutputSchema,
	SetRoleInputSchema,
	SetRoleOutputSchema,
	SimulateTriageInputSchema,
	SimulateTriageOutputSchema,
	TenantDetailSchema,
	TenantSchema,
	TerminateSessionInputSchema,
	ToggleRuleInputSchema,
	TriageCategoryInputSchema,
	TriageCategorySchema,
	UpdateFhirOAuthInputSchema,
	UpdateFhirPermissionsInputSchema,
	UpdateRoleMatrixInputSchema,
	UpdateRoleMatrixOutputSchema,
	UpdateRoutingRuleInputSchema,
	UpdateSecurityPolicyInputSchema,
	UpdateTriageCategoryInputSchema,
	UserSessionsOutputSchema,
} from "./staff-admin.schema.js"

export const staffAdminContract = {
	users: {
		list: oc
			.route({
				method: "GET",
				path: "/staff-admin/users",
				summary: "List users in tenant (tenant/system admin)",
				tags: ["Staff Admin"],
			})
			.input(ListUsersInputSchema)
			.output(ListUsersOutputSchema),

		get: oc
			.route({
				method: "GET",
				path: "/staff-admin/users/{userId}",
				summary: "Get a single user with full profile",
				tags: ["Staff Admin"],
			})
			.input(GetUserInputSchema)
			.output(GetUserOutputSchema),

		invite: oc
			.route({
				method: "POST",
				path: "/staff-admin/users/invite",
				summary: "Invite a new user to the tenant",
				tags: ["Staff Admin"],
			})
			.input(InviteUserInputSchema)
			.output(InviteUserOutputSchema),

		setRole: oc
			.route({
				method: "POST",
				path: "/staff-admin/users/{userId}/role",
				summary: "Change a user's role",
				tags: ["Staff Admin"],
			})
			.input(SetRoleInputSchema)
			.output(SetRoleOutputSchema),

		deactivate: oc
			.route({
				method: "POST",
				path: "/staff-admin/users/{userId}/deactivate",
				summary: "Deactivate a user account",
				tags: ["Staff Admin"],
			})
			.input(DeactivateUserInputSchema)
			.output(z.object({ success: z.boolean() })),

		activate: oc
			.route({
				method: "POST",
				path: "/staff-admin/users/{userId}/activate",
				summary: "Reactivate a user account",
				tags: ["Staff Admin"],
			})
			.input(ActivateUserInputSchema)
			.output(z.object({ success: z.boolean() })),

		sessions: oc
			.route({
				method: "GET",
				path: "/staff-admin/users/{userId}/sessions",
				summary: "List active sessions for a user",
				tags: ["Staff Admin"],
			})
			.input(GetUserInputSchema)
			.output(UserSessionsOutputSchema),
	},

	audit: {
		list: oc
			.route({
				method: "GET",
				path: "/staff-admin/audit",
				summary: "List audit log entries (tenant/system admin)",
				tags: ["Staff Admin"],
			})
			.input(ListAuditLogsInputSchema)
			.output(ListAuditLogsOutputSchema),
	},

	roles: {
		getMatrix: oc
			.route({
				method: "GET",
				path: "/staff-admin/roles/matrix",
				summary: "Get the full permission matrix for all roles",
				tags: ["Staff Admin"],
			})
			.output(RoleMatrixOutputSchema),

		updateMatrix: oc
			.route({
				method: "PUT",
				path: "/staff-admin/roles/matrix",
				summary: "Apply permission changes to the role matrix",
				tags: ["Staff Admin"],
			})
			.input(UpdateRoleMatrixInputSchema)
			.output(UpdateRoleMatrixOutputSchema),
	},

	security: {
		getPolicy: oc
			.route({
				method: "GET",
				path: "/staff-admin/security/policy",
				summary: "Get current security policy settings",
				tags: ["Staff Admin"],
			})
			.output(SecurityPolicySchema),

		updatePolicy: oc
			.route({
				method: "PUT",
				path: "/staff-admin/security/policy",
				summary: "Update a security policy tab",
				tags: ["Staff Admin"],
			})
			.input(UpdateSecurityPolicyInputSchema)
			.output(z.object({ success: z.boolean(), savedAt: z.string() })),

		getSessions: oc
			.route({
				method: "GET",
				path: "/staff-admin/security/sessions",
				summary: "List all active sessions (system admin)",
				tags: ["Staff Admin"],
			})
			.output(z.object({ sessions: z.array(z.object({
				sessionId: z.string(),
				userId: z.string(),
				userName: z.string(),
				role: z.string(),
				ip: z.string().nullable(),
				lastActivity: z.string(),
			})) })),

		terminateSession: oc
			.route({
				method: "DELETE",
				path: "/staff-admin/security/sessions/{sessionId}",
				summary: "Terminate an active session",
				tags: ["Staff Admin"],
			})
			.input(TerminateSessionInputSchema)
			.output(z.object({ success: z.boolean() })),

		resetMfa: oc
			.route({
				method: "POST",
				path: "/staff-admin/security/users/{userId}/reset-mfa",
				summary: "Revoke a user's MFA enrollment",
				tags: ["Staff Admin"],
			})
			.input(ResetMfaInputSchema)
			.output(z.object({ success: z.boolean() })),
	},

	tenants: {
		list: oc
			.route({
				method: "GET",
				path: "/staff-admin/tenants",
				summary: "List all tenants/facilities",
				tags: ["Staff Admin"],
			})
			.output(ListTenantsOutputSchema),

		get: oc
			.route({
				method: "GET",
				path: "/staff-admin/tenants/{tenantId}",
				summary: "Get a tenant with users and effective access",
				tags: ["Staff Admin"],
			})
			.input(z.object({ tenantId: z.string() }))
			.output(TenantDetailSchema),

		assignUser: oc
			.route({
				method: "POST",
				path: "/staff-admin/tenants/{tenantId}/users",
				summary: "Assign a user to a tenant with access level",
				tags: ["Staff Admin"],
			})
			.input(AssignUserTenantInputSchema)
			.output(z.object({ success: z.boolean() })),

		effectiveMatrix: oc
			.route({
				method: "GET",
				path: "/staff-admin/tenants/effective-access",
				summary: "Get the effective access matrix across all tenants",
				tags: ["Staff Admin"],
			})
			.output(EffectiveAccessMatrixOutputSchema),
	},

	caseTypes: {
		list: oc
			.route({
				method: "GET",
				path: "/staff-admin/case-types",
				summary: "List all configured case types",
				tags: ["Staff Admin"],
			})
			.output(ListCaseTypesOutputSchema),

		create: oc
			.route({
				method: "POST",
				path: "/staff-admin/case-types",
				summary: "Create a new case type",
				tags: ["Staff Admin"],
			})
			.input(CaseTypeInputSchema)
			.output(CaseTypeSchema),

		update: oc
			.route({
				method: "PUT",
				path: "/staff-admin/case-types/{id}",
				summary: "Update an existing case type",
				tags: ["Staff Admin"],
			})
			.input(CaseTypeInputSchema.extend({ id: z.string() }))
			.output(CaseTypeSchema),

		archive: oc
			.route({
				method: "POST",
				path: "/staff-admin/case-types/{id}/archive",
				summary: "Archive (soft-deactivate) a case type",
				tags: ["Staff Admin"],
			})
			.input(CaseTypeIdInputSchema)
			.output(z.object({ success: z.boolean() })),

		reactivate: oc
			.route({
				method: "POST",
				path: "/staff-admin/case-types/{id}/reactivate",
				summary: "Reactivate an archived case type",
				tags: ["Staff Admin"],
			})
			.input(CaseTypeIdInputSchema)
			.output(z.object({ success: z.boolean() })),
	},

	routingRules: {
		list: oc
			.route({
				method: "GET",
				path: "/staff-admin/routing-rules",
				summary: "List all routing rules in priority order",
				tags: ["Staff Admin"],
			})
			.output(ListRoutingRulesOutputSchema),

		create: oc
			.route({
				method: "POST",
				path: "/staff-admin/routing-rules",
				summary: "Create a new routing rule",
				tags: ["Staff Admin"],
			})
			.input(RoutingRuleInputSchema)
			.output(RoutingRuleSchema),

		update: oc
			.route({
				method: "PUT",
				path: "/staff-admin/routing-rules/{id}",
				summary: "Update an existing routing rule",
				tags: ["Staff Admin"],
			})
			.input(UpdateRoutingRuleInputSchema)
			.output(RoutingRuleSchema),

		reorder: oc
			.route({
				method: "PUT",
				path: "/staff-admin/routing-rules/order",
				summary: "Reorder routing rules by precedence",
				tags: ["Staff Admin"],
			})
			.input(ReorderRulesInputSchema)
			.output(z.object({ success: z.boolean() })),

		toggle: oc
			.route({
				method: "POST",
				path: "/staff-admin/routing-rules/{id}/toggle",
				summary: "Activate or deactivate a routing rule",
				tags: ["Staff Admin"],
			})
			.input(ToggleRuleInputSchema)
			.output(z.object({ success: z.boolean(), active: z.boolean() })),

		log: oc
			.route({
				method: "GET",
				path: "/staff-admin/routing-rules/log",
				summary: "Recent routing decisions log",
				tags: ["Staff Admin"],
			})
			.output(RoutingLogOutputSchema),
	},

	aiTriage: {
		list: oc
			.route({
				method: "GET",
				path: "/staff-admin/ai-triage/categories",
				summary: "List AI triage categories in priority order",
				tags: ["Staff Admin"],
			})
			.output(ListTriageCategoriesOutputSchema),

		create: oc
			.route({
				method: "POST",
				path: "/staff-admin/ai-triage/categories",
				summary: "Create a new triage category",
				tags: ["Staff Admin"],
			})
			.input(TriageCategoryInputSchema)
			.output(TriageCategorySchema),

		update: oc
			.route({
				method: "PUT",
				path: "/staff-admin/ai-triage/categories/{id}",
				summary: "Update a triage category",
				tags: ["Staff Admin"],
			})
			.input(UpdateTriageCategoryInputSchema)
			.output(TriageCategorySchema),

		reorder: oc
			.route({
				method: "PUT",
				path: "/staff-admin/ai-triage/categories/order",
				summary: "Reorder triage categories by evaluation precedence",
				tags: ["Staff Admin"],
			})
			.input(ReorderTriageCategoriesInputSchema)
			.output(z.object({ success: z.boolean() })),

		simulate: oc
			.route({
				method: "POST",
				path: "/staff-admin/ai-triage/simulate",
				summary: "Test a message against the triage engine",
				tags: ["Staff Admin"],
			})
			.input(SimulateTriageInputSchema)
			.output(SimulateTriageOutputSchema),
	},

	fhirSettings: {
		getPermissions: oc
			.route({
				method: "GET",
				path: "/staff-admin/fhir-settings/permissions",
				summary: "Get FHIR resource read/write permissions",
				tags: ["Staff Admin"],
			})
			.output(FhirPermissionsOutputSchema),

		updatePermissions: oc
			.route({
				method: "PUT",
				path: "/staff-admin/fhir-settings/permissions",
				summary: "Update FHIR resource permissions",
				tags: ["Staff Admin"],
			})
			.input(UpdateFhirPermissionsInputSchema)
			.output(z.object({ success: z.boolean() })),

		getOAuth: oc
			.route({
				method: "GET",
				path: "/staff-admin/fhir-settings/oauth",
				summary: "Get SMART on FHIR OAuth configuration",
				tags: ["Staff Admin"],
			})
			.output(FhirOAuthSchema),

		updateOAuth: oc
			.route({
				method: "PUT",
				path: "/staff-admin/fhir-settings/oauth",
				summary: "Update SMART on FHIR OAuth settings",
				tags: ["Staff Admin"],
			})
			.input(UpdateFhirOAuthInputSchema)
			.output(z.object({ success: z.boolean() })),

		testConnection: oc
			.route({
				method: "POST",
				path: "/staff-admin/fhir-settings/test-connection",
				summary: "Test the FHIR server connection",
				tags: ["Staff Admin"],
			})
			.output(FhirConnectionTestOutputSchema),
	},

	facilities: {
		provision: oc
			.route({
				method: "POST",
				path: "/staff-admin/facilities",
				summary: "Provision a new tenant/facility via wizard",
				tags: ["Staff Admin"],
			})
			.input(FacilityProvisionInputSchema)
			.output(FacilityProvisionOutputSchema),
	},

	dataSegregation: {
		getMatrix: oc
			.route({
				method: "GET",
				path: "/staff-admin/security/data-segregation",
				summary: "Get data segregation policy matrix",
				tags: ["Staff Admin"],
			})
			.output(SegregationMatrixOutputSchema),
	},
}
