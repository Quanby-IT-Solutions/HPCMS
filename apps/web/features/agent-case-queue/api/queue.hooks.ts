"use client"

import { useQuery } from "@tanstack/react-query"

import type { QueueRow } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

interface QueueListInput {
	tab?: "mine" | "team" | "all_open"
	status?: string
	priority?: string
	riskLevel?: "low" | "moderate" | "high" | "critical"
	slaBreaching?: boolean
	page?: number
	limit?: number
	sort?: "oldest_first" | "newest_first" | "priority_desc"
}

function buildMockRows(): QueueRow[] {
	const now = Date.now()
	const dayMs = 24 * 60 * 60 * 1000
	return [
		{
			id: "case-1",
			tenantId: "tenant-1",
			caseRef: "LOA-2026-00128",
			caseType: "loa",
			status: "in_review",
			priority: "high",
			sourceChannel: "portal",
			patientId: "patient-maria-santos",
			practitionerId: null,
			assignedUserId: "user-agent-1",
			submittedAt: new Date(now - 2 * dayMs),
			inReviewAt: new Date(now - 1 * dayMs),
			resolvedAt: null,
			closedAt: null,
			outcome: null,
			rejectionReason: null,
			payload: null,
			createdAt: new Date(now - 2 * dayMs),
			updatedAt: new Date(now - 2 * 60 * 60 * 1000),
			patientName: "Maria Santos",
			patientMrn: "PCMS-00421",
			assigneeName: "J. Reyes",
			slaDueAt: new Date(now + 4 * 60 * 60 * 1000),
			slaBreached: false,
			ageMinutes: 2 * 24 * 60,
			riskLevel: "moderate",
			flagCount: 0,
		},
		{
			id: "case-2",
			tenantId: "tenant-1",
			caseRef: "LOA-2026-00131",
			caseType: "loa",
			status: "submitted",
			priority: "urgent",
			sourceChannel: "email",
			patientId: "patient-ramon-cruz",
			practitionerId: null,
			assignedUserId: null,
			submittedAt: new Date(now - 6 * 60 * 60 * 1000),
			inReviewAt: null,
			resolvedAt: null,
			closedAt: null,
			outcome: null,
			rejectionReason: null,
			payload: null,
			createdAt: new Date(now - 6 * 60 * 60 * 1000),
			updatedAt: new Date(now - 6 * 60 * 60 * 1000),
			patientName: "Ramon Cruz",
			patientMrn: "PCMS-00872",
			assigneeName: null,
			slaDueAt: new Date(now - 30 * 60 * 1000),
			slaBreached: true,
			ageMinutes: 6 * 60,
			riskLevel: "critical",
			flagCount: 1,
		},
		{
			id: "case-3",
			tenantId: "tenant-1",
			caseRef: "FUP-2026-00098",
			caseType: "follow_up",
			status: "submitted",
			priority: "medium",
			sourceChannel: "phone",
			patientId: "patient-anna-tan",
			practitionerId: null,
			assignedUserId: null,
			submittedAt: new Date(now - 30 * 60 * 1000),
			inReviewAt: null,
			resolvedAt: null,
			closedAt: null,
			outcome: null,
			rejectionReason: null,
			payload: null,
			createdAt: new Date(now - 30 * 60 * 1000),
			updatedAt: new Date(now - 30 * 60 * 1000),
			patientName: "Anna Tan",
			patientMrn: "PCMS-01244",
			assigneeName: null,
			slaDueAt: new Date(now + 23 * 60 * 60 * 1000),
			slaBreached: false,
			ageMinutes: 30,
			riskLevel: "low",
			flagCount: 0,
		},
	]
}

export function useQueueListQuery(input: QueueListInput) {
	return useQuery({
		...orpc.cases.queue.list.queryOptions({
			input: {
				tab: input.tab ?? "all_open",
				status: input.status as never,
				priority: input.priority as never,
				riskLevel: input.riskLevel,
				slaBreaching: input.slaBreaching,
				sort: input.sort ?? "oldest_first",
				page: input.page ?? 1,
				limit: input.limit ?? 25,
			},
		}),
		staleTime: 15 * 1000,
		placeholderData: () => ({
			items: buildMockRows(),
			total: 3,
			page: input.page ?? 1,
			pageSize: input.limit ?? 25,
		}),
	})
}

export function useQueueKpisQuery() {
	return useQuery({
		...orpc.cases.queue.kpis.queryOptions(),
		staleTime: 30 * 1000,
		// KPIs reconcile with the mock list: 1 case assigned to user-agent-1,
		// 3 open in team, 1 SLA-breaching, 1 critical-risk. Adjust placeholder
		// to match buildMockRows() so the queue and KPI strip stay consistent.
		placeholderData: () => ({
			mineCount: 1,
			teamCount: 3,
			allOpenCount: 3,
			slaBreachingCount: 1,
			criticalRiskCount: 1,
		}),
	})
}
