import Link from "next/link"

import { PlusCircle } from "@/core/components/icons"
import { RequestsList } from "@/features/portal-my-requests/components/requests-list"
import { getSession } from "@/services/better-auth/auth-server"

export default async function RequestsPage() {
	const session = await getSession()
	const hasLinkedPatient = !!(session?.user as { patientId?: string } | undefined)?.patientId

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
					<Link href="/portal/loa/new" className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
						<PlusCircle className="mr-2 size-4" />
						New Request
					</Link>
				)}
			</div>

			<RequestsList hasLinkedPatient={hasLinkedPatient} />
		</div>
	)
}
