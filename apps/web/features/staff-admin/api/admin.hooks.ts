"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { orpc } from "@/services/orpc/client"

function handleMutationError(err: unknown) {
	const status =
		(err as { status?: number; cause?: { status?: number } })?.status ??
		(err as { cause?: { status?: number } })?.cause?.status
	if (status === 401) {
		if (typeof window !== "undefined") window.location.href = "/login"
		return
	}
	if (status === 403) {
		toast.error("Permission denied", { description: "You do not have access to perform this action." })
		if (typeof window !== "undefined") window.location.href = "/dashboard"
		return
	}
	toast.error("Operation failed", { description: (err as Error)?.message ?? "An unexpected error occurred." })
}

// ─── Users ────────────────────────────────────────────────────────

export function useAdminUsersQuery(params?: {
	role?: "patient" | "case_agent" | "case_supervisor" | "tenant_admin" | "system_admin" | "clinician"
	query?: string
	page?: number
	limit?: number
}) {
	return useQuery({
		...orpc.staffAdmin.users.list.queryOptions({
			input: { page: params?.page ?? 1, limit: params?.limit ?? 20, role: params?.role, query: params?.query },
		}),
		initialData: {
			items: [
				{ id: "u1", name: "System Admin", email: "system@hpcms.local", role: "system_admin" as const, emailVerified: true, tenantId: "t1", createdAt: new Date(), updatedAt: new Date() },
				{ id: "u2", name: "Tenant Admin", email: "admin@hpcms.local", role: "tenant_admin" as const, emailVerified: true, tenantId: "t1", createdAt: new Date(), updatedAt: new Date() },
				{ id: "u3", name: "Case Supervisor", email: "supervisor@hpcms.local", role: "case_supervisor" as const, emailVerified: true, tenantId: "t1", createdAt: new Date(), updatedAt: new Date() },
				{ id: "u4", name: "Case Agent", email: "agent@hpcms.local", role: "case_agent" as const, emailVerified: true, tenantId: "t1", createdAt: new Date(), updatedAt: new Date() },
				{ id: "u5", name: "Clinician", email: "clinician@hpcms.local", role: "clinician" as const, emailVerified: true, tenantId: "t1", createdAt: new Date(), updatedAt: new Date() },
				{ id: "u6", name: "Patient User", email: "patient@hpcms.local", role: "patient" as const, emailVerified: true, tenantId: "t1", createdAt: new Date(), updatedAt: new Date() },
			],
			total: 6,
			page: 1,
			limit: 20,
		} as never,
		retry: false,
	})
}

export function useAdminUserQuery(userId: string) {
	return useQuery({
		...orpc.staffAdmin.users.get.queryOptions({ input: { userId } }),
		enabled: !!userId,
		initialData: {
			id: userId,
			name: "Loading...",
			email: "",
			role: "case_agent" as const,
			emailVerified: true,
			tenantId: "t1",
			createdAt: new Date(),
			updatedAt: new Date(),
			jobTitle: null,
			department: null,
			lastLogin: null,
			status: "active" as const,
			tenants: [],
			changeHistory: [],
			openCaseCount: 0,
		} as never,
		retry: false,
	})
}

export function useUserSessionsQuery(userId: string) {
	return useQuery({
		...orpc.staffAdmin.users.sessions.queryOptions({ input: { userId } }),
		enabled: !!userId,
		initialData: { sessions: [] } as never,
		retry: false,
	})
}

export function useInviteUserMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.users.invite.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.users.key() }),
			onError: handleMutationError,
		})
	)
}

export function useSetRoleMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.users.setRole.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.users.key() }),
			onError: handleMutationError,
		})
	)
}

export function useDeactivateUserMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.users.deactivate.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.users.key() }),
			onError: handleMutationError,
		})
	)
}

export function useActivateUserMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.users.activate.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.users.key() }),
			onError: handleMutationError,
		})
	)
}

// Keep existing export aliases for backwards compat
export { useAdminUsersQuery as useUsersQuery, useSetRoleMutation as useSetUserRoleMutation }

// ─── Audit ────────────────────────────────────────────────────────

export function useAuditLogsQuery(params?: {
	targetType?: string
	actorUserId?: string
	actionKey?: string
	dateFrom?: string
	dateTo?: string
	page?: number
	limit?: number
}) {
	return useQuery({
		...orpc.staffAdmin.audit.list.queryOptions({
			input: { page: params?.page ?? 1, limit: params?.limit ?? 20, targetType: params?.targetType, actorUserId: params?.actorUserId, actionKey: params?.actionKey, dateFrom: params?.dateFrom, dateTo: params?.dateTo },
		}),
		initialData: { items: [], total: 0, page: 1, limit: 20 } as never,
		retry: false,
	})
}

// ─── Roles ────────────────────────────────────────────────────────

export function useRoleMatrixQuery() {
	return useQuery({
		...orpc.staffAdmin.roles.getMatrix.queryOptions(),
		initialData: {
			rows: [
				{ role: "system_admin" as const, permissions: { "case.create": true, "case.view": true, "case.update": true, "case.escalate": true, "case.reassign": true, "audit.view": true, "tenant.manage": true, "user.manage": true, "role.manage": true, "settings.manage": true } },
				{ role: "tenant_admin" as const, permissions: { "case.create": true, "case.view": true, "case.update": true, "case.escalate": false, "case.reassign": true, "audit.view": true, "tenant.manage": true, "user.manage": true, "role.manage": false, "settings.manage": true } },
				{ role: "case_supervisor" as const, permissions: { "case.create": true, "case.view": true, "case.update": true, "case.escalate": true, "case.reassign": true, "audit.view": true, "tenant.manage": false, "user.manage": false, "role.manage": false, "settings.manage": false } },
				{ role: "case_agent" as const, permissions: { "case.create": true, "case.view": true, "case.update": true, "case.escalate": false, "case.reassign": false, "audit.view": false, "tenant.manage": false, "user.manage": false, "role.manage": false, "settings.manage": false } },
				{ role: "clinician" as const, permissions: { "case.create": false, "case.view": true, "case.update": false, "case.escalate": false, "case.reassign": false, "audit.view": false, "tenant.manage": false, "user.manage": false, "role.manage": false, "settings.manage": false } },
				{ role: "patient" as const, permissions: { "case.create": true, "case.view": true, "case.update": false, "case.escalate": false, "case.reassign": false, "audit.view": false, "tenant.manage": false, "user.manage": false, "role.manage": false, "settings.manage": false } },
			],
			permKeys: ["case.create", "case.view", "case.update", "case.escalate", "case.reassign", "audit.view", "tenant.manage", "user.manage", "role.manage", "settings.manage"],
		} as never,
		retry: false,
	})
}

export function useUpdateRoleMatrixMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.roles.updateMatrix.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.roles.key() }),
			onError: handleMutationError,
		})
	)
}

// ─── Security ─────────────────────────────────────────────────────

export function useSecurityPolicyQuery() {
	return useQuery({
		...orpc.staffAdmin.security.getPolicy.queryOptions(),
		initialData: {
			passwordPolicy: { minLength: 12, requireUpper: true, requireLower: true, requireDigit: true, requireSymbol: true, expirationDays: 90, reuseHistoryCount: 5 },
			sessionPolicy: { idleTimeoutMinutes: { system_admin: 30, tenant_admin: 60, case_supervisor: 120, case_agent: 120 }, warningBannerOffsetMinutes: 5, forceLogoutIdle: true },
			mfaPolicy: { enforcement: { system_admin: "required" as const, tenant_admin: "required" as const, case_supervisor: "optional" as const, case_agent: "optional" as const }, allowedMethods: ["totp" as const, "email" as const] },
			concurrencyPolicy: { maxSessionsPerRole: { system_admin: 2, tenant_admin: 3, case_supervisor: 5, case_agent: 5 }, singleSessionRoles: [] },
		} as never,
		retry: false,
	})
}

export function useUpdateSecurityPolicyMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.security.updatePolicy.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.security.key() }),
			onError: handleMutationError,
		})
	)
}

export function useActiveSessionsQuery() {
	return useQuery({
		...orpc.staffAdmin.security.getSessions.queryOptions(),
		initialData: { sessions: [] } as never,
		retry: false,
	})
}

export function useTerminateSessionMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.security.terminateSession.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.security.key() }),
			onError: handleMutationError,
		})
	)
}

export function useResetMfaMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.security.resetMfa.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.security.key() }),
			onError: handleMutationError,
		})
	)
}

// ─── Tenants ──────────────────────────────────────────────────────

export function useTenantsQuery() {
	return useQuery({
		...orpc.staffAdmin.tenants.list.queryOptions(),
		initialData: {
			tenants: [
				{ id: "t1", shortCode: "QC", name: "HPCMS Hospital QC", status: "active" as const, userCount: 6, caseCount: 12 },
			],
		} as never,
		retry: false,
	})
}

export function useTenantQuery(tenantId: string) {
	return useQuery({
		...orpc.staffAdmin.tenants.get.queryOptions({ input: { tenantId } }),
		enabled: !!tenantId,
		initialData: {
			id: tenantId,
			shortCode: "QC",
			name: "HPCMS Hospital QC",
			status: "active" as const,
			userCount: 6,
			caseCount: 12,
			address: null,
			contactEmail: null,
			users: [],
			effectiveAccess: [],
		} as never,
		retry: false,
	})
}

export function useEffectiveAccessMatrixQuery() {
	return useQuery({
		...orpc.staffAdmin.tenants.effectiveMatrix.queryOptions(),
		initialData: { rows: [] } as never,
		retry: false,
	})
}

export function useAssignUserTenantMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.tenants.assignUser.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.tenants.key() }),
			onError: handleMutationError,
		})
	)
}

// ─── Case Types ───────────────────────────────────────────────────

export function useCaseTypesQuery() {
	return useQuery({
		...orpc.staffAdmin.caseTypes.list.queryOptions(),
		initialData: {
			items: [
				{
					id: "ct1",
					name: "LOA Request",
					description: "Leave of Absence request processing",
					defaultPriority: "medium" as const,
					slaHours: 48,
					defaultTeam: "LOA Triage",
					requiredFields: ["patientName", "dateOfRequest"],
					optionalFields: ["attendingPhysician"],
					defaultRoutingRuleId: null,
					status: "active" as const,
				},
				{
					id: "ct2",
					name: "Billing Inquiry",
					description: null,
					defaultPriority: "low" as const,
					slaHours: 72,
					defaultTeam: "Billing",
					requiredFields: ["invoiceNumber"],
					optionalFields: [],
					defaultRoutingRuleId: null,
					status: "active" as const,
				},
			],
		} as never,
		retry: false,
	})
}

export function useCreateCaseTypeMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.caseTypes.create.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.caseTypes.key() }),
			onError: handleMutationError,
		})
	)
}

export function useUpdateCaseTypeMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.caseTypes.update.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.caseTypes.key() }),
			onError: handleMutationError,
		})
	)
}

export function useArchiveCaseTypeMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.caseTypes.archive.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.caseTypes.key() }),
			onError: handleMutationError,
		})
	)
}

export function useReactivateCaseTypeMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.caseTypes.reactivate.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.caseTypes.key() }),
			onError: handleMutationError,
		})
	)
}

// ─── Routing Rules ────────────────────────────────────────────────

export function useRoutingRulesQuery() {
	return useQuery({
		...orpc.staffAdmin.routingRules.list.queryOptions(),
		initialData: {
			rules: [
				{ id: "rr1", name: "LOA → LOA Triage Team", order: 1, conditions: [{ field: "caseType" as const, operator: "equals" as const, value: "loa" }], action: { type: "assign_team" as const, value: "LOA Triage" }, active: true },
				{ id: "rr2", name: "Urgent → Supervisor Escalation", order: 2, conditions: [{ field: "priority" as const, operator: "equals" as const, value: "urgent" }], action: { type: "escalate" as const, value: "case_supervisor" }, active: true },
				{ id: "rr3", name: "Billing → Billing Team", order: 3, conditions: [{ field: "caseType" as const, operator: "equals" as const, value: "billing" }], action: { type: "assign_team" as const, value: "Billing" }, active: true },
				{ id: "rr4", name: "Catch-all → General Queue", order: 4, conditions: [], action: { type: "assign_team" as const, value: "General" }, active: false },
			],
		} as never,
		retry: false,
	})
}

export function useCreateRoutingRuleMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.routingRules.create.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.routingRules.key() }),
			onError: handleMutationError,
		})
	)
}

export function useUpdateRoutingRuleMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.routingRules.update.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.routingRules.key() }),
			onError: handleMutationError,
		})
	)
}

export function useReorderRoutingRulesMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.routingRules.reorder.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.routingRules.key() }),
			onError: handleMutationError,
		})
	)
}

export function useToggleRoutingRuleMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.routingRules.toggle.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.routingRules.key() }),
			onError: handleMutationError,
		})
	)
}

export function useRoutingLogQuery() {
	return useQuery({
		...orpc.staffAdmin.routingRules.log.queryOptions(),
		initialData: {
			rows: [
				{ caseId: "LOA-2026-00128", matchedRuleName: "LOA → LOA Triage Team", assignedTeam: "LOA Triage", timestamp: "2026-05-02T08:30:00Z" },
				{ caseId: "LOA-2026-00131", matchedRuleName: "Urgent → Supervisor Escalation", assignedTeam: null, timestamp: "2026-05-02T04:15:00Z" },
				{ caseId: "BIL-2026-00045", matchedRuleName: "Billing → Billing Team", assignedTeam: "Billing", timestamp: "2026-05-01T14:00:00Z" },
				{ caseId: "FUP-2026-00098", matchedRuleName: null, assignedTeam: "General", timestamp: "2026-04-30T10:00:00Z" },
			],
		} as never,
		retry: false,
	})
}

// ─── AI Triage ────────────────────────────────────────────────────

export function useTriageCategoriesQuery() {
	return useQuery({
		...orpc.staffAdmin.aiTriage.list.queryOptions(),
		initialData: {
			categories: [
				{ id: "tc1", name: "LOA Request", triggerKeywords: ["leave", "absence", "LOA"], negativeKeywords: [], threshold: 0.7, routingRuleId: null, status: "active" as const, order: 1 },
				{ id: "tc2", name: "Billing Inquiry", triggerKeywords: ["billing", "invoice", "payment"], negativeKeywords: ["refund"], threshold: 0.6, routingRuleId: null, status: "active" as const, order: 2 },
				{ id: "tc3", name: "Complaint", triggerKeywords: ["complaint", "dissatisfied", "unhappy"], negativeKeywords: [], threshold: 0.65, routingRuleId: null, status: "active" as const, order: 3 },
			],
		} as never,
		retry: false,
	})
}

export function useCreateTriageCategoryMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.aiTriage.create.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.aiTriage.key() }),
			onError: handleMutationError,
		})
	)
}

export function useUpdateTriageCategoryMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.aiTriage.update.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.aiTriage.key() }),
			onError: handleMutationError,
		})
	)
}

export function useReorderTriageCategoriesMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.aiTriage.reorder.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.aiTriage.key() }),
			onError: handleMutationError,
		})
	)
}

export function useSimulateTriageMutation() {
	return useMutation(orpc.staffAdmin.aiTriage.simulate.mutationOptions({ onError: handleMutationError }))
}

// ─── FHIR Settings ────────────────────────────────────────────────

const FHIR_RESOURCE_TYPES = [
	"Patient", "Encounter", "Condition", "Observation", "Procedure",
	"MedicationRequest", "ServiceRequest", "DiagnosticReport", "AllergyIntolerance",
	"Immunization", "DocumentReference", "Practitioner", "Organization", "Location",
	"Coverage", "Claim", "ClaimResponse", "ExplanationOfBenefit", "CarePlan", "CareTeam",
]

export function useFhirPermissionsQuery() {
	return useQuery({
		...orpc.staffAdmin.fhirSettings.getPermissions.queryOptions(),
		initialData: {
			permissions: FHIR_RESOURCE_TYPES.map(rt => ({ resourceType: rt, read: true, write: rt === "Patient" || rt === "Encounter" })),
		} as never,
		retry: false,
	})
}

export function useUpdateFhirPermissionsMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.fhirSettings.updatePermissions.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.fhirSettings.key() }),
			onError: handleMutationError,
		})
	)
}

export function useFhirOAuthQuery() {
	return useQuery({
		...orpc.staffAdmin.fhirSettings.getOAuth.queryOptions(),
		initialData: {
			authServerUrl: "https://fhir.altera.com/oauth2",
			clientId: "hpcms-dev-client",
			clientSecretMasked: "••••••••••••",
			allowedScopes: ["openid", "fhirUser", "launch/patient"],
			tokenExpirySeconds: 3600,
			refreshExpirySeconds: 86400,
		} as never,
		retry: false,
	})
}

export function useUpdateFhirOAuthMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.fhirSettings.updateOAuth.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.fhirSettings.key() }),
			onError: handleMutationError,
		})
	)
}

export function useFhirTestConnectionMutation() {
	return useMutation(orpc.staffAdmin.fhirSettings.testConnection.mutationOptions({ onError: handleMutationError }))
}

// ─── Facilities ───────────────────────────────────────────────────

export function useProvisionFacilityMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.staffAdmin.facilities.provision.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.staffAdmin.tenants.key() }),
			onError: handleMutationError,
		})
	)
}

// ─── Data Segregation ────────────────────────────────────────────

export function useDataSegregationMatrixQuery() {
	return useQuery({
		...orpc.staffAdmin.dataSegregation.getMatrix.queryOptions(),
		initialData: {
			cells: [
				{ entityType: "Patient", tenantPair: "QC ↔ BGC", level: "isolated" as const, policyRef: null, justification: null, lastReviewed: "2026-01-15" },
				{ entityType: "Case", tenantPair: "QC ↔ BGC", level: "shared_policy" as const, policyRef: "POL-2026-01", justification: "Shared care coordination", lastReviewed: "2026-01-15" },
				{ entityType: "Communication", tenantPair: "QC ↔ BGC", level: "isolated" as const, policyRef: null, justification: null, lastReviewed: "2026-01-15" },
				{ entityType: "Claim", tenantPair: "QC ↔ BGC", level: "isolated" as const, policyRef: null, justification: null, lastReviewed: "2026-01-15" },
				{ entityType: "Attachment", tenantPair: "QC ↔ BGC", level: "isolated" as const, policyRef: null, justification: null, lastReviewed: "2026-01-15" },
				{ entityType: "Consent", tenantPair: "QC ↔ BGC", level: "isolated" as const, policyRef: null, justification: null, lastReviewed: "2026-01-15" },
				{ entityType: "Audit Event", tenantPair: "QC ↔ BGC", level: "fully_shared" as const, policyRef: null, justification: "Required for compliance", lastReviewed: "2026-01-15" },
			],
			lastReviewed: "2026-01-15",
			summary: { isolated: 5, sharedPolicy: 1, fullyShared: 1 },
		} as never,
		retry: false,
	})
}
