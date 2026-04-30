"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { KbArticle, KbArticleSummary, KbCategory } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

const MOCK_CATEGORIES: KbCategory[] = [
	{ key: "loa", label: "LOA & Authorizations", icon: "shield", articleCount: 5 },
	{ key: "billing", label: "Billing & Insurance", icon: "credit-card", articleCount: 8 },
	{ key: "appointments", label: "Appointments", icon: "calendar", articleCount: 4 },
	{ key: "medication", label: "Medication", icon: "pill", articleCount: 3 },
]

const MOCK_ARTICLES: KbArticleSummary[] = [
	{
		slug: "how-to-submit-loa",
		title: "How to submit an LOA request",
		excerpt: "Step-by-step guide to submitting a Letter of Authorization at SLMC.",
		category: "loa",
		updatedAt: new Date("2026-04-01"),
		helpfulCount: 124,
	},
	{
		slug: "loa-required-documents",
		title: "LOA: required documents and ID rules",
		excerpt: "Which IDs are accepted and what your admitting order needs to include.",
		category: "loa",
		updatedAt: new Date("2026-03-15"),
		helpfulCount: 88,
	},
	{
		slug: "billing-questions",
		title: "Common billing questions",
		excerpt: "What's covered, payment timelines, and how to dispute a charge.",
		category: "billing",
		updatedAt: new Date("2026-02-20"),
		helpfulCount: 56,
	},
	{
		slug: "appointment-rescheduling",
		title: "Rescheduling an appointment",
		excerpt: "Use the portal or call our coordinators to reschedule.",
		category: "appointments",
		updatedAt: new Date("2026-04-12"),
		helpfulCount: 31,
	},
]

function mockArticleBody(slug: string): KbArticle {
	const summary = MOCK_ARTICLES.find(a => a.slug === slug) ?? MOCK_ARTICLES[0]!
	return {
		slug: summary.slug,
		title: summary.title,
		category: summary.category,
		tags: [summary.category],
		updatedAt: summary.updatedAt,
		helpfulCount: summary.helpfulCount,
		notHelpfulCount: 4,
		bodyMarkdown: `# ${summary.title}\n\n${summary.excerpt}\n\n## Steps\n\n1. Gather your admitting order, valid ID, and HMO ID.\n2. Open the LOA form on your patient portal.\n3. Fill in the consultation date, preferred doctor, and chief complaint.\n4. Upload your documents and review the summary.\n5. Submit. You'll get a case reference by email.\n\n## What happens next\n\nA care coordinator reviews your request within 1 business day. You'll see status updates on **My Requests** and receive notifications.\n\nIf you have questions, [open the chatbot](/portal/chatbot) or reach the team via [secure chat](/portal/chat).`,
		related: MOCK_ARTICLES.filter(a => a.slug !== slug && a.category === summary.category).slice(0, 3),
	}
}

export function useKbSearchQuery(q: string, category?: string) {
	return useQuery({
		...orpc.kb.search.queryOptions({ input: { q, category, limit: 20 } }),
		staleTime: 60 * 1000,
		placeholderData: () => {
			const trimmed = q.trim().toLowerCase()
			const filtered = trimmed.length === 0
				? MOCK_ARTICLES
				: MOCK_ARTICLES.filter(a =>
					`${a.title} ${a.excerpt} ${a.category}`.toLowerCase().includes(trimmed)
				)
			return {
				articles: category ? filtered.filter(a => a.category === category) : filtered,
				categories: MOCK_CATEGORIES,
				popular: MOCK_ARTICLES.slice(0, 3),
			}
		},
	})
}

export function useKbArticleQuery(slug: string) {
	return useQuery({
		...orpc.kb.getArticle.queryOptions({ input: { slug } }),
		placeholderData: mockArticleBody(slug),
	})
}

export function useKbVoteMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.kb.voteFeedback.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.kb.getArticle.key() })
			},
		})
	)
}
