import { redirect } from "next/navigation"

import { getSession } from "@/services/better-auth/auth-server"

export default async function StaffRootPage() {
	const session = await getSession()
	const role = session?.user.role

	if (role === "system_admin" || role === "tenant_admin") {
		redirect("/staff/admin")
	}
	redirect("/agent")
}
