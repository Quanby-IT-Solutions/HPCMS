"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { ChatbotMessage } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

export function useChatbotStartSessionMutation() {
	return useMutation(orpc.chatbot.startSession.mutationOptions())
}

export function useChatbotSendMessageMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.chatbot.sendMessage.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.chatbot.startSession.key() })
			},
		})
	)
}

export function useChatbotEscalateMutation() {
	return useMutation(orpc.chatbot.escalate.mutationOptions())
}

export function buildGreetingMessages(): ChatbotMessage[] {
	return [
		{
			id: "bot-greeting",
			role: "bot",
			body: "Hi! I'm the SLMC assistant. How can I help today?",
			intent: "greeting",
			quickReplies: [
				{ key: "submit_request", label: "Submit a request", intent: "submit_request", href: null },
				{ key: "track_request", label: "Track my request", intent: "track_request", href: "/portal/requests" },
				{ key: "find_info", label: "Find information", intent: "find_info", href: "/portal/kb" },
				{ key: "ask_question", label: "Ask a question", intent: "ask_question", href: null },
				{ key: "schedule_consult", label: "Schedule a consultation", intent: "schedule_consult", href: null },
				{ key: "escalate", label: "Talk to a person", intent: "escalate", href: null },
			],
			relatedArticles: [],
			sentAt: new Date(),
		},
	]
}

export function buildBotReply(intent: string): ChatbotMessage {
	switch (intent) {
		case "submit_request":
			return {
				id: `bot-${Date.now()}`,
				role: "bot",
				body: "Sure — I'll take you to the LOA request form. You'll need your admitting order, valid ID, and HMO ID.",
				intent: "submit_request",
				quickReplies: [
					{
						key: "open_loa",
						label: "Open LOA form",
						intent: null,
						href: "/portal/loa/new",
					},
				],
				relatedArticles: [],
				sentAt: new Date(),
			}
		case "ask_question":
			return {
				id: `bot-${Date.now()}`,
				role: "bot",
				body: "Sure — type your question and I'll do my best. If I'm not sure, I'll connect you to the team.",
				intent: "ask_question",
				quickReplies: [
					{ key: "escalate", label: "Talk to a person", intent: "escalate", href: null },
				],
				relatedArticles: [],
				sentAt: new Date(),
			}
		case "find_info":
			return {
				id: `bot-${Date.now()}`,
				role: "bot",
				body: "Here are some popular articles. You can also search the knowledge base.",
				intent: "find_info",
				quickReplies: [
					{ key: "browse_kb", label: "Browse knowledge base", intent: null, href: "/portal/kb" },
				],
				relatedArticles: [
					{ slug: "how-to-submit-loa", title: "How to submit an LOA request" },
					{ slug: "loa-required-documents", title: "LOA: required documents" },
				],
				sentAt: new Date(),
			}
		case "schedule_consult":
			return {
				id: `bot-${Date.now()}`,
				role: "bot",
				body: "Tell me your preferred date, time, and specialty. I'll forward this to a coordinator.",
				intent: "schedule_consult",
				quickReplies: [],
				relatedArticles: [],
				sentAt: new Date(),
			}
		case "track_request":
			return {
				id: `bot-${Date.now()}`,
				role: "bot",
				body: "You can see live status updates on your requests page.",
				intent: "track_request",
				quickReplies: [
					{ key: "open_requests", label: "Open my requests", intent: null, href: "/portal/requests" },
				],
				relatedArticles: [],
				sentAt: new Date(),
			}
		case "escalate":
			return {
				id: `bot-${Date.now()}`,
				role: "bot",
				body: "Connecting you to a coordinator. You can continue the conversation in secure chat.",
				intent: "escalate",
				quickReplies: [
					{ key: "open_chat", label: "Open secure chat", intent: null, href: "/portal/chat" },
				],
				relatedArticles: [],
				sentAt: new Date(),
			}
		default:
			return {
				id: `bot-${Date.now()}`,
				role: "bot",
				body: "Got it. Anything else I can help with?",
				intent: "freeform",
				quickReplies: [
					{ key: "escalate", label: "Talk to a person", intent: "escalate", href: null },
				],
				relatedArticles: [],
				sentAt: new Date(),
			}
	}
}
