"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { ListAuditLogsInputSchema, ListUsersInputSchema } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

type ListUsersInput = z.infer<typeof ListUsersInputSchema>
type ListAuditLogsInput = z.infer<typeof ListAuditLogsInputSchema>

export function useUsersQuery(input: Partial<ListUsersInput> = {}) {
	return useQuery(
		orpc.staffAdmin.users.list.queryOptions({
			input: { page: 1, limit: 20, ...input },
		})
	)
}

export function useInviteUserMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.staffAdmin.users.invite.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.staffAdmin.users.list.key() })
			},
		})
	)
}

export function useSetUserRoleMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.staffAdmin.users.setRole.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.staffAdmin.users.list.key() })
			},
		})
	)
}

export function useAuditLogsQuery(input: Partial<ListAuditLogsInput> = {}) {
	return useQuery(
		orpc.staffAdmin.audit.list.queryOptions({
			input: { page: 1, limit: 20, ...input },
		})
	)
}
