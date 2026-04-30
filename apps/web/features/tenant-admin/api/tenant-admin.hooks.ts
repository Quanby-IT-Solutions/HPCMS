"use client"

import { useMemo } from "react"
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

// ─── Audit ────────────────────────────────────────────────────────

export function useAuditListQuery(params?: {
	actorUserId?: string
	actionType?: string
	recordType?: string
	dateFrom?: string
	dateTo?: string
	page?: number
	limit?: number
}) {
	return useQuery({
		...orpc.tenantAdmin.audit.list.queryOptions({
			input: {
				page: params?.page ?? 1,
				limit: params?.limit ?? 20,
				actorUserId: params?.actorUserId,
				actionType: params?.actionType,
				recordType: params?.recordType,
				dateFrom: params?.dateFrom,
				dateTo: params?.dateTo,
			},
		}),
		placeholderData: {
			total: 2,
			page: 1,
			limit: 20,
			items: [
				{ id: "ae1", tenantId: "t1", actorUserId: "u1", actorName: "System Admin", actionType: "user.login", recordType: "User", recordId: "u1", ipAddress: "192.168.1.1", userAgent: null, before: null, after: null, createdAt: new Date().toISOString(), actorRole: "tenant_admin", sessionId: "sess-001" },
				{ id: "ae2", tenantId: "t1", actorUserId: "u2", actorName: "Tenant Admin", actionType: "case.update", recordType: "Case", recordId: "c1", ipAddress: "192.168.1.2", userAgent: null, before: { status: "open" }, after: { status: "resolved" }, createdAt: new Date().toISOString(), actorRole: "tenant_admin", sessionId: "sess-001" },
			],
		},
	})
}

export function useLoginEventsQuery(params?: {
	outcome?: "success" | "failed_credentials" | "failed_mfa" | "blocked" | "suspicious"
	role?: string
	ipAddress?: string
	dateFrom?: string
	dateTo?: string
	page?: number
	limit?: number
}) {
	return useQuery({
		...orpc.tenantAdmin.audit.loginEvents.queryOptions({
			input: {
				page: params?.page ?? 1,
				limit: params?.limit ?? 20,
				outcome: params?.outcome,
				role: params?.role,
				ipAddress: params?.ipAddress,
				dateFrom: params?.dateFrom,
				dateTo: params?.dateTo,
			},
		}),
		placeholderData: {
			total: 3,
			page: 1,
			limit: 20,
			items: [
				{ id: "le1", userId: "u1", userName: "System Admin", role: "system_admin", outcome: "success" as const, ipAddress: "192.168.1.1", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124", sessionId: "sess-aaa1", occurredAt: new Date().toISOString() },
				{ id: "le2", userId: "u3", userName: "Unknown", role: "case_agent", outcome: "failed_credentials" as const, ipAddress: "10.0.0.5", userAgent: "Mozilla/5.0 (X11; Linux x86_64) Firefox/125", sessionId: null, occurredAt: new Date().toISOString() },
				{ id: "le3", userId: "u4", userName: "Tenant Admin", role: "tenant_admin", outcome: "suspicious" as const, ipAddress: "203.0.113.5", userAgent: "curl/8.1.2", sessionId: "sess-bbb9", occurredAt: new Date().toISOString() },
			],
			kpis: { totalLogins: 128, successRate: 0.92, failedAttempts: 10, blockedAttempts: 2, suspiciousCount: 1, uniqueIps: 14, loginsToday: 47, activeSessions: 12, mfaChallengesIssued: 8 },
		},
	})
}

// ─── PHI Access ───────────────────────────────────────────────────

export function usePhiAccessReportQuery(params?: {
	dateFrom?: string
	dateTo?: string
	userId?: string
	role?: string
	patientId?: string
	anomalyOnly?: boolean
	page?: number
	limit?: number
}) {
	const defaultDateFrom = useMemo(() => new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10), []) // eslint-disable-line react-hooks/purity
	const defaultDateTo = useMemo(() => new Date().toISOString().slice(0, 10), [])
	return useQuery({
		...orpc.tenantAdmin.phiAccess.report.queryOptions({
			input: {
				dateFrom: params?.dateFrom ?? defaultDateFrom,
				dateTo: params?.dateTo ?? defaultDateTo,
				userId: params?.userId,
				role: params?.role,
				patientId: params?.patientId,
				anomalyOnly: params?.anomalyOnly,
				page: params?.page ?? 1,
				limit: params?.limit ?? 20,
			},
		}),
		placeholderData: {
			total: 2,
			page: 1,
			limit: 20,
			anomalyCount: 1,
			items: [
				{ id: "phi1", userId: "u1", userName: "Case Agent", role: "case_agent", patientId: "p1", patientName: "John Doe", resourceType: "Patient", accessType: "read", accessContext: "profile view", facility: "HPCMS QC", ipAddress: "192.168.1.1", accessedAt: new Date().toISOString(), isAnomaly: false, anomalyReason: null },
				{ id: "phi2", userId: "u2", userName: "Clinician", role: "clinician", patientId: "p2", patientName: "Jane Smith", resourceType: "Observation", accessType: "read", accessContext: "case view", facility: "HPCMS Manila", ipAddress: "10.0.0.50", accessedAt: new Date().toISOString(), isAnomaly: true, anomalyReason: "Off-hours access pattern" },
			],
		},
	})
}

// ─── DPA ──────────────────────────────────────────────────────────

export function useDpaDashboardQuery() {
	return useQuery({
		...orpc.tenantAdmin.dpa.dashboard.queryOptions(),
		placeholderData: {
			kpis: { consentCoverage: 0.94, retentionComplianceRate: 0.87, dataSubjectRequestsOpen: 3, dataSubjectRequestsOverdue: 1, lastAuditDate: "2026-03-01", nextReviewDate: "2026-06-01", phiAccessEventCount: 247, auditCompletenessRate: 0.93 },
			complianceItems: [
				{ category: "Consent Management", status: "compliant" as const, score: 95, notes: null, lastChecked: "2026-03-01" },
				{ category: "Data Retention", status: "partial" as const, score: 72, notes: "3 records past retention schedule", lastChecked: "2026-02-15" },
				{ category: "Right to Access", status: "compliant" as const, score: 100, notes: null, lastChecked: "2026-03-01" },
				{ category: "Breach Notification", status: "not_assessed" as const, score: 0, notes: null, lastChecked: null },
			],
		},
	})
}

export function useDpaReportQuery(params?: { period?: string }) {
	return useQuery({
		...orpc.tenantAdmin.dpa.report.queryOptions({ input: { period: params?.period ?? "2026-Q1" } }),
		placeholderData: {
			period: params?.period ?? "2026-Q1",
			generatedAt: new Date().toISOString(),
			tenantName: "HPCMS Hospital QC",
			kpis: { consentCoverage: 0.94, retentionComplianceRate: 0.87, dataSubjectRequestsOpen: 3, dataSubjectRequestsOverdue: 1, lastAuditDate: "2026-03-01", nextReviewDate: "2026-06-01", phiAccessEventCount: 247, auditCompletenessRate: 0.93 },
			complianceItems: [
					{ category: "Consent Management", status: "compliant" as const, score: 95, notes: null, lastChecked: "2026-03-01" },
					{ category: "Data Retention", status: "partial" as const, score: 72, notes: "3 records past retention schedule", lastChecked: "2026-02-15" },
					{ category: "Right to Access", status: "compliant" as const, score: 100, notes: null, lastChecked: "2026-03-01" },
					{ category: "Breach Notification", status: "not_assessed" as const, score: 0, notes: null, lastChecked: null },
				],
			findings: [
				{ area: "Data Retention", finding: "3 patient records past scheduled deletion date", severity: "medium", recommendedAction: "Run retention sweep before next review" },
			],
			phiAccessSummary: { totalEvents: 247, anomalyCount: 3, topAccessors: ["Case Agent Alice Chen", "Clinician Bob Lee", "Case Agent Carol Wu"] },
			patientsWithoutConsent: [
				{ patientId: "p-003", patientName: "Roberto Santos", missingCategories: ["data_sharing", "research"] },
				{ patientId: "p-017", patientName: "Maria Dela Cruz", missingCategories: ["marketing"] },
			],
		},
	})
}

// ─── Handoffs ─────────────────────────────────────────────────────

export function useHandoffsListQuery(params?: {
	dateFrom?: string
	dateTo?: string
	handoffType?: string
	isCompliant?: boolean
	agentId?: string
	page?: number
	limit?: number
}) {
	return useQuery({
		...orpc.tenantAdmin.handoffs.list.queryOptions({
			input: {
				page: params?.page ?? 1,
				limit: params?.limit ?? 20,
				dateFrom: params?.dateFrom,
				dateTo: params?.dateTo,
				handoffType: params?.handoffType,
				isCompliant: params?.isCompliant,
				agentId: params?.agentId,
			},
		}),
		placeholderData: {
			total: 2,
			page: 1,
			limit: 20,
			complianceRate: 0.91,
			items: [
				{ id: "h1", caseRef: "CASE-001", patientId: "p1", patientName: "John Doe", fromAgentName: "Alice Chen", toAgentName: "Bob Lee", handoffType: "shift_change", completedAt: new Date().toISOString(), verbalConfirmed: true, isCompliant: true, complianceGap: null },
				{ id: "h2", caseRef: "CASE-002", patientId: "p2", patientName: "Jane Smith", fromAgentName: "Carol Wu", toAgentName: "Dan Park", handoffType: "escalation", completedAt: new Date().toISOString(), verbalConfirmed: false, isCompliant: false, complianceGap: "Verbal confirmation not recorded" },
			],
		},
	})
}

// ─── Incidents ────────────────────────────────────────────────────

export function useTaIncidentsListQuery(params?: {
	severity?: "low" | "medium" | "high" | "critical"
	status?: string
	department?: string
	dateFrom?: string
	dateTo?: string
	page?: number
	limit?: number
}) {
	return useQuery({
		...orpc.tenantAdmin.incidents.list.queryOptions({
			input: {
				page: params?.page ?? 1,
				limit: params?.limit ?? 20,
				severity: params?.severity,
				status: params?.status,
				department: params?.department,
				dateFrom: params?.dateFrom,
				dateTo: params?.dateTo,
			},
		}),
		placeholderData: {
			total: 1,
			page: 1,
			limit: 20,
			kpis: { openCount: 2, criticalCount: 1, avgResolutionHours: 4.5, resolvedThisMonth: 8 },
			severityBreakdown: { low: 1, medium: 2, high: 1, critical: 1 },
			items: [
				{ incidentId: "inc1", title: "System access anomaly detected", severity: "critical" as const, status: "open", department: "IT", createdBy: "System Monitor", createdAt: new Date().toISOString(), caseCount: 3 },
			],
		},
	})
}

// ─── Facility Config ──────────────────────────────────────────────

export function useFacilityConfigQuery() {
	return useQuery({
		...orpc.tenantAdmin.facility.getConfig.queryOptions(),
		placeholderData: {
			sla: {
				thresholds: [
					{ priority: "critical", responseHours: 1, resolutionHours: 4, escalationHours: 2 },
					{ priority: "high", responseHours: 4, resolutionHours: 24, escalationHours: 8 },
					{ priority: "medium", responseHours: 8, resolutionHours: 48, escalationHours: 24 },
					{ priority: "low", responseHours: 24, resolutionHours: 72, escalationHours: 48 },
				],
				businessHoursOnly: false,
				holidayCalendarId: null,
			},
			departments: [
				{ id: "dept1", name: "Cardiology", careTeams: ["Cardio Team A"], headUserId: null, isActive: true },
				{ id: "dept2", name: "Billing", careTeams: ["Billing Team"], headUserId: null, isActive: true },
			],
			notificationTemplates: [
				{ id: "tpl1", name: "Case Assigned", channel: "email", eventType: "case.assigned", subjectTemplate: "Case {{case.id}} assigned to you", bodyTemplate: "Dear {{agent.name}}, case {{case.id}} has been assigned to you.", isActive: true, updatedAt: new Date().toISOString() },
			],
			routingDefaults: [
				{ caseType: "LOA Request", defaultTeamId: "team1", defaultDepartmentId: "dept1", defaultPriority: "medium" },
			],
		},
	})
}

export function useUpdateSlaMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.tenantAdmin.facility.updateSla.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.tenantAdmin.facility.key() }),
			onError: handleMutationError,
		})
	)
}

export function useUpdateTemplateMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.tenantAdmin.facility.updateTemplate.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.tenantAdmin.facility.key() }),
			onError: handleMutationError,
		})
	)
}

export function useUpsertDepartmentMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.tenantAdmin.facility.upsertDepartment.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.tenantAdmin.facility.key() }),
			onError: handleMutationError,
		})
	)
}

// ─── Shared Policies ──────────────────────────────────────────────

export function useSharedPoliciesListQuery(params?: {
	status?: "active" | "inactive" | "draft"
	serviceType?: string
	page?: number
	limit?: number
}) {
	return useQuery({
		...orpc.tenantAdmin.sharedPolicies.list.queryOptions({
			input: {
				page: params?.page ?? 1,
				limit: params?.limit ?? 20,
				status: params?.status,
				serviceType: params?.serviceType,
			},
		}),
		placeholderData: {
			total: 1,
			page: 1,
			limit: 20,
			items: [
				{ id: "sp1", name: "Cross-Facility LOA Policy", serviceType: "LOA", coveredTenantIds: ["t1", "t2"], slaHours: 48, status: "active" as const, effectiveDate: "2026-01-01", expiryDate: null, notes: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
			],
		},
	})
}

export function useCreateSharedPolicyMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.tenantAdmin.sharedPolicies.create.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.tenantAdmin.sharedPolicies.key() }),
			onError: handleMutationError,
		})
	)
}

export function useUpdateSharedPolicyMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.tenantAdmin.sharedPolicies.update.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.tenantAdmin.sharedPolicies.key() }),
			onError: handleMutationError,
		})
	)
}

export function useDeleteSharedPolicyMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.tenantAdmin.sharedPolicies.delete.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.tenantAdmin.sharedPolicies.key() }),
			onError: handleMutationError,
		})
	)
}

// ─── Cross-Facility ───────────────────────────────────────────────

export function useGenerateCrossFacilityReportMutation() {
	return useMutation(
		orpc.tenantAdmin.crossFacility.generate.mutationOptions({ onError: handleMutationError })
	)
}

// ─── Boundary Violations ──────────────────────────────────────────

export function useBoundaryViolationsListQuery(params?: {
	severity?: "low" | "medium" | "high" | "critical"
	outcome?: "blocked" | "allowed_with_flag"
	actorUserId?: string
	isResolved?: boolean
	dateFrom?: string
	dateTo?: string
	page?: number
	limit?: number
}) {
	return useQuery({
		...orpc.tenantAdmin.boundaryViolations.list.queryOptions({
			input: {
				page: params?.page ?? 1,
				limit: params?.limit ?? 20,
				severity: params?.severity,
				outcome: params?.outcome,
				actorUserId: params?.actorUserId,
				isResolved: params?.isResolved,
				dateFrom: params?.dateFrom,
				dateTo: params?.dateTo,
			},
		}),
		placeholderData: {
			total: 2,
			page: 1,
			limit: 20,
			kpis: { openCritical: 1, openWarning: 1, resolvedThisWeek: 3, totalUnresolved: 2 },
			items: [
				{ id: "bv1", violationType: "cross_tenant_read", severity: "critical" as const, outcome: "blocked" as const, actorName: "Unknown Agent", actorRole: "case_agent", sourceTenantId: "t1", targetTenantId: "t2", targetResourceType: "Patient", ruleViolated: "RULE-001", ipAddress: "10.0.0.99", detectedAt: new Date().toISOString(), isResolved: false, resolutionNote: null },
				{ id: "bv2", violationType: "unauthorized_export", severity: "medium" as const, outcome: "allowed_with_flag" as const, actorName: "Case Agent", actorRole: "clinician", sourceTenantId: "t1", targetTenantId: "t1", targetResourceType: "Case", ruleViolated: "RULE-004", ipAddress: null, detectedAt: new Date().toISOString(), isResolved: false, resolutionNote: null },
			],
		},
	})
}

export function useResolveBoundaryViolationMutation() {
	const qc = useQueryClient()
	return useMutation(
		orpc.tenantAdmin.boundaryViolations.resolve.mutationOptions({
			onSuccess: () => qc.invalidateQueries({ queryKey: orpc.tenantAdmin.boundaryViolations.key() }),
			onError: handleMutationError,
		})
	)
}

// ─── Patient Audit & Consent ──────────────────────────────────────

export function usePatientAuditListQuery(
	patientId: string,
	params?: { actionType?: string; dateFrom?: string; dateTo?: string; page?: number; limit?: number }
) {
	return useQuery({
		...orpc.tenantAdmin.patientAudit.list.queryOptions({
			input: {
				patientId,
				page: params?.page ?? 1,
				limit: params?.limit ?? 20,
				actionType: params?.actionType,
				dateFrom: params?.dateFrom,
				dateTo: params?.dateTo,
			},
		}),
		enabled: !!patientId,
		placeholderData: {
			total: 1,
			page: 1,
			limit: 20,
			items: [
				{ id: "pa1", actorName: "Case Agent", actorRole: "case_agent", actionType: "patient.view", fieldChanged: null, before: null, after: null, ipAddress: "192.168.1.1", occurredAt: new Date().toISOString() },
			],
		},
	})
}

export function useConsentHistoryListQuery(
	patientId: string,
	params?: { category?: string; page?: number; limit?: number }
) {
	return useQuery({
		...orpc.tenantAdmin.consentHistory.list.queryOptions({
			input: {
				patientId,
				page: params?.page ?? 1,
				limit: params?.limit ?? 20,
				category: params?.category,
			},
		}),
		enabled: !!patientId,
		placeholderData: {
			total: 1,
			page: 1,
			limit: 20,
			items: [
				{ id: "ch1", category: "treatment", status: "consented", captureMethod: "verbal", recordedBy: "Case Agent", recordedByRole: "case_agent", documentKey: null, recordedAt: new Date().toISOString() },
			],
		},
	})
}
