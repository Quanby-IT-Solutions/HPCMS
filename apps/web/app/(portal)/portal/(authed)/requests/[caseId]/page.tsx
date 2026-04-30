import Link from "next/link"

import { ChevronLeft } from "@/core/components/icons"
import { CaseDetail } from "@/features/portal-my-requests/components/case-detail"

interface Props {
	params: Promise<{ caseId: string }>
}

export default async function RequestDetailPage({ params }: Props) {
	const { caseId } = await params
	return (
		<div className="flex flex-col gap-6">
			<div>
				<Link
					href="/portal/requests"
					className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground -ml-2"
				>
					<ChevronLeft className="mr-1 size-4" />
					Back to My Requests
				</Link>
			</div>
			<CaseDetail caseRef={caseId} />
		</div>
	)
}
