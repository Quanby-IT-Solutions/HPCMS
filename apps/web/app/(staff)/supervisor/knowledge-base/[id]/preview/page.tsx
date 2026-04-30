import { ArticlePreviewClient } from "@/features/supervisor-kb/components/article-preview-client"

interface Props {
	params: Promise<{ id: string }>
}

export default async function SupervisorKbPreviewPage({ params }: Props) {
	const { id } = await params
	return <ArticlePreviewClient articleId={id} />
}
