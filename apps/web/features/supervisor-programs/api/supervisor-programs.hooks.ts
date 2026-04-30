"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { EnrollmentDetail } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

export function usePatientProgramsQuery(patientId: string) {
	return useQuery({
		...orpc.programs.listForPatient.queryOptions({ input: { patientId } }),
		enabled: !!patientId,
		placeholderData: () => ({ enrollments: [] }),
	})
}

export function useSupervisorEnrollMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.programs.enroll.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.programs.key() }),
		})
	)
}

export function useEnrollmentUpdateMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.programs.updateEnrollment.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.programs.key() }),
		})
	)
}

export function useEnrollmentDetailQuery(enrollmentId: string) {
	return useQuery({
		...orpc.supervisor.programs.getEnrollment.queryOptions({ input: { enrollmentId } }),
		enabled: !!enrollmentId,
		placeholderData: (): EnrollmentDetail => ({
			enrollmentId,
			patientId: "pat-1",
			patientName: "Maria Santos",
			programId: "prog-1",
			programName: "Cardiac Rehab",
			status: "active",
			startDate: new Date("2026-03-01"),
			endDate: null,
			coordinatorName: "J. Reyes",
			notes: null,
			statusHistory: [],
		}),
	})
}

export function useEnrollmentListQuery(params: Record<string, unknown> = {}) {
	return useQuery({
		...orpc.supervisor.programs.listAll.queryOptions({ input: params }),
		placeholderData: () => ({
			rows: [
				{ enrollmentId: "enr-1", patientId: "pat-1", patientName: "Maria Santos", programName: "Cardiac Rehab", status: "active" as const, startDate: new Date("2026-03-01"), coordinatorName: "J. Reyes" },
				{ enrollmentId: "enr-2", patientId: "pat-2", patientName: "Juan Dela Cruz", programName: "Diabetes Mgmt.", status: "suspended" as const, startDate: new Date("2026-01-15"), coordinatorName: "A. Santos" },
			],
			total: 2,
			page: 1,
			pageSize: 25,
		}),
	})
}
