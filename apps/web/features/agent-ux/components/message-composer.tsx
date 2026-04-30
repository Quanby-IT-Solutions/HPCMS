"use client"

import { useState } from "react"

import type { OutboundChannelSchema } from "@repo/contracts"
import type { z } from "zod"

import { AlertTriangle, X } from "@/core/components/icons"
import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/alert"
import { Button } from "@/core/components/ui/button"
import { Label } from "@/core/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Textarea } from "@/core/components/ui/textarea"
import { Input } from "@/core/components/ui/input"

type OutboundChannel = z.infer<typeof OutboundChannelSchema>

export interface MessageTemplate {
	key: string
	label: string
	subject: string
	body: string
}

interface PendingAttachment {
	key: string
	filename: string
	sizeBytes: number
}

export interface MessageComposerValue {
	channel: OutboundChannel
	to: string
	subject: string
	body: string
	templateKey: string | null
	attachmentKeys: string[]
}

interface MessageComposerProps {
	defaultValue?: Partial<MessageComposerValue>
	templates?: MessageTemplate[]
	onSend: (value: MessageComposerValue) => Promise<void> | void
	isPending?: boolean
	allowedChannels?: OutboundChannel[]
	/**
	 * Inline consent warning. When set, the composer renders a destructive
	 * Alert above the form and disables Send. Backed by SUP-BE-12 ensureConsent
	 * once that lands; for now the caller may pass a static string to surface
	 * the UI path.
	 */
	consentWarning?: string | null
}

const DEFAULT_TEMPLATES: MessageTemplate[] = []

export function MessageComposer({
	defaultValue,
	templates = DEFAULT_TEMPLATES,
	onSend,
	isPending = false,
	allowedChannels = ["email", "portal_chat"],
	consentWarning = null,
}: MessageComposerProps) {
	const [channel, setChannel] = useState<OutboundChannel>(
		defaultValue?.channel ?? allowedChannels[0]!
	)
	const [to, setTo] = useState(defaultValue?.to ?? "")
	const [subject, setSubject] = useState(defaultValue?.subject ?? "")
	const [body, setBody] = useState(defaultValue?.body ?? "")
	const [templateKey, setTemplateKey] = useState<string | null>(
		defaultValue?.templateKey ?? null
	)
	const [attachments, setAttachments] = useState<PendingAttachment[]>([])

	function applyTemplate(key: string) {
		const t = templates.find(x => x.key === key)
		if (!t) return
		setSubject(t.subject)
		setBody(t.body)
		setTemplateKey(t.key)
	}

	function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files ?? [])
		const next: PendingAttachment[] = files.map((f, i) => ({
			// Real upload will replace this with a signed-storage key.
			key: `pending-${Date.now()}-${i}-${f.name}`,
			filename: f.name,
			sizeBytes: f.size,
		}))
		setAttachments(prev => [...prev, ...next])
		e.target.value = ""
	}

	function removeAttachment(key: string) {
		setAttachments(prev => prev.filter(a => a.key !== key))
	}

	const consentBlocked = !!consentWarning
	const canSend =
		to.trim().length > 0 && body.trim().length > 0 && !isPending && !consentBlocked

	async function handleSend() {
		await onSend({
			channel,
			to: to.trim(),
			subject: subject.trim(),
			body: body.trim(),
			templateKey,
			attachmentKeys: attachments.map(a => a.key),
		})
		setAttachments([])
	}

	return (
		<div className="flex flex-col gap-3 rounded-md border p-3">
			{consentWarning ? (
				<Alert variant="destructive">
					<AlertTitle className="flex items-center gap-2">
						<AlertTriangle className="size-4" />
						Patient consent required
					</AlertTitle>
					<AlertDescription>{consentWarning}</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-2 sm:grid-cols-2">
				<div className="flex flex-col gap-1">
					<Label htmlFor="composer-channel">Channel</Label>
					<Select
						value={channel}
						onValueChange={v => v && setChannel(v as OutboundChannel)}
					>
						<SelectTrigger id="composer-channel">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{allowedChannels.map(c => (
								<SelectItem key={c} value={c}>
									{c === "email" ? "Email" : "Portal chat"}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="composer-template">Template</Label>
					<Select
						value={templateKey ?? ""}
						onValueChange={v => (v ? applyTemplate(v) : setTemplateKey(null))}
					>
						<SelectTrigger id="composer-template">
							<SelectValue>
								{templateKey
									? (templates.find(t => t.key === templateKey)?.label ?? templateKey)
									: "No template"}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{templates.length === 0 ? (
								<SelectItem value="__none" disabled>
									No templates available
								</SelectItem>
							) : (
								templates.map(t => (
									<SelectItem key={t.key} value={t.key}>
										{t.label}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex flex-col gap-1">
				<Label htmlFor="composer-to">To</Label>
				<Input
					id="composer-to"
					value={to}
					onChange={e => setTo(e.target.value)}
					placeholder={
						channel === "email" ? "patient@example.com" : "Patient (portal user)"
					}
				/>
			</div>

			<div className="flex flex-col gap-1">
				<Label htmlFor="composer-subject">Subject</Label>
				<Input
					id="composer-subject"
					value={subject}
					onChange={e => setSubject(e.target.value)}
					placeholder="Brief subject line"
				/>
			</div>

			<div className="flex flex-col gap-1">
				<Label htmlFor="composer-body">Message</Label>
				<Textarea
					id="composer-body"
					value={body}
					onChange={e => setBody(e.target.value)}
					rows={6}
					placeholder="Compose your reply…"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="composer-attachments">Attachments</Label>
				<Input
					id="composer-attachments"
					type="file"
					multiple
					onChange={handleFiles}
					className="cursor-pointer"
				/>
				{attachments.length > 0 ? (
					<ul className="flex flex-col gap-1">
						{attachments.map(a => (
							<li
								key={a.key}
								className="bg-muted/40 flex items-center justify-between gap-2 rounded-md px-2 py-1 text-xs"
							>
								<span className="truncate">
									{a.filename}{" "}
									<span className="text-muted-foreground">
										· {Math.round(a.sizeBytes / 1024)} KB
									</span>
								</span>
								<Button
									type="button"
									variant="ghost"
									size="icon-xs"
									onClick={() => removeAttachment(a.key)}
									aria-label={`Remove ${a.filename}`}
								>
									<X className="size-3" />
								</Button>
							</li>
						))}
					</ul>
				) : null}
			</div>

			<div className="flex items-center justify-end">
				<Button type="button" size="sm" onClick={handleSend} disabled={!canSend}>
					{isPending ? "Sending…" : "Send"}
				</Button>
			</div>
		</div>
	)
}
