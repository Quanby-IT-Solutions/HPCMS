"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Skeleton } from "@/core/components/ui/skeleton"
import { Textarea } from "@/core/components/ui/textarea"
import {
	usePortalChatThreadQuery,
	useSendPortalChatMessageMutation,
} from "@/features/portal-chat/api/chat.hooks"

export function ThreadView({ threadId }: { threadId: string }) {
	const { data, isLoading } = usePortalChatThreadQuery(threadId)
	const send = useSendPortalChatMessageMutation()
	const [body, setBody] = useState("")
	const [attachmentKeys, setAttachmentKeys] = useState<string[]>([])
	const [attachmentNames, setAttachmentNames] = useState<string[]>([])
	const scrollRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
	}, [data?.messages.length])

	useEffect(() => {
		if (typeof window === "undefined") return
		if (typeof Notification !== "undefined" && Notification.permission === "default") {
			// Best-effort browser notification permission prompt.
			Notification.requestPermission().catch(() => undefined)
		}
	}, [])

	if (isLoading || !data) {
		return <Skeleton className="h-96 w-full" />
	}

	function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files ?? [])
		const keys = files.map((f, i) => `pending-${Date.now()}-${i}-${f.name}`)
		const names = files.map(f => f.name)
		setAttachmentKeys(prev => [...prev, ...keys])
		setAttachmentNames(prev => [...prev, ...names])
		e.target.value = ""
	}

	async function handleSend(e: React.FormEvent) {
		e.preventDefault()
		const trimmed = body.trim()
		if (trimmed.length === 0) return
		try {
			await send.mutateAsync({ threadId, body: trimmed, attachmentKeys })
			setBody("")
			setAttachmentKeys([])
			setAttachmentNames([])
			toast.success("Message sent")
		} catch (err) {
			toast.error("Could not send", { description: (err as Error).message })
		}
	}

	return (
		<div className="flex h-[70vh] min-h-[400px] flex-col gap-3 rounded-md border p-4">
			<header className="flex items-baseline justify-between border-b pb-2">
				<div>
					<h1 className="text-base font-semibold">{data.thread.subject}</h1>
					{data.thread.caseRef ? (
						<p className="text-muted-foreground font-mono text-[11px]">
							{data.thread.caseRef}
						</p>
					) : null}
				</div>
			</header>

			<div ref={scrollRef} className="flex flex-1 flex-col gap-2 overflow-y-auto py-2">
				{data.messages.map(m => (
					<div
						key={m.id}
						className={`max-w-[85%] rounded-md p-2.5 text-sm ${
							m.direction === "inbound"
								? "bg-muted/40 self-start"
								: "bg-primary text-primary-foreground self-end"
						}`}
					>
						<p className="whitespace-pre-wrap">{m.body}</p>
						{m.attachments.length > 0 ? (
							<ul className="mt-1 flex flex-wrap gap-1 text-[10px]">
								{m.attachments.map(a => (
									<li
										key={a.id}
										className="bg-background/50 rounded px-1.5 py-0.5"
									>
										📎 {a.filename}
									</li>
								))}
							</ul>
						) : null}
						<p className="mt-1 text-[10px] opacity-70">
							{new Date(m.sentAt).toLocaleString()}
						</p>
					</div>
				))}
			</div>

			<form onSubmit={handleSend} className="flex flex-col gap-2 border-t pt-3">
				<Textarea
					value={body}
					onChange={e => setBody(e.target.value)}
					rows={2}
					placeholder="Reply to the team…"
				/>
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Input
							type="file"
							multiple
							onChange={handleFiles}
							className="h-8 w-fit cursor-pointer"
						/>
						{attachmentNames.length > 0 ? (
							<span className="text-muted-foreground text-xs">
								{attachmentNames.length} file
								{attachmentNames.length === 1 ? "" : "s"} attached
							</span>
						) : null}
					</div>
					<Button
						type="submit"
						size="sm"
						disabled={body.trim().length === 0 || send.isPending}
					>
						{send.isPending ? "Sending…" : "Send"}
					</Button>
				</div>
			</form>
		</div>
	)
}
