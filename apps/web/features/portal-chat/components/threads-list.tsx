"use client"

import Link from "next/link"

import { Skeleton } from "@/core/components/ui/skeleton"
import { usePortalChatThreadsQuery } from "@/features/portal-chat/api/chat.hooks"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

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

export function ThreadsList() {
	const { data, isLoading } = usePortalChatThreadsQuery()

	if (isLoading || !data) {
		return (
			<div className="flex flex-col gap-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className="h-16 w-full" />
				))}
			</div>
		)
	}

	if (data.threads.length === 0) {
		return (
			<p className="text-muted-foreground rounded-md border border-dashed p-6 text-center text-sm italic">
				No conversations yet. The team will start one when they need to reach out.
			</p>
		)
	}

	return (
		<ul className="flex flex-col gap-2">
			{data.threads.map(t => (
				<li key={t.id}>
					<Link
						href={PORTAL_ROUTES.chatThread(t.id)}
						className="hover:bg-muted/40 flex items-start justify-between gap-3 rounded-md border p-3 transition-colors"
					>
						<div className="flex min-w-0 flex-col">
							<p className="text-sm font-semibold">
								{t.subject}
								{t.unreadCount > 0 ? (
									<span className="bg-primary text-primary-foreground ml-2 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px]">
										{t.unreadCount}
									</span>
								) : null}
							</p>
							{t.caseRef ? (
								<p className="text-muted-foreground font-mono text-[11px]">
									{t.caseRef}
								</p>
							) : null}
							<p className="text-muted-foreground line-clamp-1 text-xs">{t.preview}</p>
						</div>
						<span className="text-muted-foreground shrink-0 text-[10px] tabular-nums">
							{formatRelative(t.lastMessageAt)}
						</span>
					</Link>
				</li>
			))}
		</ul>
	)
}
