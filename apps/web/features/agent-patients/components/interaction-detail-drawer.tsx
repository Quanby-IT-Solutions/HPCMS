"use client"

import Link from "next/link"

import type { TimelineEntry } from "@repo/contracts"

import { X } from "@/core/components/icons"
import { Button } from "@/core/components/ui/button"
import { ChannelBadge } from "@/features/agent-ux/components/channel-badge"

interface Props {
	entry: TimelineEntry | null
	onClose: () => void
}

function formatDateTime(d: Date | string): string {
	const date = d instanceof Date ? d : new Date(d)
	return date.toLocaleString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	})
}

export function InteractionDetailDrawer({ entry, onClose }: Props) {
	if (!entry) return null

	const channelKnown =
		entry.channel === "email" ||
		entry.channel === "phone" ||
		entry.channel === "portal_chat" ||
		entry.channel === "social_media"

	return (
		<aside className="bg-card flex h-full flex-col gap-4 overflow-y-auto rounded-md border p-4">
			<header className="flex items-start justify-between gap-2">
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center gap-2">
						{channelKnown ? (
							<ChannelBadge
								channel={
									entry.channel as "email" | "phone" | "portal_chat" | "social_media"
								}
							/>
						) : (
							<span className="text-muted-foreground text-[10px] uppercase tracking-wider">
								{entry.kind.replace(/_/g, " ")}
							</span>
						)}
						{entry.caseRef ? (
							<code className="text-muted-foreground text-[11px]">{entry.caseRef}</code>
						) : null}
					</div>
					<h2 className="text-sm font-semibold leading-tight">{entry.title}</h2>
					<p className="text-muted-foreground text-[11px] tabular-nums">
						{formatDateTime(entry.occurredAt)}
						{entry.actorName ? ` · by ${entry.actorName}` : ""}
					</p>
				</div>
				<Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
					<X />
				</Button>
			</header>

			{entry.preview ? (
				<section>
					<h3 className="text-muted-foreground text-[10px] uppercase tracking-wider">
						Preview
					</h3>
					<p className="mt-1 text-xs whitespace-pre-wrap">{entry.preview}</p>
				</section>
			) : null}

			{entry.body ? (
				<section>
					<h3 className="text-muted-foreground text-[10px] uppercase tracking-wider">
						Full content
					</h3>
					<p className="mt-1 text-sm whitespace-pre-wrap">{entry.body}</p>
				</section>
			) : (
				<p className="text-muted-foreground text-xs italic">
					Full body comes from the channel-specific record once the backend (CA-BE-03)
					attaches it. The preview is what&apos;s surfaced here for now.
				</p>
			)}

			<footer className="mt-auto flex flex-wrap gap-2 border-t pt-3">
				{entry.caseRef ? (
					<Link
						href={`/agent/cases/${entry.caseRef}`}
						className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
					>
						Go to case
					</Link>
				) : (
					<span className="text-muted-foreground text-xs italic">
						Not yet linked to a case.
					</span>
				)}
			</footer>
		</aside>
	)
}
