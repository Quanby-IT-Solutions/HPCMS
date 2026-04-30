"use client"

import { useQuery } from "@tanstack/react-query"

import type { AssignedDevice, ProgramEnrollment } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

const MOCK_PROGRAMS: ProgramEnrollment[] = [
	{
		id: "prog-1",
		programName: "Diabetes Management Cohort",
		status: "enrolled",
		enrolledAt: new Date("2024-03-15"),
		endedAt: null,
		coordinatorName: "Coordinator Reyes",
		notes: "Q2 review pending",
	},
]

const MOCK_DEVICES: AssignedDevice[] = [
	{
		id: "dev-1",
		deviceType: "Glucometer",
		model: "Accu-Chek Active",
		serialNumber: "AC-2024-1188",
		status: "active",
		assignedAt: new Date("2024-04-01"),
		returnedAt: null,
		notes: null,
	},
]

export function useProgramsForPatientQuery(patientId: string) {
	return useQuery({
		...orpc.programs.listForPatient.queryOptions({ input: { patientId } }),
		staleTime: 60 * 1000,
		placeholderData: { enrollments: MOCK_PROGRAMS },
	})
}

export function useDevicesForPatientQuery(patientId: string) {
	return useQuery({
		...orpc.devices.listForPatient.queryOptions({ input: { patientId } }),
		staleTime: 60 * 1000,
		placeholderData: { devices: MOCK_DEVICES },
	})
}
