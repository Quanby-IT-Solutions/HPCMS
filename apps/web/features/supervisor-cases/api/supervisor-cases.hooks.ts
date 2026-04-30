"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Case, CaseDetail } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

const PLACEHOLDER_CASE: Case = {
	id: "case-1",
	tenantId: "tenant-1",
	caseRef: "LOA-2026-00128",
	caseType: "loa",
	status: "in_review",
	priority: "high",
	sourceChannel: "portal",
	patientId: "pat-1",
	practitionerId: null,
	assignedUserId: null,
	submittedAt: new Date("2026-04-25"),
	inReviewAt: new Date("2026-04-25"),
	resolvedAt: null,
	closedAt: null,
	outcome: null,
	rejectionReason: null,
	payload: null,
	createdAt: new Date("2026-04-25"),
	updatedAt: new Date("2026-04-25"),
}

const PLACEHOLDER_CASE_DETAIL: CaseDetail = {
	...PLACEHOLDER_CASE,
	events: [],
	attachments: [],
}

export function useSupervisorCaseCreateMutation() {
	return useMutation(orpc.supervisor.cases.create.mutationOptions())
}

export function useCaseAssignMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.cases.assign.mutationOptions({
			onSuccess: () => Promise.all([
				queryClient.invalidateQueries({ queryKey: orpc.supervisor.cases.key() }),
				queryClient.invalidateQueries({ queryKey: orpc.supervisor.workload.key() }),
			]),
		})
	)
}

export function useSupervisorCaseGetQuery(ref: string) {
	return useQuery({
		...orpc.cases.get.queryOptions({ input: { ref } }),
		enabled: !!ref,
		placeholderData: (): CaseDetail => ({ ...PLACEHOLDER_CASE_DETAIL, caseRef: ref }),
	})
}

export function useSupervisorCaseListQuery(params: Record<string, unknown> = {}) {
	return useQuery({
		...orpc.cases.list.queryOptions({ input: params }),
		placeholderData: () => ({
			items: [PLACEHOLDER_CASE, { ...PLACEHOLDER_CASE, id: "case-2", caseRef: "BILL-2026-00043", caseType: "billing", status: "submitted" as const, priority: "medium" as const, patientId: "pat-2" }],
			total: 2,
			page: 1,
			limit: 25,
		}),
	})
}

export function useCaseTypesForFormQuery() {
	return useQuery(
		orpc.staffAdmin.caseTypes.list.queryOptions({
			placeholderData: {
				items: [
					{ id: "loa", name: "LOA Request", description: null, defaultPriority: "medium" as const, slaHours: 48, defaultTeam: null, requiredFields: [], optionalFields: [], defaultRoutingRuleId: null, status: "active" as const },
					{ id: "billing", name: "Billing Inquiry", description: null, defaultPriority: "low" as const, slaHours: 72, defaultTeam: null, requiredFields: [], optionalFields: [], defaultRoutingRuleId: null, status: "active" as const },
					{ id: "complaint", name: "Complaint", description: null, defaultPriority: "medium" as const, slaHours: 24, defaultTeam: null, requiredFields: [], optionalFields: [], defaultRoutingRuleId: null, status: "active" as const },
					{ id: "appointment", name: "Appointment", description: null, defaultPriority: "low" as const, slaHours: 96, defaultTeam: null, requiredFields: [], optionalFields: [], defaultRoutingRuleId: null, status: "active" as const },
					{ id: "referral", name: "Referral", description: null, defaultPriority: "medium" as const, slaHours: 48, defaultTeam: null, requiredFields: [], optionalFields: [], defaultRoutingRuleId: null, status: "active" as const },
				],
			},
		})
	)
}
