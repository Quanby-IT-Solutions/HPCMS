"use client"

import { useQuery } from "@tanstack/react-query"

import type { Patient } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

const MOCK_PATIENTS: Patient[] = [
	{
		id: "patient-maria-santos",
		tenantId: "tenant-1",
		mrn: "PCMS-00421",
		fullName: "Maria Santos",
		lastName: "Santos",
		sexAtBirth: "F",
		dateOfBirth: "1971-08-12",
		ethnicity: "Filipino",
		contact: null,
		dataPrivacyActAcknowledged: true,
		dataSharingWithEmrConsent: true,
		marketingCommsConsent: false,
		researchUseConsent: false,
		consentsUpdatedAt: new Date("2024-01-15"),
		fhirResourceId: "fhir-pat-1",
		fhirSyncedAt: new Date("2026-04-25"),
		createdAt: new Date("2023-11-01"),
		updatedAt: new Date("2026-04-25"),
	},
	{
		id: "patient-ramon-cruz",
		tenantId: "tenant-1",
		mrn: "PCMS-00872",
		fullName: "Ramon Cruz",
		lastName: "Cruz",
		sexAtBirth: "M",
		dateOfBirth: "1965-03-22",
		ethnicity: "Filipino",
		contact: null,
		dataPrivacyActAcknowledged: true,
		dataSharingWithEmrConsent: true,
		marketingCommsConsent: false,
		researchUseConsent: false,
		consentsUpdatedAt: new Date("2024-09-04"),
		fhirResourceId: "fhir-pat-2",
		fhirSyncedAt: new Date("2026-04-22"),
		createdAt: new Date("2024-09-04"),
		updatedAt: new Date("2026-04-22"),
	},
	{
		id: "patient-anna-tan",
		tenantId: "tenant-1",
		mrn: "PCMS-01244",
		fullName: "Anna Tan",
		lastName: "Tan",
		sexAtBirth: "F",
		dateOfBirth: "1988-07-19",
		ethnicity: "Chinese-Filipino",
		contact: null,
		dataPrivacyActAcknowledged: true,
		dataSharingWithEmrConsent: false,
		marketingCommsConsent: true,
		researchUseConsent: false,
		consentsUpdatedAt: new Date("2025-02-11"),
		fhirResourceId: null,
		fhirSyncedAt: null,
		createdAt: new Date("2025-02-11"),
		updatedAt: new Date("2025-02-11"),
	},
]

export function usePatientSearchQuery(query: string, enabled = true) {
	return useQuery({
		...orpc.patient.search.queryOptions({ input: { query, limit: 20 } }),
		enabled: enabled && query.trim().length >= 2,
		placeholderData: query.trim().length >= 2 ? MOCK_PATIENTS : undefined,
	})
}

export function usePatientRecentsQuery() {
	return useQuery({
		...orpc.patient.recent.queryOptions({ input: { limit: 10 } }),
		staleTime: 60 * 1000,
		placeholderData: () => ({
			patients: [
				{
					id: "patient-maria-santos",
					mrn: "PCMS-00421",
					fullName: "Maria Santos",
					lastInteractionAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
					lastInteractionChannel: "email",
					openCaseCount: 1,
				},
				{
					id: "patient-ramon-cruz",
					mrn: "PCMS-00872",
					fullName: "Ramon Cruz",
					lastInteractionAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
					lastInteractionChannel: "phone",
					openCaseCount: 2,
				},
			],
		}),
	})
}

export function usePatientGetQuery(id: string) {
	return useQuery({
		...orpc.patient.get.queryOptions({ input: { id } }),
		placeholderData: MOCK_PATIENTS.find(p => p.id === id),
	})
}
