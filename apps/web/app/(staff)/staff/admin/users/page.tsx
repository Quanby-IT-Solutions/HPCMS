import { notFound } from "next/navigation"

import { getSession } from "@/services/better-auth/auth-server"
import { UsersTable } from "@/features/staff-admin/components/users-table"

export default async function AdminUsersPage() {
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
			<h1 className="text-2xl font-bold">Users</h1>
			<UsersTable
				currentUserRole={role}
				currentTenantId={session.user.tenantId}
			/>
		</div>
	)
}
