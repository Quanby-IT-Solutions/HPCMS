"use client"

import { useQuery } from "@tanstack/react-query"

import type { TimelineEntry } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

interface TimelineFilters {
	channel?: string
	caseType?: string
	agentId?: string
	dateFrom?: string
	dateTo?: string
	page?: number
}

function buildMockTimeline(patientId: string): TimelineEntry[] {
	const now = Date.now()
	return [
		{
			id: `${patientId}-tl-1`,
			kind: "email",
			occurredAt: new Date(now - 4 * 60 * 60 * 1000),
			channel: "email",
			caseRef: "LOA-2026-00128",
			actorName: "J. Reyes",
			title: "Reply: HMO supporting documents requested",
			preview: "Forwarded the additional documents and noted in the case file…",
			body: null,
		},
		{
			id: `${patientId}-tl-2`,
			kind: "phone",
			occurredAt: new Date(now - 26 * 60 * 60 * 1000),
			channel: "phone",
			caseRef: null,
			actorName: "M. Cruz",
			title: "Inbound call · 8 min · LOA inquiry",
			preview: "Patient called asking for status update on the LOA request…",
			body: null,
		},
		{
			id: `${patientId}-tl-3`,
			kind: "case_event",
			occurredAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
			channel: null,
			caseRef: "LOA-2026-00128",
			actorName: null,
			title: "Case opened (LOA-2026-00128)",
			preview: "Patient submitted LOA request via the portal.",
			body: null,
		},
		{
			id: `${patientId}-tl-4`,
			kind: "fhir_event",
			occurredAt: new Date(now - 5 * 24 * 60 * 60 * 1000),
			channel: null,
			caseRef: null,
			actorName: "FHIR sync",
			title: "FHIR Patient resource synced",
			preview: "Pulled latest demographics + AllergyIntolerance from EMR.",
			body: null,
		},
		{
			id: `${patientId}-tl-5`,
			kind: "consent_event",
			occurredAt: new Date(now - 60 * 24 * 60 * 60 * 1000),
			channel: null,
			caseRef: null,
			actorName: "Patient",
			title: "DPA acknowledgement",
			preview: "Patient signed Data Privacy Act acknowledgement during onboarding.",
			body: null,
		},
	]
}

export function usePatientTimelineQuery(patientId: string, filters: TimelineFilters = {}) {
	return useQuery({
		...orpc.patient.timeline.list.queryOptions({
			input: {
				patientId,
				channel: filters.channel,
				caseType: filters.caseType,
				agentId: filters.agentId,
				dateFrom: filters.dateFrom,
				dateTo: filters.dateTo,
				page: filters.page ?? 1,
				limit: 50,
			},
		}),
		staleTime: 30 * 1000,
		placeholderData: {
			entries: buildMockTimeline(patientId),
			total: 5,
			page: 1,
			pageSize: 50,
		},
	})
}
