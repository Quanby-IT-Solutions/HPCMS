"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

function buildMockRequests() {
	const now = Date.now()
	const dayMs = 24 * 60 * 60 * 1000
	return [
		{
			id: "case-p1",
			caseRef: "LOA-2026-00128",
			caseType: "loa",
			status: "in_review",
			priority: "high",
			sourceChannel: "portal",
			submittedAt: new Date(now - 2 * dayMs).toISOString(),
			updatedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
			summary: "LOA for elective cholecystectomy — Maxicare",
		},
		{
			id: "case-p2",
			caseRef: "BIL-2026-00045",
			caseType: "billing",
			status: "pending_action",
			priority: "medium",
			sourceChannel: "portal",
			submittedAt: new Date(now - 5 * dayMs).toISOString(),
			updatedAt: new Date(now - 1 * dayMs).toISOString(),
			summary: "Billing inquiry — final statement discrepancy",
		},
		{
			id: "case-p3",
			caseRef: "FUP-2026-00072",
			caseType: "follow_up",
			status: "resolved",
			priority: "low",
			sourceChannel: "portal",
			submittedAt: new Date(now - 10 * dayMs).toISOString(),
			updatedAt: new Date(now - 3 * dayMs).toISOString(),
			summary: "Post-discharge medication clarification",
		},
		{
			id: "case-p4",
			caseRef: "LOA-2026-00099",
			caseType: "loa",
			status: "approved",
			priority: "medium",
			sourceChannel: "portal",
			submittedAt: new Date(now - 14 * dayMs).toISOString(),
			updatedAt: new Date(now - 12 * dayMs).toISOString(),
			summary: "LOA for outpatient MRI — PhilHealth",
		},
	]
}

function buildMockCaseDetail(ref: string) {
	const now = Date.now()
	const dayMs = 24 * 60 * 60 * 1000
	const ts = (offset: number) => new Date(now - offset).toISOString()
	return {
		id: "case-p1",
		tenantId: "tenant-1",
		caseRef: ref || "LOA-2026-00128",
		caseType: "loa",
		status: "in_review",
		priority: "high",
		sourceChannel: "portal",
		patientId: "pat-1",
		practitionerId: null,
		assignedUserId: "user-jreyes",
		submittedAt: ts(2 * dayMs),
		inReviewAt: ts(1 * dayMs),
		resolvedAt: null,
		closedAt: null,
		outcome: null,
		rejectionReason: null,
		payload: {
			hmoProvider: "Maxicare",
			procedure: "Elective cholecystectomy",
			hospital: "St. Luke's Medical Center",
		},
		createdAt: ts(2 * dayMs),
		updatedAt: ts(2 * 60 * 60 * 1000),
		summary: "LOA for elective cholecystectomy — Maxicare",
		assigneeName: "J. Reyes",
		events: [
			{
				id: "ev-1",
				caseId: "case-p1",
				eventType: "submitted",
				actorUserId: null,
				payload: { note: "Request submitted via patient portal" },
				visibility: "patient" as const,
				createdAt: ts(2 * dayMs),
				updatedAt: ts(2 * dayMs),
			},
			{
				id: "ev-2",
				caseId: "case-p1",
				eventType: "assigned",
				actorUserId: "system",
				payload: { note: "Assigned to case agent J. Reyes" },
				visibility: "patient" as const,
				createdAt: ts(2 * dayMs - 5 * 60 * 1000),
				updatedAt: ts(2 * dayMs - 5 * 60 * 1000),
			},
			{
				id: "ev-3",
				caseId: "case-p1",
				eventType: "status_change",
				actorUserId: "user-jreyes",
				payload: { note: "Status changed to In Review — documents being verified" },
				visibility: "patient" as const,
				createdAt: ts(1 * dayMs),
				updatedAt: ts(1 * dayMs),
			},
		],
		attachments: [
			{
				id: "att-1",
				tenantId: "tenant-1",
				caseId: "case-p1",
				kind: "loa_form",
				storageKey: "uploads/case-p1/maxicare-loa-form.pdf",
				originalFilename: "maxicare-loa-form.pdf",
				contentType: "application/pdf",
				sizeBytes: 245_000,
				uploadedByUserId: null,
				uploadedAt: ts(2 * dayMs),
				createdAt: ts(2 * dayMs),
				updatedAt: ts(2 * dayMs),
			},
			{
				id: "att-2",
				tenantId: "tenant-1",
				caseId: "case-p1",
				kind: "supporting_document",
				storageKey: "uploads/case-p1/lab-results-oct2026.pdf",
				originalFilename: "lab-results-oct2026.pdf",
				contentType: "application/pdf",
				sizeBytes: 89_000,
				uploadedByUserId: null,
				uploadedAt: ts(2 * dayMs),
				createdAt: ts(2 * dayMs),
				updatedAt: ts(2 * dayMs),
			},
		],
	}
}

export function useMyRequestsQuery(page = 1, limit = 20) {
	return useQuery({
		...orpc.cases.myRequests.queryOptions({ input: { page, limit } }),
		initialData: {
			items: buildMockRequests(),
			total: 4,
			page,
			pageSize: limit,
		} as never,
		retry: false,
	})
}

export function useCaseQuery(ref: string) {
	return useQuery({
		...orpc.cases.get.queryOptions({ input: { ref } }),
		initialData: buildMockCaseDetail(ref) as never,
		retry: false,
	})
}

export function useWithdrawCaseMutation() {
	const queryClient = useQueryClient()

	return useMutation(
		orpc.cases.withdraw.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.cases.myRequests.key() })
				queryClient.invalidateQueries({ queryKey: orpc.cases.get.key() })
			},
		})
	)
}

export function useSignDownloadQuery(caseRef: string, attachmentId: string) {
	return useQuery(
		orpc.attachments.signDownload.queryOptions({
			input: { caseRef, attachmentId },
			staleTime: 4 * 60 * 1000,
		})
	)
}
