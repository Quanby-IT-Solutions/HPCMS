"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { Notification } from "@repo/contracts"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/core/components/ui/popover"
import { Bell } from "@/core/components/icons"
import { orpc } from "@/services/orpc/client"

export function NotificationsBell() {
	const [open, setOpen] = useState(false)
	const queryClient = useQueryClient()

	const { data } = useQuery(
		orpc.notifications.list.queryOptions({
			input: { unreadOnly: false, limit: 20 },
			refetchInterval: 30_000,
		})
	)

	const { mutateAsync: markAllRead, isPending } = useMutation(
		orpc.notifications.markAllRead.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.notifications.list.key() })
			},
		})
	)

	async function handleMarkAll() {
		try {
			await markAllRead(undefined)
			toast.success("All notifications marked as read")
		} catch {
			toast.error("Failed to mark notifications as read")
		}
	}

	const unreadCount = data?.unreadCount ?? 0
	const items = data?.items ?? []

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger render={<Button variant="ghost" size="icon" className="relative" />}>
				<Bell />
				{unreadCount > 0 && (
					<span className="bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-bold">
						{unreadCount > 9 ? "9+" : unreadCount}
					</span>
				)}
				<span className="sr-only">Notifications ({unreadCount} unread)</span>
			</PopoverTrigger>
			<PopoverContent className="w-80" side="bottom" align="end">
				<PopoverHeader>
					<div className="flex items-center justify-between">
						<PopoverTitle>Notifications</PopoverTitle>
						{unreadCount > 0 && (
							<Button variant="ghost" size="xs" disabled={isPending} onClick={handleMarkAll}>
								Mark all read
							</Button>
						)}
					</div>
				</PopoverHeader>

				<div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
					{items.length === 0 ? (
						<p className="text-muted-foreground py-4 text-center text-sm">
							No notifications
						</p>
					) : (
						items.map((n: Notification) => (
							<div
								key={n.id}
								className={`flex flex-col gap-0.5 rounded p-2 text-sm ${!n.readAt ? "bg-muted" : ""}`}
							>
								<div className="flex items-center justify-between gap-2">
									<span className="font-medium">{n.title}</span>
									{!n.readAt && <Badge variant="default" className="shrink-0">New</Badge>}
								</div>
								<p className="text-muted-foreground text-xs">{n.body}</p>
								<span className="text-muted-foreground text-xs">
									{new Date(n.createdAt).toLocaleString()}
								</span>
							</div>
						))
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
}
