import { ClaimDetailPage } from "@/features/agent-claims/components/claim-detail-page"

interface Props {
	params: Promise<{ id: string }>
}

export default async function AgentClaimDetailPage({ params }: Props) {
	const { id } = await params
	return <ClaimDetailPage claimId={id} />
}
