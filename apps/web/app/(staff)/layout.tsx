import { notFound, redirect } from "next/navigation"

import { SignOutButton } from "@/features/auth/components/sign-out-button"
import { NotificationsBell } from "@/features/staff-notifications/components/notifications-bell"
import { getSession } from "@/services/better-auth/auth-server"

const ADMIN_ROLES = ["tenant_admin", "system_admin"]

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
	const session = await getSession()

	if (!session) {
		redirect("/login")
	}

	if (session.user.role === "patient") {
		notFound()
	}

	const role = session.user.role as string
	const isAdmin = ADMIN_ROLES.includes(role)

	return (
		<div className="bg-background grid min-h-screen grid-cols-[240px_1fr]">
			<aside className="border-r">
				<div className="flex flex-col gap-1 p-4">
					<p className="text-muted-foreground mb-2 px-2 text-xs font-semibold uppercase tracking-wider">
						Staff Console
					</p>
					<a
						href="/staff/cases"
						className="hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
					>
						Cases
					</a>

					{isAdmin && (
						<>
							<p className="text-muted-foreground mt-4 mb-1 px-2 text-xs font-semibold uppercase tracking-wider">
								Admin
							</p>
							<a
								href="/staff/admin/users"
								className="hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
							>
								Users
							</a>
							<a
								href="/staff/admin/audit"
								className="hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
							>
								Audit Log
							</a>
						</>
					)}
				</div>
			</aside>
			<div className="flex flex-col">
				<header className="border-b px-6 py-3">
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground text-sm capitalize">
							{role?.replace(/_/g, " ")}
						</span>
						<div className="flex items-center gap-3">
							<NotificationsBell />
							<span className="text-muted-foreground text-sm">{session.user.email}</span>
							<SignOutButton />
						</div>
					</div>
				</header>
				<main className="p-6">{children}</main>
			</div>
		</div>
	)
}
