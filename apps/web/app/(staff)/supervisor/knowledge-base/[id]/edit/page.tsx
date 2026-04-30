import { ArticleEditor } from "@/features/supervisor-kb/components/article-editor"

interface Props {
	params: Promise<{ id: string }>
}

export default async function SupervisorKbEditPage({ params }: Props) {
	const { id } = await params
	return <ArticleEditor articleId={id === "new" ? undefined : id} />
}
