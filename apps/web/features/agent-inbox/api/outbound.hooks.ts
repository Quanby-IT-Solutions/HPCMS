"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

export function useSendOutboundMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.outbound.send.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.inbox.list.key() })
				queryClient.invalidateQueries({ queryKey: orpc.inbox.get.key() })
				queryClient.invalidateQueries({ queryKey: orpc.cases.get.key() })
				queryClient.invalidateQueries({ queryKey: orpc.patient.timeline.list.key() })
			},
		})
	)
}
