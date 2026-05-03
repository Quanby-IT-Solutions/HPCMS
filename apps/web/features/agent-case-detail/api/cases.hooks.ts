"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

function buildMockCaseDetail(ref: string) {
	const now = Date.now()
	const dayMs = 24 * 60 * 60 * 1000
	return {
		id: "case-1",
		tenantId: "tenant-1",
		caseRef: ref || "LOA-2026-00128",
		caseType: "loa",
		status: "in_review",
		priority: "high",
		sourceChannel: "portal",
		patientId: "patient-maria-santos",
		practitionerId: "prac-dr-lim",
		assignedUserId: "user-agent-1",
		submittedAt: new Date(now - 2 * dayMs).toISOString(),
		inReviewAt: new Date(now - 1 * dayMs).toISOString(),
		resolvedAt: null,
		closedAt: null,
		outcome: null,
		rejectionReason: null,
		payload: {
			hmoProvider: "Maxicare",
			policyNumber: "MAX-2026-009812",
			admissionType: "elective",
			diagnosis: "Cholecystitis",
			procedure: "Laparoscopic cholecystectomy",
			estimatedStay: "3 days",
		},
		createdAt: new Date(now - 2 * dayMs).toISOString(),
		updatedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
		patient: {
			id: "patient-maria-santos",
			fullName: "Maria Santos",
			mrn: "PCMS-00421",
			dateOfBirth: "1985-03-15",
			sex: "female",
			phone: "+63 917 123 4567",
			email: "maria.santos@email.com",
		},
		practitioner: {
			id: "prac-dr-lim",
			fullName: "Dr. Angela Lim",
			specialty: "General Surgery",
		},
		assignee: {
			id: "user-agent-1",
			name: "J. Reyes",
			email: "agent@hpcms.local",
		},
		events: [
			{
				id: "ev-1",
				type: "submitted",
				note: "LOA request submitted via patient portal",
				createdAt: new Date(now - 2 * dayMs).toISOString(),
				userId: null,
				userName: "Maria Santos",
			},
			{
				id: "ev-2",
				type: "assigned",
				note: "Case auto-assigned to J. Reyes (LOA team)",
				createdAt: new Date(now - 2 * dayMs + 5 * 60 * 1000).toISOString(),
				userId: "system",
				userName: "System",
			},
			{
				id: "ev-3",
				type: "status_change",
				note: "Status changed to In Review",
				createdAt: new Date(now - 1 * dayMs).toISOString(),
				userId: "user-agent-1",
				userName: "J. Reyes",
			},
			{
				id: "ev-4",
				type: "internal_note",
				note: "HMO documents verified. Waiting for admitting order from Dr. Lim.",
				createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
				userId: "user-agent-1",
				userName: "J. Reyes",
			},
		],
		attachments: [
			{
				id: "att-1",
				filename: "maxicare-loa-form.pdf",
				sizeBytes: 245_000,
				mimeType: "application/pdf",
				uploadedAt: new Date(now - 2 * dayMs).toISOString(),
			},
			{
				id: "att-2",
				filename: "valid-id-scan.jpg",
				sizeBytes: 1_200_000,
				mimeType: "image/jpeg",
				uploadedAt: new Date(now - 2 * dayMs).toISOString(),
			},
		],
		riskLevel: "moderate",
		slaDueAt: new Date(now + 4 * 60 * 60 * 1000).toISOString(),
		slaBreached: false,
		flagCount: 0,
	}
}

export function useCaseDetailQuery(ref: string) {
	return useQuery({
		...orpc.cases.get.queryOptions({ input: { ref } }),
		placeholderData: () => buildMockCaseDetail(ref) as never,
	})
}

function invalidateCaseKeys(queryClient: ReturnType<typeof useQueryClient>) {
	queryClient.invalidateQueries({ queryKey: orpc.cases.list.key() })
	queryClient.invalidateQueries({ queryKey: orpc.cases.get.key() })
}

export function useAssignCaseMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.cases.assign.mutationOptions({
			onSuccess: () => invalidateCaseKeys(queryClient),
		})
	)
}

export function useApproveCaseMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.cases.approve.mutationOptions({
			onSuccess: () => invalidateCaseKeys(queryClient),
		})
	)
}

export function useRejectCaseMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.cases.reject.mutationOptions({
			onSuccess: () => invalidateCaseKeys(queryClient),
		})
	)
}

export function useCloseCaseMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.cases.close.mutationOptions({
			onSuccess: () => invalidateCaseKeys(queryClient),
		})
	)
}

export function useAddEventMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.cases.addEvent.mutationOptions({
			onSuccess: () => invalidateCaseKeys(queryClient),
		})
	)
}

export function useSignDownloadLazy() {
	const queryClient = useQueryClient()
	return async (caseRef: string, attachmentId: string) => {
		return queryClient.fetchQuery(
			orpc.attachments.signDownload.queryOptions({
				input: { caseRef, attachmentId },
				staleTime: 4 * 60 * 1000,
			})
		)
	}
}
