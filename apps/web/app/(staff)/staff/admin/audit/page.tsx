import { notFound } from "next/navigation"
import { Suspense } from "react"

import { getSession } from "@/services/better-auth/auth-server"
import { AuditLogTable } from "@/features/staff-admin/components/audit-log-table"

export default async function AdminAuditPage() {
	const session = await getSession()

	if (!session) {
		notFound()
	}

	const role = session.user.role as string
	if (role !== "tenant_admin" && role !== "system_admin") {
		notFound()
	}

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-2xl font-bold">Audit Log</h1>
			<Suspense>
				<AuditLogTable />
			</Suspense>
		</div>
	)
}
