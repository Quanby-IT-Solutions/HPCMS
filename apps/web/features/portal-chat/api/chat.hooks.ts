"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { PortalChatMessage, PortalChatThread } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

const MOCK_THREADS: PortalChatThread[] = [
	{
		id: "thread-1",
		caseRef: "LOA-2026-00128",
		subject: "LOA-2026-00128 — additional documents",
		preview: "Please share a clearer photo of your HMO ID.",
		unreadCount: 1,
		lastMessageAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
	},
	{
		id: "thread-2",
		caseRef: null,
		subject: "Account verification follow-up",
		preview: "Thanks for sending the proof of identity.",
		unreadCount: 0,
		lastMessageAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
	},
]

function buildMockMessages(threadId: string): PortalChatMessage[] {
	const now = Date.now()
	return [
		{
			id: `${threadId}-m1`,
			threadId,
			direction: "inbound",
			body: "Hi! We need a clearer photo of your HMO ID to proceed.",
			attachments: [],
			sentAt: new Date(now - 4 * 60 * 60 * 1000),
			readAt: new Date(now - 3 * 60 * 60 * 1000),
		},
		{
			id: `${threadId}-m2`,
			threadId,
			direction: "outbound",
			body: "Sure — uploading now.",
			attachments: [],
			sentAt: new Date(now - 3 * 60 * 60 * 1000),
			readAt: new Date(now - 3 * 60 * 60 * 1000),
		},
		{
			id: `${threadId}-m3`,
			threadId,
			direction: "inbound",
			body: "Got it. We'll move your case forward.",
			attachments: [],
			sentAt: new Date(now - 2 * 60 * 60 * 1000),
			readAt: null,
		},
	]
}

export function usePortalChatThreadsQuery() {
	return useQuery({
		...orpc.portalChat.listThreads.queryOptions({ input: {} }),
		staleTime: 30 * 1000,
		refetchInterval: 30 * 1000,
		placeholderData: () => ({ threads: MOCK_THREADS }),
	})
}

export function usePortalChatThreadQuery(threadId: string) {
	return useQuery({
		...orpc.portalChat.getThread.queryOptions({ input: { threadId } }),
		staleTime: 15 * 1000,
		refetchInterval: 30 * 1000,
		placeholderData: () => ({
			thread:
				MOCK_THREADS.find(t => t.id === threadId) ??
				({
					id: threadId,
					caseRef: null,
					subject: "Conversation",
					preview: "",
					unreadCount: 0,
					lastMessageAt: new Date(),
				} satisfies PortalChatThread),
			messages: buildMockMessages(threadId),
		}),
	})
}

export function useSendPortalChatMessageMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.portalChat.sendMessage.mutationOptions({
			// Optimistic insert so the patient's message appears immediately
			// (PAT-FE-12 AC: "Sending a message persists and appears immediately").
			onMutate: input => {
				const key = orpc.portalChat.getThread.key({ input: { threadId: input.threadId } })
				const previous = queryClient.getQueryData<{
					thread: PortalChatThread
					messages: PortalChatMessage[]
				}>(key)
				const optimistic: PortalChatMessage = {
					id: `optimistic-${crypto.randomUUID()}`,
					threadId: input.threadId,
					direction: "outbound",
					body: input.body,
					attachments: [],
					sentAt: new Date(),
					readAt: null,
				}
				if (previous) {
					queryClient.setQueryData(key, {
						thread: previous.thread,
						messages: [...previous.messages, optimistic],
					})
				}
				return { previous, key }
			},
			onError: (_err, _input, ctx) => {
				if (ctx?.previous) queryClient.setQueryData(ctx.key, ctx.previous)
			},
			onSettled: () => {
				queryClient.invalidateQueries({ queryKey: orpc.portalChat.getThread.key() })
				queryClient.invalidateQueries({ queryKey: orpc.portalChat.listThreads.key() })
			},
		})
	)
}
