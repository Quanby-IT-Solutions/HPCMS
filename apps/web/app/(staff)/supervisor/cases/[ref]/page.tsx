import { CaseDetailPageClient } from "@/features/supervisor-cases/components/case-detail-page-client"

interface Props {
	params: Promise<{ ref: string }>
}

export default async function SupervisorCaseDetailPage({ params }: Props) {
	const { ref } = await params
	return <CaseDetailPageClient caseRef={ref} />
}
