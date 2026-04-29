"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

export function useRequestUploadsMutation() {
	return useMutation(orpc.cases.loa.requestUploads.mutationOptions())
}

export function useSubmitLoaMutation() {
	const queryClient = useQueryClient()

	return useMutation(
		orpc.cases.loa.submit.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.cases.myRequests.key() })
			},
		})
	)
}
