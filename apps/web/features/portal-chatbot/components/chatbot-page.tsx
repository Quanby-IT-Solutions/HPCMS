"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import type { ChatbotMessage } from "@repo/contracts"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import {
	buildBotReply,
	buildGreetingMessages,
} from "@/features/portal-chatbot/api/chatbot.hooks"

type Subflow = "scheduling" | null

export function ChatbotPage() {
	const router = useRouter()
	const [messages, setMessages] = useState<ChatbotMessage[]>([])
	const [input, setInput] = useState("")
	const [subflow, setSubflow] = useState<Subflow>(null)
	const [scheduling, setScheduling] = useState({
		preferredDate: "",
		preferredTime: "",
		specialty: "",
	})
	const scrollRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		// Defer initial seeding so we don't violate React purity rules.
		const t = setTimeout(() => setMessages(buildGreetingMessages()), 0)
		return () => clearTimeout(t)
	}, [])

	useEffect(() => {
		scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
	}, [messages])

	function appendPatient(body: string) {
		setMessages(prev => [
			...prev,
			{
				id: `patient-${Date.now()}`,
				role: "patient",
				body,
				intent: null,
				quickReplies: [],
				relatedArticles: [],
				sentAt: new Date(),
			},
		])
	}

	function handleQuickReply(key: string, intent: string | null, href: string | null) {
		if (intent) {
			appendPatient(key.replace(/_/g, " "))
			setTimeout(() => setMessages(prev => [...prev, buildBotReply(intent)]), 200)
			if (intent === "schedule_consult") setSubflow("scheduling")
			else if (intent === "escalate") {
				// Spec AC: escalate triggers a live chat session.
				setTimeout(() => router.push("/portal/chat"), 600)
			} else {
				setSubflow(null)
			}
		}
		if (href) {
			router.push(href)
		}
	}

	function handleSubmitScheduling(e: React.FormEvent) {
		e.preventDefault()
		if (
			!scheduling.preferredDate ||
			!scheduling.preferredTime ||
			scheduling.specialty.trim().length === 0
		) {
			toast.error("Please fill date, time, and specialty.")
			return
		}
		appendPatient(
			`Requested consultation: ${scheduling.specialty} on ${scheduling.preferredDate} at ${scheduling.preferredTime}.`
		)
		setMessages(prev => [
			...prev,
			{
				id: `bot-sched-${Date.now()}`,
				role: "bot",
				body: "Got it — a coordinator will reach out within 1 business day to confirm.",
				intent: "schedule_consult",
				quickReplies: [],
				relatedArticles: [],
				sentAt: new Date(),
			},
		])
		setSubflow(null)
		setScheduling({ preferredDate: "", preferredTime: "", specialty: "" })
		toast.success("Consultation request captured")
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		const body = input.trim()
		if (body.length === 0) return
		appendPatient(body)
		setInput("")
		setTimeout(() => setMessages(prev => [...prev, buildBotReply("freeform")]), 200)
	}

	return (
		<div className="flex flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">SLMC assistant</h1>
				<p className="text-muted-foreground text-sm">
					Ask about LOA requests, appointments, or escalate to a live agent.
				</p>
			</header>

			<div
				ref={scrollRef}
				className="bg-muted/20 flex max-h-[60vh] min-h-80 flex-col gap-3 overflow-y-auto rounded-md border p-4"
			>
				{messages.map(m => (
					<div
						key={m.id}
						className={`flex max-w-[80%] flex-col gap-2 rounded-md p-3 text-sm ${
							m.role === "bot"
								? "bg-card border self-start"
								: "bg-primary text-primary-foreground self-end"
						}`}
					>
						<p className="whitespace-pre-wrap">{m.body}</p>
						{m.relatedArticles.length > 0 ? (
							<ul className="flex flex-col gap-1 text-xs">
								{m.relatedArticles.map(a => (
									<li key={a.slug}>
										<Link
											href={`/portal/kb/article/${a.slug}`}
											className="text-primary underline-offset-2 hover:underline"
										>
											📄 {a.title}
										</Link>
									</li>
								))}
							</ul>
						) : null}
						{m.quickReplies.length > 0 ? (
							<div className="flex flex-wrap gap-2">
								{m.quickReplies.map(qr => (
									<button
										key={qr.key}
										type="button"
										onClick={() => handleQuickReply(qr.key, qr.intent, qr.href)}
										className="border-border hover:bg-muted bg-background text-foreground inline-flex items-center rounded-full border px-3 py-1 text-xs"
									>
										{qr.label}
									</button>
								))}
							</div>
						) : null}
					</div>
				))}
			</div>

			{subflow === "scheduling" ? (
				<form
					onSubmit={handleSubmitScheduling}
					className="bg-muted/30 grid items-end gap-3 rounded-md border p-3 sm:grid-cols-4"
				>
					<div className="flex flex-col gap-1">
						<Label htmlFor="sch-date">Preferred date</Label>
						<Input
							id="sch-date"
							type="date"
							value={scheduling.preferredDate}
							onChange={e =>
								setScheduling(s => ({ ...s, preferredDate: e.target.value }))
							}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="sch-time">Preferred time</Label>
						<Input
							id="sch-time"
							type="time"
							value={scheduling.preferredTime}
							onChange={e =>
								setScheduling(s => ({ ...s, preferredTime: e.target.value }))
							}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="sch-specialty">Specialty</Label>
						<Input
							id="sch-specialty"
							value={scheduling.specialty}
							onChange={e =>
								setScheduling(s => ({ ...s, specialty: e.target.value }))
							}
							placeholder="e.g. cardiology"
						/>
					</div>
					<Button type="submit" size="sm">
						Submit
					</Button>
				</form>
			) : null}

			<form onSubmit={handleSubmit} className="flex gap-2">
				<Input
					value={input}
					onChange={e => setInput(e.target.value)}
					placeholder="Type a message…"
					autoFocus
				/>
				<Button type="submit">Send</Button>
			</form>
		</div>
	)
}
