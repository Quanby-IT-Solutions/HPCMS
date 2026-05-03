"use client"

import { useMutation, useQuery } from "@tanstack/react-query"

import type { CrossFacilityContextOutput } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

export function useCrossFacilityContextQuery(patientId: string) {
	return useQuery({
		...orpc.supervisor.patients.crossFacilityContext.queryOptions({ input: { patientId } }),
		enabled: !!patientId,
		initialData: {
			patientId,
			facilities: [
				{ tenantId: "fac-1", facilityName: "St. Luke's Medical Center", caseCount: 3, lastInteractionAt: new Date("2026-04-10"), accessLevel: "full" },
				{ tenantId: "fac-2", facilityName: "Philippine General Hospital", caseCount: 1, lastInteractionAt: new Date("2026-03-05"), accessLevel: "none" },
			],
		} as never,
		retry: false,
	})
}

export function useRequestCrossFacilityAccessMutation() {
	return useMutation(orpc.supervisor.patients.requestCrossFacilityAccess.mutationOptions())
}
