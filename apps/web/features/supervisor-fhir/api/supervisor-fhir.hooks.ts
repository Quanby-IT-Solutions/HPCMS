"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { FhirResourceRow, FhirResourceType } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

export function useFhirResourceQuery(patientId: string, resourceType: FhirResourceType) {
	return useQuery({
		...orpc.supervisor.fhir.queryResources.queryOptions({ input: { patientId, resourceType } }),
		enabled: !!patientId,
		placeholderData: (): { rows: FhirResourceRow[]; syncedAt: Date } => ({
			syncedAt: new Date("2026-04-30T05:00:00"),
			rows: resourceType === "Encounter"
				? [
					{ id: "enc-1", resourceType: "Encounter", display: "Outpatient Consultation — Dr. Santos", date: new Date("2026-04-10"), status: "finished" },
					{ id: "enc-2", resourceType: "Encounter", display: "Emergency Visit — Ward 3B", date: new Date("2026-04-18"), status: "finished" },
					{ id: "enc-3", resourceType: "Encounter", display: "Follow-up Visit — Cardiology", date: new Date("2026-04-28"), status: "planned" },
				]
				: resourceType === "Condition"
				? [
					{ id: "cond-1", resourceType: "Condition", display: "Hypertension (I10)", date: new Date("2025-01-15"), status: "active" },
					{ id: "cond-2", resourceType: "Condition", display: "Type 2 Diabetes (E11)", date: new Date("2024-06-01"), status: "active" },
				]
				: [
					{ id: "sr-1", resourceType: "ServiceRequest", display: "CBC with Differential", date: new Date("2026-04-10"), status: "completed" },
					{ id: "sr-2", resourceType: "ServiceRequest", display: "Chest X-Ray PA View", date: new Date("2026-04-20"), status: "active" },
				],
		}),
	})
}

export function useFhirLinkResourceMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.fhir.linkResource.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.fhir.key() }),
		})
	)
}
