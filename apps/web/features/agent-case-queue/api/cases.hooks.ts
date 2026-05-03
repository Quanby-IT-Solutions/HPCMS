"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { z } from "zod"

import type { CaseListInputSchema } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

type CaseListInput = z.infer<typeof CaseListInputSchema>

export function useCasesListQuery(input: CaseListInput) {
	return useQuery({
		...orpc.cases.list.queryOptions({ input }),
		placeholderData: () => {
			const now = Date.now()
			const dayMs = 24 * 60 * 60 * 1000
			return {
				items: [
					{
						id: "case-1",
						caseRef: "LOA-2026-00128",
						caseType: "loa",
						status: "in_review",
						priority: "high",
						sourceChannel: "portal",
						patientName: "Maria Santos",
						patientMrn: "PCMS-00421",
						assigneeName: "J. Reyes",
						submittedAt: new Date(now - 2 * dayMs).toISOString(),
						updatedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
					},
					{
						id: "case-2",
						caseRef: "LOA-2026-00131",
						caseType: "loa",
						status: "submitted",
						priority: "urgent",
						sourceChannel: "email",
						patientName: "Ramon Cruz",
						patientMrn: "PCMS-00872",
						assigneeName: null,
						submittedAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
						updatedAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
					},
					{
						id: "case-3",
						caseRef: "FUP-2026-00098",
						caseType: "follow_up",
						status: "submitted",
						priority: "medium",
						sourceChannel: "phone",
						patientName: "Anna Tan",
						patientMrn: "PCMS-01244",
						assigneeName: null,
						submittedAt: new Date(now - 30 * 60 * 1000).toISOString(),
						updatedAt: new Date(now - 30 * 60 * 1000).toISOString(),
					},
					{
						id: "case-4",
						caseRef: "BIL-2026-00045",
						caseType: "billing",
						status: "pending_action",
						priority: "medium",
						sourceChannel: "portal",
						patientName: "Jose Garcia",
						patientMrn: "PCMS-00633",
						assigneeName: "A. Mendoza",
						submittedAt: new Date(now - 3 * dayMs).toISOString(),
						updatedAt: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
					},
				],
				total: 4,
				page: input.page ?? 1,
				pageSize: input.limit ?? 25,
			} as never
		},
	})
}

export function useClaimCaseMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.cases.claim.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.cases.list.key() })
				queryClient.invalidateQueries({ queryKey: orpc.cases.get.key() })
			},
		})
	)
}
