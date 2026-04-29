"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

export function useVerifyMrnMutation() {
	const queryClient = useQueryClient()

	return useMutation(
		orpc.patient.verifyMrn.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.patient.me.key() })
			},
		})
	)
}
