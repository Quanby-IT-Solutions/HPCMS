"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Incident, IncidentDetail } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

export function useIncidentListQuery() {
	return useQuery({
		...orpc.supervisor.incidents.list.queryOptions({ input: {} }),
		placeholderData: () => ({
			rows: [
				{ incidentId: "inc-1", title: "LOA Processing Backlog", description: "High volume of LOA requests exceeding processing capacity.", severity: "high" as const, status: "investigating" as const, caseRefs: ["LOA-2026-00128", "LOA-2026-00130"], rootCauseNotes: null, resolutionDoc: null, createdBy: "supervisor@hpcms.local", createdAt: new Date("2026-04-25"), updatedAt: new Date("2026-04-25") },
				{ incidentId: "inc-2", title: "Billing System Outage", description: "Billing portal unavailable for 2 hours on April 20.", severity: "critical" as const, status: "resolved" as const, caseRefs: ["BILL-2026-00043", "BILL-2026-00044", "BILL-2026-00045"], rootCauseNotes: "Server disk full", resolutionDoc: "Increased disk quota, monitoring added.", createdBy: "supervisor@hpcms.local", createdAt: new Date("2026-04-20"), updatedAt: new Date("2026-04-22") },
			] as Incident[],
			total: 2,
		}),
	})
}

export function useIncidentCreateMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.incidents.create.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.incidents.key() }),
		})
	)
}

export function useIncidentGetQuery(id: string) {
	return useQuery({
		...orpc.supervisor.incidents.get.queryOptions({ input: { id } }),
		enabled: !!id,
		placeholderData: (): IncidentDetail => ({
			incidentId: id,
			title: "LOA Processing Backlog",
			description: "High volume of LOA requests exceeding processing capacity.",
			severity: "high",
			status: "investigating",
			caseRefs: ["LOA-2026-00128", "LOA-2026-00130"],
			rootCauseNotes: null,
			resolutionDoc: null,
			createdBy: "supervisor@hpcms.local",
			createdAt: new Date("2026-04-25"),
			updatedAt: new Date("2026-04-25"),
			statusTimeline: [
				{ id: "evt-1", status: "detected", note: "First identified by triage lead.", updatedBy: "supervisor@hpcms.local", updatedAt: new Date("2026-04-25T08:00:00") },
				{ id: "evt-2", status: "investigating", note: null, updatedBy: "supervisor@hpcms.local", updatedAt: new Date("2026-04-25T09:30:00") },
			],
			affectedScope: { departments: ["LOA Team"], cohorts: ["HMO patients"], systems: ["Case Management"] },
		}),
	})
}

export function useIncidentUpdateMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.incidents.update.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.incidents.key() }),
		})
	)
}

export function useIncidentAddCaseMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.incidents.addCase.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.incidents.key() }),
		})
	)
}

export function useIncidentRemoveCaseMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.incidents.removeCase.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.incidents.key() }),
		})
	)
}
