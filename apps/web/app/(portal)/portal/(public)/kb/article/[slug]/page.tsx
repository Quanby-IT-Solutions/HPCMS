import { KbArticlePage } from "@/features/portal-kb/components/kb-article-page"

interface Props {
	params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: Props) {
	const { slug } = await params
	return <KbArticlePage slug={slug} />
}
