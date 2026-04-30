"use client"

import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import { useKbArticleQuery, useKbVoteMutation } from "@/features/portal-kb/api/kb.hooks"
import { renderMarkdown } from "@/features/portal-kb/lib/render-markdown"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

export function KbArticlePage({ slug }: { slug: string }) {
	const { data, isLoading } = useKbArticleQuery(slug)
	const vote = useKbVoteMutation()

	if (isLoading || !data) {
		return <Skeleton className="h-64 w-full" />
	}

	function handleVote(helpful: boolean) {
		vote.mutate(
			{ slug, helpful },
			{
				onSuccess: () =>
					toast.success(helpful ? "Thanks for the feedback" : "Got it — we'll improve this"),
				onError: err =>
					toast.error("Could not record vote", { description: (err as Error).message }),
			}
		)
	}

	return (
		<article className="flex flex-col gap-6">
			<nav className="text-muted-foreground flex items-center gap-1 text-xs">
				<Link href={PORTAL_ROUTES.kb} className="hover:underline">
					Knowledge base
				</Link>
				<span aria-hidden>·</span>
				<Link
					href={`${PORTAL_ROUTES.kb}?category=${data.category}`}
					className="capitalize hover:underline"
				>
					{data.category}
				</Link>
			</nav>

			<header>
				<h1 className="text-2xl font-bold">{data.title}</h1>
				<p className="text-muted-foreground mt-1 text-xs">
					Updated {new Date(data.updatedAt).toLocaleDateString()} · {data.helpfulCount}{" "}
					found this helpful
				</p>
			</header>

			<div
				className="prose-portal text-foreground max-w-none text-base leading-relaxed"
				dangerouslySetInnerHTML={{ __html: renderMarkdown(data.bodyMarkdown) }}
			/>

			<section className="bg-muted/30 flex flex-col gap-3 rounded-md p-4 text-sm">
				<p className="font-semibold">Was this helpful?</p>
				<div className="flex items-center gap-2">
					<Button size="sm" onClick={() => handleVote(true)} disabled={vote.isPending}>
						Yes
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => handleVote(false)}
						disabled={vote.isPending}
					>
						No
					</Button>
				</div>
			</section>

			{data.related.length > 0 ? (
				<section>
					<h2 className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wider">
						Related articles
					</h2>
					<ul className="flex flex-col gap-2">
						{data.related.map(r => (
							<li key={r.slug}>
								<Link
									href={PORTAL_ROUTES.kbArticle(r.slug)}
									className="hover:bg-muted/40 block rounded-md border p-3 text-sm transition-colors"
								>
									<p className="font-medium">{r.title}</p>
									<p className="text-muted-foreground text-xs">{r.excerpt}</p>
								</Link>
							</li>
						))}
					</ul>
				</section>
			) : null}
		</article>
	)
}
