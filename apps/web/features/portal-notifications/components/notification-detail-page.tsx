"use client"

import Link from "next/link"
import { useEffect } from "react"

import { ChevronLeft } from "@/core/components/icons"
import { buttonVariants } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import { cn } from "@/core/lib/utils"
import {
	useMarkNotificationsReadMutation,
	useNotificationsListQuery,
} from "@/features/portal-notifications/api/notifications.hooks"

export function NotificationDetailPage({ id }: { id: string }) {
	const { data, isLoading } = useNotificationsListQuery({ limit: 50 })
	const markRead = useMarkNotificationsReadMutation()

	const item = data?.items.find(n => n.id === id)

	useEffect(() => {
		if (item && !item.readAt) {
			markRead.mutate({ ids: [item.id] })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [item?.id])

	if (isLoading || !data) {
		return <Skeleton className="h-48 w-full" />
	}

	if (!item) {
		return (
			<div className="flex flex-col gap-4">
				<Link
					href="/portal/notifications"
					className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 w-fit")}
				>
					<ChevronLeft className="mr-1 size-4" />
					Back to notifications
				</Link>
				<p className="text-muted-foreground text-sm">Notification not found.</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4">
			<Link
				href="/portal/notifications"
				className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 w-fit")}
			>
				<ChevronLeft className="mr-1 size-4" />
				Back to notifications
			</Link>

			<header>
				<h1 className="text-2xl font-bold">{item.title}</h1>
				<p className="text-muted-foreground text-xs">
					{new Date(item.createdAt).toLocaleString()} · {item.kind}
				</p>
			</header>

			<section className="bg-muted/30 rounded-md p-4 text-sm">
				<p className="whitespace-pre-wrap">{item.body}</p>
			</section>

			{item.targetUrl ? (
				<div>
					<Link
						href={item.targetUrl}
						className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
					>
						{item.kind.includes("case") || item.kind.includes("request")
							? "Go to Request"
							: item.kind.includes("chat") || item.kind.includes("message")
								? "View Case Thread"
								: "Open"}
					</Link>
				</div>
			) : null}
		</div>
	)
}
