"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

export function useMyRequestsQuery(page = 1, limit = 20) {
	return useQuery(orpc.cases.myRequests.queryOptions({ input: { page, limit } }))
}

export function useCaseQuery(ref: string) {
	return useQuery(orpc.cases.get.queryOptions({ input: { ref } }))
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
