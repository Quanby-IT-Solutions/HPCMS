"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

export function useLinkRelatedCaseMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.cases.linkRelated.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.cases.key() }),
		})
	)
}

export function useUnlinkRelatedCaseMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.cases.unlinkRelated.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.cases.key() }),
		})
	)
}

export function useRelatedCasesQuery(ref: string) {
	return useQuery({
		...orpc.supervisor.cases.listRelated.queryOptions({ input: { ref } }),
		enabled: !!ref,
		placeholderData: () => ({ caseRef: ref, links: [] }),
	})
}
