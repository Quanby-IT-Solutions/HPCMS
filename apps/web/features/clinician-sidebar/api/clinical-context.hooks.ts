"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"

import type {
	AllergyRow,
	CarePlanRow,
	DiagnosticRow,
	ImmunizationRow,
	MedicationRow,
	ObservationRow,
} from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

interface SyncedSection<T> {
	items: T[]
	lastSyncedAt: Date
}

const STALE_TIME = 60 * 1000

const NOW = () => new Date()

const MOCK_ALLERGIES: SyncedSection<AllergyRow> = {
	items: [
		{
			id: "allergy-1",
			substance: "Penicillin",
			severity: "severe",
			reaction: "Anaphylaxis",
			verifiedAt: new Date("2019-04-12"),
		},
		{
			id: "allergy-2",
			substance: "Latex",
			severity: "moderate",
			reaction: "Contact dermatitis",
			verifiedAt: new Date("2022-09-04"),
		},
	],
	lastSyncedAt: NOW(),
}

const MOCK_MEDICATIONS: SyncedSection<MedicationRow> = {
	items: [
		{
			id: "med-1",
			name: "Metformin 500mg",
			dose: "500mg",
			frequency: "BID with meals",
			status: "active",
			prescribedBy: "Dr. Reyes",
			startedAt: new Date("2024-01-10"),
		},
		{
			id: "med-2",
			name: "Atorvastatin 20mg",
			dose: "20mg",
			frequency: "QHS",
			status: "active",
			prescribedBy: "Dr. Cruz",
			startedAt: new Date("2023-06-21"),
		},
	],
	lastSyncedAt: NOW(),
}

const MOCK_IMMUNIZATIONS: SyncedSection<ImmunizationRow> = {
	items: [
		{
			id: "imm-1",
			vaccine: "Influenza (seasonal)",
			administeredAt: new Date("2025-10-04"),
			lotNumber: "FLU-25-A14",
			site: "Left deltoid",
		},
		{
			id: "imm-2",
			vaccine: "Pneumococcal PPSV23",
			administeredAt: new Date("2024-11-19"),
			lotNumber: "PPV-24-7",
			site: "Right deltoid",
		},
	],
	lastSyncedAt: NOW(),
}

const MOCK_OBSERVATIONS: SyncedSection<ObservationRow> = {
	items: [
		{
			id: "obs-1",
			code: "8480-6",
			display: "Systolic BP",
			value: "138",
			unit: "mmHg",
			category: "vital-signs",
			recordedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
		},
		{
			id: "obs-2",
			code: "8462-4",
			display: "Diastolic BP",
			value: "86",
			unit: "mmHg",
			category: "vital-signs",
			recordedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
		},
		{
			id: "obs-3",
			code: "4548-4",
			display: "HbA1c",
			value: "7.2",
			unit: "%",
			category: "laboratory",
			recordedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
		},
	],
	lastSyncedAt: NOW(),
}

const MOCK_CARE_PLANS: SyncedSection<CarePlanRow> = {
	items: [
		{
			id: "cp-1",
			title: "Type 2 Diabetes Management",
			status: "active",
			intent: "plan",
			periodStart: new Date("2024-01-15"),
			periodEnd: null,
			goals: ["HbA1c < 7.0", "BMI reduction by 5kg over 6 months"],
		},
	],
	lastSyncedAt: NOW(),
}

const MOCK_DIAGNOSTICS: SyncedSection<DiagnosticRow> = {
	items: [
		{
			id: "diag-1",
			name: "Lipid Panel",
			status: "final",
			conclusion: "Mildly elevated LDL; statin response within target",
			effectiveAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
		},
	],
	lastSyncedAt: NOW(),
}

export function useAllergiesQuery(patientId: string) {
	return useQuery({
		...orpc.clinician.enrichment.allergies.queryOptions({ input: { patientId } }),
		staleTime: STALE_TIME,
		placeholderData: MOCK_ALLERGIES,
	})
}

export function useMedicationsQuery(patientId: string) {
	return useQuery({
		...orpc.clinician.enrichment.medications.queryOptions({ input: { patientId } }),
		staleTime: STALE_TIME,
		placeholderData: MOCK_MEDICATIONS,
	})
}

export function useImmunizationsQuery(patientId: string) {
	return useQuery({
		...orpc.clinician.enrichment.immunizations.queryOptions({ input: { patientId } }),
		staleTime: STALE_TIME,
		placeholderData: MOCK_IMMUNIZATIONS,
	})
}

export function useObservationsQuery(patientId: string) {
	return useQuery({
		...orpc.clinician.enrichment.observations.queryOptions({ input: { patientId } }),
		staleTime: STALE_TIME,
		placeholderData: MOCK_OBSERVATIONS,
	})
}

export function useCarePlansQuery(patientId: string) {
	return useQuery({
		...orpc.clinician.enrichment.carePlans.queryOptions({ input: { patientId } }),
		staleTime: STALE_TIME,
		placeholderData: MOCK_CARE_PLANS,
	})
}

export function useDiagnosticsQuery(patientId: string) {
	return useQuery({
		...orpc.clinician.enrichment.diagnostics.queryOptions({ input: { patientId } }),
		staleTime: STALE_TIME,
		placeholderData: MOCK_DIAGNOSTICS,
	})
}

type EnrichmentSection =
	| "allergies"
	| "medications"
	| "immunizations"
	| "observations"
	| "carePlans"
	| "diagnostics"

export function useRefreshSection() {
	const queryClient = useQueryClient()
	return (section: EnrichmentSection) => {
		queryClient.invalidateQueries({ queryKey: orpc.clinician.enrichment[section].key() })
	}
}
