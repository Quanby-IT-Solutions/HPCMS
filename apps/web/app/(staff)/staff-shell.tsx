import { notFound, redirect } from "next/navigation"

import { SignOutButton } from "@/features/auth/components/sign-out-button"
import { NotificationsBellClient } from "@/features/staff-notifications/components/notifications-bell-client"
import { AppShell } from "@/features/shell/components/app-shell"
import { getSession } from "@/services/better-auth/auth-server"

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
		<AppShell
			title={title}
			subtitle={subtitle}
			navGroups={navGroups}
			user={{
				email: session.user.email,
				name: session.user.name,
				role,
			}}
			notificationsSlot={<NotificationsBellClient />}
			signOutSlot={<SignOutButton />}
		>
			{children}
		</AppShell>
	)
}
