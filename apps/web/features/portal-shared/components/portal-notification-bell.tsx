"use client"

import Link from "next/link"

import { Bell } from "@/core/components/icons"
import { useNotificationsListQuery } from "@/features/portal-notifications/api/notifications.hooks"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

export function PortalNotificationBell() {
	const { data } = useNotificationsListQuery({ unreadOnly: true, limit: 1 })
	const unread = data?.unreadCount ?? 0

	return (
		<Link
			href={PORTAL_ROUTES.notifications}
			className="text-muted-foreground hover:text-foreground relative inline-flex items-center gap-1"
			aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
		>
			<Bell className="size-4" />
			{unread > 0 ? (
				<span className="bg-primary text-primary-foreground absolute -right-2 -top-1 inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none">
					{unread > 99 ? "99+" : unread}
				</span>
			) : null}
			<span className="sr-only">Notifications</span>
		</Link>
	)
}
