"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { SupervisorKbArticle, SupervisorKbCategory } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

export function useKbArticleListQuery(params: Record<string, unknown> = {}) {
	return useQuery({
		...orpc.supervisor.kb.listArticles.queryOptions({ input: params }),
		placeholderData: () => ({
			rows: [
				{ id: "art-1", title: "LOA Request Guide", categoryId: "cat-1", categoryName: "LOA", tags: ["loa", "guide"], bodyMarkdown: "# LOA Guide\n\nStep-by-step guide for LOA requests.", status: "published" as const, publishedAt: new Date("2026-03-01"), createdBy: "supervisor@hpcms.local", createdAt: new Date("2026-02-28"), updatedAt: new Date("2026-03-01") },
				{ id: "art-2", title: "Billing FAQ", categoryId: "cat-2", categoryName: "Billing", tags: ["billing", "faq"], bodyMarkdown: "# Billing FAQ\n\nFrequently asked billing questions.", status: "draft" as const, publishedAt: null, createdBy: "supervisor@hpcms.local", createdAt: new Date("2026-04-01"), updatedAt: new Date("2026-04-01") },
			] as SupervisorKbArticle[],
			total: 2,
		}),
	})
}

export function useKbGetArticleQuery(id: string | undefined) {
	return useQuery({
		...orpc.supervisor.kb.getArticle.queryOptions({ input: { id: id ?? "" } }),
		enabled: !!id,
		placeholderData: (): SupervisorKbArticle => ({
			id: id ?? "",
			title: "",
			categoryId: null,
			categoryName: null,
			tags: [],
			bodyMarkdown: "",
			status: "draft",
			publishedAt: null,
			createdBy: "",
			createdAt: new Date(),
			updatedAt: new Date(),
		}),
	})
}

export function useKbCreateArticleMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.kb.createArticle.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.kb.key() }),
		})
	)
}

export function useKbUpdateArticleMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.kb.updateArticle.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.kb.key() }),
		})
	)
}

export function useKbPublishMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.kb.publish.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.kb.key() }),
		})
	)
}

export function useKbCategoryListQuery() {
	return useQuery({
		...orpc.supervisor.kb.listCategories.queryOptions({ input: {} }),
		placeholderData: () => [
			{ id: "cat-1", name: "LOA", parentId: null, articleCount: 1 },
			{ id: "cat-2", name: "Billing", parentId: null, articleCount: 1 },
			{ id: "cat-3", name: "Complaints", parentId: null, articleCount: 0 },
		] as SupervisorKbCategory[],
	})
}

export function useKbUpsertCategoryMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.kb.upsertCategory.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.kb.key() }),
		})
	)
}

export function useKbDeleteCategoryMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.kb.deleteCategory.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.kb.key() }),
		})
	)
}
