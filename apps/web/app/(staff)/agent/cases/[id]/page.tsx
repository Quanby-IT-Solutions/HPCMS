import { CaseDetailShell } from "@/features/agent-case-detail/components/case-detail-shell"

interface AgentCaseDetailPageProps {
	params: Promise<{ id: string }>
}

export default async function AgentCaseDetailPage({ params }: AgentCaseDetailPageProps) {
	const { id } = await params
	return <CaseDetailShell caseRef={id} />
}
