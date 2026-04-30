"use client"

import { useQuery } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

export function usePractitionerListQuery(params: { query?: string; specialty?: string }) {
	return useQuery({
		...orpc.practitioner.list.queryOptions({ input: params }),
		placeholderData: () => [
			{ id: "prac-1", tenantId: "t1", fullName: "Dr. Ana Reyes", specialty: "Internal Medicine", licenseNo: "PRC-2024-001", isActive: true, fhirResourceId: null, fhirSyncedAt: null, fhirData: { department: "Internal Medicine" }, createdAt: new Date(), updatedAt: new Date() },
			{ id: "prac-2", tenantId: "t1", fullName: "Dr. Carlos Santos", specialty: "Cardiology", licenseNo: "PRC-2024-002", isActive: true, fhirResourceId: null, fhirSyncedAt: null, fhirData: { department: "Cardiology" }, createdAt: new Date(), updatedAt: new Date() },
			{ id: "prac-3", tenantId: "t2", fullName: "Dr. Maria Lopez", specialty: "Oncology", licenseNo: "PRC-2024-003", isActive: false, fhirResourceId: null, fhirSyncedAt: null, fhirData: { department: "Oncology" }, createdAt: new Date(), updatedAt: new Date() },
		],
	})
}

export function usePractitionerGetQuery(id: string) {
	return useQuery({
		...orpc.practitioner.get.queryOptions({ input: { id } }),
		enabled: !!id,
	})
}
