"use client"

import type { InboxItem, InboxStatus } from "@repo/contracts"

import { Badge } from "@/core/components/ui/badge"
import { cn } from "@/core/lib/utils"
import { ChannelBadge } from "@/features/agent-ux/components/channel-badge"
import { SLATimer } from "@/features/agent-ux/components/sla-timer"

const STATUS_VARIANT: Record<InboxStatus, "default" | "secondary" | "outline" | "destructive"> = {
	new: "default",
	in_progress: "secondary",
	linked: "outline",
	resolved: "outline",
}
const STATUS_LABEL: Record<InboxStatus, string> = {
	new: "New",
	in_progress: "In progress",
	linked: "Linked",
	resolved: "Resolved",
}

interface InboxFeedProps {
	items: InboxItem[]
	selectedId?: string | null
	onSelect: (id: string) => void
	emptyLabel?: string
}

function formatRelative(d: Date | string): string {
	const date = d instanceof Date ? d : new Date(d)
	const minutes = Math.round((Date.now() - date.getTime()) / 60_000)
	if (minutes < 1) return "just now"
	if (minutes < 60) return `${minutes}m ago`
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return `${hours}h ago`
	const days = Math.floor(hours / 24)
	return `${days}d ago`
}

export function InboxFeed({
	items,
	selectedId,
	onSelect,
	emptyLabel = "No items.",
}: InboxFeedProps) {
	if (items.length === 0) {
		return (
			<p className="text-muted-foreground rounded-md border border-dashed p-6 text-center text-sm italic">
				{emptyLabel}
			</p>
		)
	}

	return (
		<ul className="flex flex-col gap-1">
			{items.map(item => (
				<li key={item.id}>
					<button
						type="button"
						onClick={() => onSelect(item.id)}
						className={cn(
							"hover:bg-muted/40 flex w-full flex-col gap-1.5 rounded-md border p-3 text-left transition-colors",
							selectedId === item.id && "border-primary/40 bg-primary/5"
						)}
					>
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<ChannelBadge
									channel={item.channel}
									platform={item.socialPlatform ?? null}
								/>
								<Badge variant={STATUS_VARIANT[item.status]}>
									{STATUS_LABEL[item.status]}
								</Badge>
								{item.aiSuggestion ? (
									<Badge variant="ghost" className="font-normal">
										AI: {item.aiSuggestion.categoryLabel} (
										{Math.round(item.aiSuggestion.confidence * 100)}%)
									</Badge>
								) : null}
							</div>
							<div className="flex items-center gap-2 text-[10px]">
								{item.unansweredMinutes !== null ? (
									<SLATimer
										dueAt={
											new Date(
												new Date(item.receivedAt).getTime() + 8 * 60 * 60 * 1000
											)
										}
									/>
								) : null}
								<span className="text-muted-foreground tabular-nums">
									{formatRelative(item.receivedAt)}
								</span>
							</div>
						</div>
						<div className="flex flex-col gap-0.5">
							<div className="flex items-center justify-between gap-2 text-sm font-medium">
								<span className="truncate">{item.subject}</span>
								<span className="text-muted-foreground shrink-0 text-xs">
									{item.senderName ?? item.senderHandle ?? "—"}
								</span>
							</div>
							<p className="text-muted-foreground line-clamp-1 text-xs">{item.preview}</p>
						</div>
						{item.patientName ? (
							<div className="text-muted-foreground flex items-center gap-2 text-[11px]">
								<span>{item.patientName}</span>
								{item.patientName.toLowerCase() === "anonymous" ? (
									<Badge variant="outline" className="font-normal">
										Anonymous
									</Badge>
								) : null}
								{item.caseRef ? (
									<>
										<span>·</span>
										<span className="font-mono">{item.caseRef}</span>
									</>
								) : null}
							</div>
						) : null}
					</button>
				</li>
			))}
		</ul>
	)
}
