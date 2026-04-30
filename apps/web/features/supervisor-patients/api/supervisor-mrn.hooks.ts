"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

export function useMrnLinkMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.patients.linkMrn.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.patient.key() }),
		})
	)
}

export function useFhirSyncTriggerMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.patients.triggerSync.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.patient.key() }),
		})
	)
}
