import Link from "next/link"
import { redirect } from "next/navigation"
import { PlusCircle } from "@/core/components/icons"

import { buttonVariants } from "@/core/components/ui/button"
import { cn } from "@/core/lib/utils"
import { getSession } from "@/services/better-auth/auth-server"
import { RequestsList } from "@/features/portal-my-requests/components/requests-list"

export default async function MyRequestsPage() {
	const session = await getSession()

	if (!session) {
		redirect("/login")
	}

	const hasLinkedPatient = !!(session.user as { patientId?: string }).patientId

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">My Requests</h1>
					<p className="text-muted-foreground mt-1 text-sm">
						Track and manage your LOA requests.
					</p>
				</div>
				{hasLinkedPatient && (
					<Link href="/portal/loa/new" className={cn(buttonVariants())}>
						<PlusCircle className="mr-2 size-4" />
						New Request
					</Link>
				)}
			</div>

			<RequestsList hasLinkedPatient={hasLinkedPatient} />
		</div>
	)
}
