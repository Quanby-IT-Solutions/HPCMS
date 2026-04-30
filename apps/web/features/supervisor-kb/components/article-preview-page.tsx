"use client"

import Link from "next/link"

import type { SupervisorKbArticle } from "@repo/contracts"

import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
import { Button } from "@/core/components/ui/button"

interface Props {
	article: SupervisorKbArticle
}

function renderMarkdownLine(line: string, idx: number): React.ReactNode {
	if (line.startsWith("## ")) return <h2 key={idx} className="text-xl font-semibold mt-4 mb-2">{line.slice(3)}</h2>
	if (line.startsWith("# ")) return <h1 key={idx} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>
	if (line.startsWith("- ")) return <li key={idx} className="ml-4 list-disc">{line.slice(2)}</li>
	if (line === "") return <br key={idx} />
	return <p key={idx} className="my-1">{line}</p>
}

export function ArticlePreviewPage({ article }: Props) {
	return (
		<div className="mx-auto max-w-2xl">
			<div className="mb-6 flex items-center justify-between">
				<nav className="text-muted-foreground text-xs">
					<Link href={SUPERVISOR_ROUTES.knowledgeBase} className="hover:underline">Knowledge Base</Link>
					{article.categoryName ? (
						<> / <span>{article.categoryName}</span></>
					) : null}
				</nav>
				<Link href={SUPERVISOR_ROUTES.kbArticleEdit(article.id)}>
					<Button variant="outline" size="sm">Edit</Button>
				</Link>
			</div>

			<article className="prose prose-sm max-w-none">
				<h1 className="text-2xl font-bold">{article.title}</h1>
				{article.publishedAt ? (
					<p className="text-muted-foreground text-sm mt-1">
						Published {new Date(article.publishedAt).toLocaleDateString()}
					</p>
				) : (
					<p className="text-yellow-600 text-sm mt-1 font-medium">Draft — not published</p>
				)}
				{article.tags.length > 0 ? (
					<div className="mt-2 flex flex-wrap gap-1">
						{article.tags.map(t => (
							<span key={t} className="bg-muted rounded-full px-2 py-0.5 text-[11px]">{t}</span>
						))}
					</div>
				) : null}
				<div className="prose max-w-none mt-6">
					{(article.bodyMarkdown ?? "").split("\n").map(renderMarkdownLine)}
				</div>
			</article>
		</div>
	)
}
