"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Channel, EmailMessage, InboxItem, InboxStatus } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

interface InboxFilters {
	channel?: Channel
	status?: InboxStatus
	assignedAgentId?: string
	dateFrom?: string
	dateTo?: string
	sort?: "recent" | "priority" | "unanswered"
	page?: number
	limit?: number
}

function mockItems(): InboxItem[] {
	const now = Date.now()
	return [
		{
			id: "ix-1",
			channel: "email",
			subject: "LOA follow-up: HMO requesting documents",
			preview: "Hi, the HMO replied saying they need additional supporting documents…",
			senderName: "patient@example.com",
			senderHandle: null,
			patientId: "patient-maria-santos",
			patientName: "Maria Santos",
			caseRef: "LOA-2026-00128",
			status: "new",
			receivedAt: new Date(now - 30 * 60 * 1000),
			unansweredMinutes: 30,
			aiSuggestion: {
				categoryKey: "loa_followup",
				categoryLabel: "LOA follow-up",
				confidence: 0.92,
				model: "gpt-stub",
				suggestedCaseType: "loa",
				routingTeam: "Case Agents — LOA team",
			},
			hasAttachments: true,
		},
		{
			id: "ix-2",
			channel: "phone",
			subject: "Phone call · Outpatient inquiry",
			preview: "Patient called asking about preferred provider list…",
			senderName: "Reception desk",
			senderHandle: null,
			patientId: null,
			patientName: null,
			caseRef: null,
			status: "in_progress",
			receivedAt: new Date(now - 4 * 60 * 60 * 1000),
			unansweredMinutes: null,
			aiSuggestion: null,
			hasAttachments: false,
		},
		{
			id: "ix-3",
			channel: "social_media",
			subject: "Facebook complaint about wait time",
			preview: "@anonymous: Waited 3 hours at the ER on Tuesday…",
			senderName: null,
			senderHandle: "@anonymous",
			patientId: null,
			patientName: "Anonymous",
			caseRef: null,
			status: "new",
			receivedAt: new Date(now - 26 * 60 * 60 * 1000),
			unansweredMinutes: 26 * 60,
			aiSuggestion: {
				categoryKey: "complaint",
				categoryLabel: "Complaint",
				confidence: 0.78,
				model: "gpt-stub",
				suggestedCaseType: "complaint",
				routingTeam: "Patient Experience",
			},
			hasAttachments: false,
			socialPlatform: "facebook",
		},
		{
			id: "ix-4",
			channel: "portal_chat",
			subject: "Portal chat with Anna Tan",
			preview: "Hi, I wanted to ask about my medication schedule…",
			senderName: "Anna Tan",
			senderHandle: null,
			patientId: "patient-anna-tan",
			patientName: "Anna Tan",
			caseRef: null,
			status: "linked",
			receivedAt: new Date(now - 90 * 60 * 1000),
			unansweredMinutes: 0,
			aiSuggestion: {
				categoryKey: "medication_query",
				categoryLabel: "Medication query",
				confidence: 0.65,
				model: "gpt-stub",
				suggestedCaseType: "follow_up",
				routingTeam: "Clinical Coordinators",
			},
			hasAttachments: false,
		},
	]
}

const MOCK_EMAIL_THREAD: EmailMessage[] = [
	{
		id: "em-1-in",
		from: "patient@example.com",
		to: ["agent@hpcms.local"],
		cc: [],
		subject: "LOA follow-up: HMO requesting documents",
		bodyHtml:
			"<p>Hi, the HMO replied saying they need additional supporting documents for the LOA. Could you advise on next steps?</p>",
		bodyText:
			"Hi, the HMO replied saying they need additional supporting documents for the LOA. Could you advise on next steps?",
		sentAt: new Date(Date.now() - 30 * 60 * 1000),
		direction: "inbound",
		attachments: [{ id: "att-1", filename: "hmo-reply.pdf", sizeBytes: 124_000 }],
	},
]

export function useInboxListQuery(filters: InboxFilters = {}) {
	return useQuery({
		...orpc.inbox.list.queryOptions({
			input: {
				channel: filters.channel,
				status: filters.status,
				assignedAgentId: filters.assignedAgentId,
				dateFrom: filters.dateFrom,
				dateTo: filters.dateTo,
				sort: filters.sort ?? "recent",
				page: filters.page ?? 1,
				limit: filters.limit ?? 25,
			},
		}),
		staleTime: 15 * 1000,
		initialData: {
			items: mockItems(),
			total: 4,
			page: filters.page ?? 1,
			pageSize: filters.limit ?? 25,
		} as never,
		retry: false,
	})
}

function buildPlaceholderItem(id: string) {
	const found = mockItems().find(x => x.id === id)
	if (!found) return undefined
	return {
		item: found,
		emailThread: id === "ix-1" ? MOCK_EMAIL_THREAD : null,
		transcript:
			id === "ix-2"
				? "Patient called asking about provider list. Agent emailed list and offered to schedule a callback."
				: null,
		chatMessages:
			id === "ix-4"
				? [
						{
							id: "ch-1",
							direction: "inbound" as const,
							body: "Hi, I wanted to ask about my medication schedule…",
							sentAt: new Date(Date.now() - 90 * 60 * 1000),
						},
					]
				: null,
		socialPost:
			id === "ix-3"
				? {
						platform: "facebook" as const,
						handle: "@anonymous",
						postUrl: null,
						content: "Waited 3 hours at the ER on Tuesday…",
					}
				: null,
	}
}

export function useInboxItemQuery(id: string | null) {
	return useQuery({
		...orpc.inbox.get.queryOptions({ input: { id: id ?? "" } }),
		enabled: !!id,
		initialData: (id ? buildPlaceholderItem(id) : undefined) as never,
		retry: false,
	})
}

export function useAttachToCaseMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.inbox.attachToCase.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.inbox.list.key() })
				queryClient.invalidateQueries({ queryKey: orpc.inbox.get.key() })
			},
		})
	)
}

export function useResolveInboxMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.inbox.resolve.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.inbox.list.key() })
				queryClient.invalidateQueries({ queryKey: orpc.inbox.get.key() })
			},
		})
	)
}
