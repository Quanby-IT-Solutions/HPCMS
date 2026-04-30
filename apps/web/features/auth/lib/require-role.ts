import "server-only"

import { redirect } from "next/navigation"

import { getSession } from "@/services/better-auth/auth-server"

export async function requireRole(
	allowedRoles: readonly string[],
): Promise<{ user: { id: string; role: string; name: string; email: string } }> {
	const session = await getSession()

	if (!session?.user) {
		redirect("/login")
	}

	const role = (session.user as { role?: string }).role ?? ""

	if (!allowedRoles.includes(role)) {
		redirect("/dashboard")
	}

	return session as { user: { id: string; role: string; name: string; email: string } }
}
