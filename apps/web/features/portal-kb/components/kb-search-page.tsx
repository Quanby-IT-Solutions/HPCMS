"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import type { KbArticleSummary, KbCategory } from "@repo/contracts"

import { Button } from "@/core/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Input } from "@/core/components/ui/input"
import { Skeleton } from "@/core/components/ui/skeleton"
import { useKbSearchQuery } from "@/features/portal-kb/api/kb.hooks"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

export function KbSearchPage() {
	const router = useRouter()
	const params = useSearchParams()
	const [q, setQ] = useState(params.get("q") ?? "")
	const submitted = params.get("q") ?? ""
	const category = params.get("category") ?? undefined

	const { data, isLoading } = useKbSearchQuery(submitted, category)

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		const next = new URLSearchParams()
		if (q.trim()) next.set("q", q.trim())
		if (category) next.set("category", category)
		router.push(`${PORTAL_ROUTES.kb}?${next.toString()}`)
	}

	const articles = data?.articles ?? []
	const categories = data?.categories ?? []
	const popular = data?.popular ?? []

	return (
		<div className="flex flex-col gap-8">
			<header className="flex flex-col gap-3">
				<h1 className="text-2xl font-bold">Knowledge base</h1>
				<form onSubmit={handleSubmit} className="flex gap-2">
					<Input
						value={q}
						onChange={e => setQ(e.target.value)}
						placeholder="Search articles, e.g. 'submit LOA', 'rescheduling appointment'"
						className="flex-1"
					/>
					<Button type="submit">Search</Button>
				</form>
			</header>

			{!submitted ? (
				<>
					<section>
						<h2 className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wider">
							Browse by category
						</h2>
						<ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
							{categories.map((c: KbCategory) => (
								<li key={c.key}>
									<Link
										href={`${PORTAL_ROUTES.kb}?category=${c.key}`}
										className="hover:bg-muted/40 block rounded-md border p-3 transition-colors"
									>
										<p className="text-sm font-semibold">{c.label}</p>
										<p className="text-muted-foreground text-xs">
											{c.articleCount} article{c.articleCount === 1 ? "" : "s"}
										</p>
									</Link>
								</li>
							))}
						</ul>
					</section>

					<section>
						<h2 className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wider">
							Popular articles
						</h2>
						<ul className="flex flex-col gap-2">
							{popular.map((a: KbArticleSummary) => (
								<ArticleRow key={a.slug} article={a} />
							))}
						</ul>
					</section>
				</>
			) : isLoading ? (
				<Skeleton className="h-32 w-full" />
			) : articles.length === 0 ? (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">No results for &quot;{submitted}&quot;</CardTitle>
					</CardHeader>
					<CardContent className="text-muted-foreground flex flex-col gap-3 text-sm">
						<p>Try a different search term, or get help directly:</p>
						<div className="flex flex-wrap gap-2">
							<Link
								href={PORTAL_ROUTES.chatbot}
								className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
							>
								Ask the chatbot
							</Link>
							<Link
								href={PORTAL_ROUTES.chat}
								className="border-border hover:bg-muted inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium"
							>
								Message the team
							</Link>
						</div>
					</CardContent>
				</Card>
			) : (
				<section>
					<p className="text-muted-foreground mb-3 text-xs">
						{articles.length} result{articles.length === 1 ? "" : "s"}
					</p>
					<ul className="flex flex-col gap-2">
						{articles.map((a: KbArticleSummary) => (
							<ArticleRow key={a.slug} article={a} />
						))}
					</ul>
				</section>
			)}
		</div>
	)
}

function ArticleRow({ article }: { article: KbArticleSummary }) {
	return (
		<li>
			<Link
				href={PORTAL_ROUTES.kbArticle(article.slug)}
				className="hover:bg-muted/40 block rounded-md border p-3 transition-colors"
			>
				<p className="text-sm font-semibold">{article.title}</p>
				<p className="text-muted-foreground line-clamp-2 text-xs">{article.excerpt}</p>
				<p className="text-muted-foreground mt-1 text-[10px]">
					{article.category} · {article.helpfulCount} found this helpful
				</p>
			</Link>
		</li>
	)
}
