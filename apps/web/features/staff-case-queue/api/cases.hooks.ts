"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { CaseListInputSchema } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

type CaseListInput = z.infer<typeof CaseListInputSchema>

export function useCasesListQuery(input: CaseListInput) {
	return useQuery(orpc.cases.list.queryOptions({ input }))
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
