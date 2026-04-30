"use client"

import Link from "next/link"
import { toast } from "sonner"

import type { Notification } from "@repo/contracts"

import { Bell } from "@/core/components/icons"
import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	useMarkAllNotificationsReadMutation,
	useMarkNotificationsReadMutation,
	useNotificationsListQuery,
} from "@/features/portal-notifications/api/notifications.hooks"

function formatRelative(d: Date | string): string {
	const date = d instanceof Date ? d : new Date(d)
	const minutes = Math.round((Date.now() - date.getTime()) / 60_000)
	if (minutes < 1) return "just now"
	if (minutes < 60) return `${minutes}m ago`
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return `${hours}h ago`
	const days = Math.floor(hours / 24)
	if (days < 7) return `${days}d ago`
	return date.toLocaleDateString()
}

export function NotificationsPage() {
	const { data, isLoading } = useNotificationsListQuery({ limit: 50 })
	const markRead = useMarkNotificationsReadMutation()
	const markAllRead = useMarkAllNotificationsReadMutation()

	const items = data?.items ?? []
	const unread = data?.unreadCount ?? 0

	function handleClick(n: Notification) {
		if (!n.readAt) {
			markRead.mutate({ ids: [n.id] })
		}
	}

	function handleMarkAll() {
		markAllRead.mutate(undefined, {
			onSuccess: () => toast.success("All notifications marked read"),
		})
	}

	return (
		<div className="flex flex-col gap-4">
			<header className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Notifications</h1>
					<p className="text-muted-foreground text-sm">
						{unread > 0 ? `${unread} unread` : "All caught up"}
					</p>
				</div>
				{unread > 0 ? (
					<Button variant="outline" size="sm" onClick={handleMarkAll}>
						Mark all as read
					</Button>
				) : null}
			</header>

			{isLoading ? (
				<div className="flex flex-col gap-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-16 w-full" />
					))}
				</div>
			) : items.length === 0 ? (
				<div className="bg-muted/30 flex flex-col items-center gap-2 rounded-md border border-dashed p-8 text-center">
					<Bell className="text-muted-foreground size-6" />
					<p className="text-sm font-medium">No notifications yet</p>
					<p className="text-muted-foreground text-xs">
						Status updates on your requests show up here.
					</p>
				</div>
			) : (
				<ul className="flex flex-col gap-2">
					{items.map(n => {
						const unread = !n.readAt

						return (
							<li key={n.id}>
								<Link
									href={`/portal/notifications/${n.id}`}
									onClick={() => handleClick(n)}
									className="block"
								>
									<div
										className={`flex items-start justify-between gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50 ${
											unread ? "border-primary/40 bg-primary/5" : "bg-background"
										}`}
									>
										<div className="flex min-w-0 flex-col">
											<p className="text-sm font-medium">
												{n.title}
												{unread ? (
													<span className="bg-primary ml-2 inline-block size-2 rounded-full align-middle" />
												) : null}
											</p>
											<p className="text-muted-foreground line-clamp-2 text-xs">
												{n.body}
											</p>
											<p className="text-muted-foreground mt-0.5 text-[10px]">
												{n.kind}
											</p>
										</div>
										<span className="text-muted-foreground shrink-0 text-[10px] tabular-nums">
											{formatRelative(n.createdAt)}
										</span>
									</div>
								</Link>
							</li>
						)
					})}
				</ul>
			)}
		</div>
	)
}
