"use client"

import { useMutation, useQuery } from "@tanstack/react-query"

import type { Patient } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

export function useSupervisorPatientRegisterMutation() {
	return useMutation(orpc.supervisor.patients.register.mutationOptions())
}

export function usePatientCheckDuplicatesMutation() {
	return useMutation(orpc.supervisor.patients.checkDuplicates.mutationOptions())
}

export function useUpdateDemographicsMutation() {
	return useMutation(orpc.supervisor.patients.updateDemographics.mutationOptions())
}

const PLACEHOLDER_PATIENT: Patient = {
	id: "pat-1",
	tenantId: "tenant-1",
	mrn: "MRN-001",
	fullName: "Maria Santos",
	lastName: "Santos",
	sexAtBirth: "female",
	dateOfBirth: "1982-04-15",
	ethnicity: "Filipino",
	contact: { email: "maria.santos@email.com", phone: "+63 912 345 6789" },
	dataPrivacyActAcknowledged: true,
	dataSharingWithEmrConsent: true,
	marketingCommsConsent: false,
	researchUseConsent: false,
	consentsUpdatedAt: null,
	fhirResourceId: null,
	fhirSyncedAt: null,
	createdAt: new Date("2026-01-01"),
	updatedAt: new Date("2026-04-01"),
}

export function usePatientSearchQuery(q: string) {
	return useQuery({
		...orpc.patient.search.queryOptions({ input: { query: q || "a" } }),
		enabled: q.length > 1,
		placeholderData: (): Patient[] => [
			PLACEHOLDER_PATIENT,
			{
				...PLACEHOLDER_PATIENT,
				id: "pat-2",
				fullName: "Juan Dela Cruz",
				lastName: "Dela Cruz",
				mrn: "MRN-002",
				sexAtBirth: "male",
				dateOfBirth: "1975-09-22",
			},
		],
	})
}

export function usePatientGetQuery(id: string) {
	return useQuery({
		...orpc.patient.get.queryOptions({ input: { id } }),
		enabled: !!id,
		placeholderData: (): Patient => ({ ...PLACEHOLDER_PATIENT, id }),
	})
}
