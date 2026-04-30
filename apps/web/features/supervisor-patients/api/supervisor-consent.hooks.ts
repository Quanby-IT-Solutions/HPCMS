"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

export function useConsentListQuery(patientId: string) {
	return useQuery({
		...orpc.supervisor.consent.list.queryOptions({ input: { patientId } }),
		enabled: !!patientId,
		placeholderData: () => ({
			categories: [
				{ category: "data_processing" as const, status: "granted" as const, effectiveDate: new Date("2026-01-15") },
				{ category: "communications" as const, status: "granted" as const, effectiveDate: new Date("2026-01-15") },
				{ category: "marketing" as const, status: "not_collected" as const, effectiveDate: null },
				{ category: "research_use" as const, status: "not_collected" as const, effectiveDate: null },
				{ category: "service_specific" as const, status: "not_collected" as const, effectiveDate: null },
			],
			history: [
				{
					id: "ch-1",
					category: "data_processing" as const,
					status: "granted" as const,
					captureMethod: "electronic" as const,
					recordedAt: new Date("2026-01-15"),
					recordedBy: "J. Reyes",
				},
			],
		}),
	})
}

export function useConsentRecordMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.consent.record.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.consent.key() }),
		})
	)
}

export function useConsentWithdrawMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.consent.withdraw.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.consent.key() }),
		})
	)
}
