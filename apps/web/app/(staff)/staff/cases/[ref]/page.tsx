import { CaseSidePanel } from "@/features/staff-case-detail/components/case-side-panel"

interface CaseDetailPageProps {
	params: Promise<{ ref: string }>
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
	const { ref } = await params

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-2xl font-bold">Case Detail</h1>
			<CaseSidePanel caseRef={ref} mode="full" />
		</div>
	)
}
