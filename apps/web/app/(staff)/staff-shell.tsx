import { notFound, redirect } from "next/navigation"

import { SignOutButton } from "@/features/auth/components/sign-out-button"
import { NotificationsBell } from "@/features/staff-notifications/components/notifications-bell"
import { getSession } from "@/services/better-auth/auth-server"
import { StaffShellNav } from "@/app/(staff)/staff-shell-nav"

export interface StaffShellNavItem {
	href: string
	label: string
	icon?: React.ReactNode
}

export interface StaffShellNavGroup {
	label: string
	items: StaffShellNavItem[]
}

interface StaffShellProps {
	title: string
	subtitle?: string
	navGroups: StaffShellNavGroup[]
	children: React.ReactNode
	allowedRoles: readonly string[]
}

/**
 * Generic shell shared by /staff and /agent route groups.
 *
 * Handles session resolution, role gating, and the standard chrome
 * (240px sidebar + sticky header with notifications + sign-out).
 */
export async function StaffShell({
	title,
	subtitle,
	navGroups,
	children,
	allowedRoles,
}: StaffShellProps) {
	const session = await getSession()

	if (!session) {
		redirect("/login")
	}

	const role = session.user.role as string

	if (!allowedRoles.includes(role)) {
		notFound()
	}

	return (
		<div className="bg-background grid min-h-screen grid-cols-[240px_1fr]">
			<aside className="border-r">
				<div className="border-b px-4 py-3">
					<p className="text-foreground text-sm font-semibold leading-tight">{title}</p>
					{subtitle ? (
						<p className="text-muted-foreground mt-0.5 text-[11px] leading-tight">
							{subtitle}
						</p>
					) : null}
				</div>
				<StaffShellNav navGroups={navGroups} />
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
