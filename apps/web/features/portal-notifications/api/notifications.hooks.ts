"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

interface Filters {
	unreadOnly?: boolean
	limit?: number
}

export function useNotificationsListQuery(filters: Filters = {}) {
	return useQuery({
		...orpc.notifications.list.queryOptions({
			input: {
				unreadOnly: filters.unreadOnly ?? false,
				limit: filters.limit ?? 50,
			},
		}),
		refetchInterval: 30 * 1000,
		staleTime: 15 * 1000,
	})
}

export function useMarkNotificationsReadMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.notifications.markRead.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.notifications.list.key() })
			},
		})
	)
}

export function useMarkAllNotificationsReadMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.notifications.markAllRead.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.notifications.list.key() })
			},
		})
	)
}
