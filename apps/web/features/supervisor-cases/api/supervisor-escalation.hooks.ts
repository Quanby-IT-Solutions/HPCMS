"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { EscalationHistoryItem } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

export function useCaseEscalateMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.cases.escalate.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.supervisor.cases.key() })
				queryClient.invalidateQueries({ queryKey: orpc.cases.key() })
			},
		})
	)
}

export function useEscalationHistoryQuery(ref: string) {
	return useQuery({
		...orpc.supervisor.cases.listEscalationHistory.queryOptions({ input: { ref } }),
		enabled: !!ref,
		placeholderData: () => ({
			caseRef: ref,
			history: [] as EscalationHistoryItem[],
		}),
	})
}
