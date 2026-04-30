"use client"

import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

import type { EmailMessage } from "@repo/contracts"

import { X } from "@/core/components/icons"
import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	useInboxItemQuery,
	useResolveInboxMutation,
} from "@/features/agent-inbox/api/inbox.hooks"
import { useSendOutboundMutation } from "@/features/agent-inbox/api/outbound.hooks"
import { AISuggestionPanel } from "@/features/agent-inbox/components/ai-suggestion-panel"
import { AttachToCaseModal } from "@/features/agent-inbox/components/attach-to-case-modal"
import { ChannelBadge } from "@/features/agent-ux/components/channel-badge"
import { MessageComposer } from "@/features/agent-ux/components/message-composer"

interface Props {
	itemId: string
	onClose: () => void
}

function EmailThread({
	messages,
	parentStatus,
}: {
	messages: EmailMessage[]
	parentStatus: string
}) {
	// The newest inbound message is "unread" until the inbox item leaves "new".
	const newestInboundId = [...messages]
		.reverse()
		.find(m => m.direction === "inbound")?.id
	return (
		<div className="flex flex-col gap-3">
			{messages.map(m => {
				const isUnread =
					m.direction === "inbound" &&
					m.id === newestInboundId &&
					parentStatus === "new"
				return (
					<article
						key={m.id}
						className={`rounded-md border p-3 ${
							m.direction === "inbound" ? "bg-muted/40" : "bg-primary/5"
						} ${isUnread ? "border-primary/50 ring-1 ring-primary/30" : ""}`}
					>
						<header className="mb-2 flex items-center justify-between gap-2 text-xs">
							<div className="flex items-center gap-2">
								<div className="flex flex-col">
									<span className="font-medium">{m.from}</span>
									<span className="text-muted-foreground">to {m.to.join(", ")}</span>
								</div>
								{isUnread ? (
									<span className="bg-primary text-primary-foreground inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium">
										Unread
									</span>
								) : null}
							</div>
							<span className="text-muted-foreground tabular-nums">
								{new Date(m.sentAt).toLocaleString()}
							</span>
						</header>
						<p className="text-sm whitespace-pre-wrap">{m.bodyText}</p>
						{m.attachments.length > 0 ? (
							<ul className="mt-2 flex flex-wrap gap-2">
								{m.attachments.map(a => (
									<li
										key={a.id}
										className="bg-background rounded-md border px-2 py-1 text-[11px]"
									>
										📎 {a.filename}
									</li>
								))}
							</ul>
						) : null}
					</article>
				)
			})}
		</div>
	)
}

type ComposerMode = "reply" | "forward"

export function InboxItemDrawer({ itemId, onClose }: Props) {
	const { data, isLoading } = useInboxItemQuery(itemId)
	const send = useSendOutboundMutation()
	const resolve = useResolveInboxMutation()
	const [composerMode, setComposerMode] = useState<ComposerMode>("reply")

	if (isLoading || !data) {
		return (
			<aside className="bg-card flex h-full flex-col gap-3 rounded-md border p-4">
				<Skeleton className="h-6 w-1/2" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-24 w-full" />
			</aside>
		)
	}

	const item = data.item

	async function handleResolve() {
		try {
			await resolve.mutateAsync({ inboxItemId: itemId, resolution: "Resolved by agent" })
			toast.success("Inbox item resolved")
			onClose()
		} catch (err) {
			toast.error("Could not resolve", { description: (err as Error).message })
		}
	}

	async function handleArchive() {
		try {
			await resolve.mutateAsync({
				inboxItemId: itemId,
				resolution: "Archived (no action required)",
			})
			toast.success("Archived")
			onClose()
		} catch (err) {
			toast.error("Could not archive", { description: (err as Error).message })
		}
	}

	return (
		<aside className="bg-card flex h-full flex-col gap-3 overflow-y-auto rounded-md border p-4">
			<header className="flex items-start justify-between gap-2">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<ChannelBadge
							channel={item.channel}
							platform={item.socialPlatform ?? null}
						/>
						<Badge variant="outline">{item.status.replace(/_/g, " ")}</Badge>
					</div>
					<h2 className="text-base font-semibold leading-tight">{item.subject}</h2>
					<p className="text-muted-foreground text-xs">
						{item.senderName ?? item.senderHandle ?? "—"}
					</p>
				</div>
				<Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
					<X />
				</Button>
			</header>

			{item.aiSuggestion ? <AISuggestionPanel item={item} /> : null}

			{data.emailThread ? (
				<EmailThread messages={data.emailThread} parentStatus={item.status} />
			) : null}
			{data.transcript ? (
				<section className="bg-muted/40 rounded-md p-3">
					<h3 className="text-muted-foreground text-[10px] uppercase tracking-wider">
						Call transcript
					</h3>
					<p className="mt-1 text-sm whitespace-pre-wrap">{data.transcript}</p>
				</section>
			) : null}
			{data.socialPost ? (
				<section className="bg-muted/40 rounded-md p-3">
					<h3 className="text-muted-foreground text-[10px] uppercase tracking-wider">
						Social post · {data.socialPost.platform}
					</h3>
					<p className="mt-1 text-sm">{data.socialPost.content}</p>
				</section>
			) : null}
			{data.chatMessages ? (
				<section className="flex flex-col gap-2">
					{data.chatMessages.map(m => (
						<div
							key={m.id}
							className={`rounded-md p-2 text-sm ${
								m.direction === "inbound"
									? "bg-muted/40 self-start"
									: "bg-primary/10 self-end"
							}`}
						>
							{m.body}
						</div>
					))}
				</section>
			) : null}

			<footer className="flex flex-col gap-3 border-t pt-3">
				<div className="flex flex-wrap gap-2">
					<Link
						href={`/agent/cases?createFrom=${encodeURIComponent(itemId)}`}
						className="bg-primary text-primary-foreground hover:bg-primary/80 inline-flex h-7 items-center rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] font-medium"
					>
						Create case
					</Link>
					<AttachToCaseModal inboxItemId={itemId} />
					{item.channel === "email" ? (
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setComposerMode("reply")}
							>
								Reply
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setComposerMode("forward")}
							>
								Forward
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleArchive}
								disabled={resolve.isPending}
							>
								Archive
							</Button>
						</>
					) : null}
					<Button variant="outline" size="sm" onClick={handleResolve}>
						Resolve
					</Button>
				</div>

				{item.channel === "email" ? (
					<MessageComposer
						key={`${composerMode}-${item.id}`}
						defaultValue={{
							channel: "email",
							to: composerMode === "reply" ? (item.senderName ?? "") : "",
							subject:
								composerMode === "reply"
									? `Re: ${item.subject}`
									: `Fwd: ${item.subject}`,
							body:
								composerMode === "forward"
									? `\n\n---------- Forwarded message ----------\n${item.preview}\n`
									: "",
						}}
						templates={[
							{
								key: "loa_followup",
								label: "LOA follow-up",
								subject: `Re: ${item.subject}`,
								body: "Thank you for the update. We've forwarded the requested documents to the HMO and will follow up within 24 hours.",
							},
						]}
						isPending={send.isPending}
						onSend={async value => {
							try {
								await send.mutateAsync({
									channel: value.channel,
									caseRef: item.caseRef ?? "PENDING",
									to: [value.to],
									subject: value.subject,
									bodyHtml: `<p>${value.body}</p>`,
									bodyText: value.body,
									templateKey: value.templateKey,
									attachments: [],
								})
								toast.success(composerMode === "reply" ? "Reply sent" : "Forward sent")
							} catch (err) {
								toast.error("Could not send", { description: (err as Error).message })
							}
						}}
					/>
				) : null}
			</footer>
		</aside>
	)
}
