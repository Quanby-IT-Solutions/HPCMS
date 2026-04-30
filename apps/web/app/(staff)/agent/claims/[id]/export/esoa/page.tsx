import { XmlPreviewPage } from "@/features/agent-claims/components/xml-preview-page"

interface Props {
	params: Promise<{ id: string }>
}

export default async function EsoaPreview({ params }: Props) {
	const { id } = await params
	return <XmlPreviewPage claimId={id} kind="esoa" />
}
