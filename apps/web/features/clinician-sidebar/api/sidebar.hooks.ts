"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { ClinicianCaseSummary } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

/**
 * Mock case summary used as `placeholderData` until CL-BE-03 lands.
 * The shape mirrors `ClinicianCaseSummaryOutputSchema`.
 */
function buildMockSummary(patientId: string): ClinicianCaseSummary {
	const now = new Date()
	const aDay = 24 * 60 * 60 * 1000
	return {
		patient: {
			patientId,
			mrn: "PCMS-00421",
			fullName: "Maria Santos",
			dateOfBirth: new Date("1971-08-12"),
			age: 54,
			sex: "F",
			hasAllergies: true,
			linkedToPcms: true,
		},
		activeCount: 2,
		mostRecentCommunication: "Coordinator left voicemail with HMO yesterday",
		cases: [
			{
				caseRef: "LOA-2026-00128",
				caseType: "Letter of Authorization",
				status: "in_review",
				priority: "high",
				openedAt: new Date(now.getTime() - 2 * aDay),
				assignedAgentName: "J. Reyes",
				assignedAgentEmail: "j.reyes@slmc.test",
				loaStatus: "Awaiting clinician sign-off",
				latestNote: "HMO requested additional supporting docs",
				latestNoteAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
				flagCount: 0,
			},
			{
				caseRef: "FUP-2026-00098",
				caseType: "Follow-up coordination",
				status: "submitted",
				priority: "medium",
				openedAt: new Date(now.getTime() - 6 * aDay),
				assignedAgentName: null,
				assignedAgentEmail: null,
				loaStatus: null,
				latestNote: null,
				latestNoteAt: null,
				flagCount: 1,
			},
		],
		lastSyncedAt: now,
	}
}

export function useClinicianCaseSummaryQuery(patientId: string) {
	return useQuery({
		...orpc.clinician.summary.get.queryOptions({ input: { patientId } }),
		staleTime: 30 * 1000,
		placeholderData: buildMockSummary(patientId),
	})
}

export function useAddClinicalNoteMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.clinician.notes.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.clinician.summary.get.key(),
				})
			},
		})
	)
}

export function useFlagCaseMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.clinician.notes.flag.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.clinician.summary.get.key(),
				})
			},
		})
	)
}
