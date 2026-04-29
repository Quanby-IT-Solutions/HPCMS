import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "@/core/components/icons"

import { buttonVariants } from "@/core/components/ui/button"
import { cn } from "@/core/lib/utils"
import { getSession } from "@/services/better-auth/auth-server"
import { CaseDetail } from "@/features/portal-my-requests/components/case-detail"

interface PageProps {
	params: Promise<{ ref: string }>
}

export default async function CaseDetailPage({ params }: PageProps) {
	const session = await getSession()

	if (!session) {
		redirect("/login")
	}

	const { ref } = await params

	return (
		<div className="flex flex-col gap-6">
			<div>
				<Link
					href="/portal/my-requests"
					className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
				>
					<ChevronLeft className="mr-1 size-4" />
					Back to My Requests
				</Link>
			</div>
			<CaseDetail caseRef={ref} />
		</div>
	)
}
