"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

export function useCaseDetailQuery(ref: string) {
	return useQuery(orpc.cases.get.queryOptions({ input: { ref } }))
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
