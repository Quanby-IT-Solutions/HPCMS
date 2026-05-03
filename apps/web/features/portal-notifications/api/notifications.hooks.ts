"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

interface Filters {
	unreadOnly?: boolean
	limit?: number
}

function buildMockNotifications() {
	const now = Date.now()
	const hourMs = 60 * 60 * 1000
	const dayMs = 24 * hourMs
	return [
		{
			id: "n-1",
			type: "case_update",
			title: "LOA request under review",
			body: "Your LOA request LOA-2026-00128 is now being reviewed by our case team.",
			caseRef: "LOA-2026-00128",
			readAt: null,
			createdAt: new Date(now - 2 * hourMs).toISOString(),
		},
		{
			id: "n-2",
			type: "message",
			title: "New message from support",
			body: "J. Reyes replied to your case inquiry regarding billing statement discrepancy.",
			caseRef: "BIL-2026-00045",
			readAt: null,
			createdAt: new Date(now - 5 * hourMs).toISOString(),
		},
		{
			id: "n-3",
			type: "case_update",
			title: "Action required on your case",
			body: "Please upload the missing HMO ID copy to proceed with your LOA request.",
			caseRef: "LOA-2026-00128",
			readAt: null,
			createdAt: new Date(now - 1 * dayMs).toISOString(),
		},
		{
			id: "n-4",
			type: "case_resolved",
			title: "Case resolved",
			body: "Your follow-up request FUP-2026-00072 has been resolved. No further action needed.",
			caseRef: "FUP-2026-00072",
			readAt: new Date(now - 2 * dayMs).toISOString(),
			createdAt: new Date(now - 3 * dayMs).toISOString(),
		},
		{
			id: "n-5",
			type: "case_update",
			title: "LOA approved",
			body: "Your LOA request LOA-2026-00099 for outpatient MRI has been approved by PhilHealth.",
			caseRef: "LOA-2026-00099",
			readAt: new Date(now - 10 * dayMs).toISOString(),
			createdAt: new Date(now - 12 * dayMs).toISOString(),
		},
	]
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
		placeholderData: () => {
			const allItems = buildMockNotifications()
			const items = filters.unreadOnly ? allItems.filter(n => !n.readAt) : allItems
			return {
				items,
				total: items.length,
				unreadCount: allItems.filter(n => !n.readAt).length,
			} as never
		},
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
