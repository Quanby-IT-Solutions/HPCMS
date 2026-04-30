"use client"

import { Skeleton } from "@/core/components/ui/skeleton"
import { useKbGetArticleQuery } from "@/features/supervisor-kb/api/supervisor-kb.hooks"
import { ArticlePreviewPage } from "@/features/supervisor-kb/components/article-preview-page"

interface Props {
	articleId: string
}

export function ArticlePreviewClient({ articleId }: Props) {
	const { data, isLoading } = useKbGetArticleQuery(articleId)
	if (isLoading || !data?.title) {
		return (
			<div className="mx-auto max-w-2xl flex flex-col gap-3">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-48 w-full" />
			</div>
		)
	}
	return <ArticlePreviewPage article={data} />
}
