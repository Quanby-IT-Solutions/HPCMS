"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Bell, FileText, MessageCircle, PlusCircle } from "@/core/components/icons"
import { Button } from "@/core/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Input } from "@/core/components/ui/input"
import { useNotificationsListQuery } from "@/features/portal-notifications/api/notifications.hooks"
import { useMyRequestsQuery } from "@/features/portal-my-requests/api/cases.hooks"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

const MFA_DISMISSED_KEY = "pcms.portal.mfaDismissedUntil"
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

function isMfaPromptDismissed(): boolean {
	if (typeof window === "undefined") return true
	const raw = window.localStorage.getItem(MFA_DISMISSED_KEY)
	if (!raw) return false
	const ts = Number(raw)
	return Number.isFinite(ts) && ts > Date.now()
}

function dismissMfaPrompt() {
	if (typeof window === "undefined") return
	window.localStorage.setItem(
		MFA_DISMISSED_KEY,
		String(Date.now() + THIRTY_DAYS_MS)
	)
}

export function DashboardPage() {
	const router = useRouter()
	const [showMfaPrompt, setShowMfaPrompt] = useState(false)
	const [kb, setKb] = useState("")

	useEffect(() => {
		// Defer to next microtask to satisfy the synchronous-setState rule.
		const t = setTimeout(() => setShowMfaPrompt(!isMfaPromptDismissed()), 0)
		return () => clearTimeout(t)
	}, [])

	const requestsQ = useMyRequestsQuery(1, 5)
	const notificationsQ = useNotificationsListQuery({ unreadOnly: true, limit: 1 })

	const items = requestsQ.data?.items ?? []
	const unread = notificationsQ.data?.unreadCount ?? 0

	function handleKbSearch(e: React.FormEvent) {
		e.preventDefault()
		const q = kb.trim()
		if (q.length < 2) return
		router.push(`${PORTAL_ROUTES.kb}?q=${encodeURIComponent(q)}`)
	}

	return (
		<div className="flex flex-col gap-6">
			<header className="flex items-start justify-between gap-3">
				<div>
					<h1 className="text-2xl font-bold">Welcome back</h1>
					<p className="text-muted-foreground mt-1 text-sm">
						Here&apos;s what&apos;s happening with your requests.
					</p>
				</div>
				<Link
					href={PORTAL_ROUTES.notifications}
					className="border-border hover:bg-muted relative inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium"
				>
					<Bell className="size-4" />
					<span>Notifications</span>
					{unread > 0 ? (
						<span className="bg-primary text-primary-foreground absolute -right-1 -top-1 inline-flex size-4 items-center justify-center rounded-full text-[10px]">
							{unread}
						</span>
					) : null}
				</Link>
			</header>

			{showMfaPrompt ? (
				<Card>
					<CardContent className="flex items-center justify-between gap-4 py-4 text-sm">
						<div>
							<p className="font-semibold">Add a second factor for extra security</p>
							<p className="text-muted-foreground text-xs">
								We&apos;ll send a one-time code on each sign-in. You won&apos;t be
								asked again for 30 days if you skip.
							</p>
						</div>
						<div className="flex shrink-0 items-center gap-2">
							<Link
								href={PORTAL_ROUTES.mfa}
								className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
							>
								Set up MFA
							</Link>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									dismissMfaPrompt()
									setShowMfaPrompt(false)
								}}
							>
								Skip for now
							</Button>
						</div>
					</CardContent>
				</Card>
			) : null}

			<section className="grid gap-3 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Pending requests</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-2 text-sm">
						{requestsQ.isLoading ? (
							<p className="text-muted-foreground text-xs">Loading…</p>
						) : items.length === 0 ? (
							<p className="text-muted-foreground text-xs italic">
								No requests yet. Submit your first LOA below.
							</p>
						) : (
							items.map(c => (
								<Link
									key={c.id}
									href={PORTAL_ROUTES.requestDetail(c.caseRef)}
									className="bg-muted/30 hover:bg-muted/60 flex items-center justify-between rounded-md p-2 text-xs transition-colors"
								>
									<div>
										<div className="font-mono font-medium">{c.caseRef}</div>
										<div className="text-muted-foreground capitalize">
											{c.status.replace(/_/g, " ")}
										</div>
									</div>
									<span className="text-muted-foreground tabular-nums">
										{new Date(c.submittedAt).toLocaleDateString()}
									</span>
								</Link>
							))
						)}
						<Link
							href={PORTAL_ROUTES.requests}
							className="text-primary mt-2 text-xs hover:underline"
						>
							View all →
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Quick actions</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-3 text-sm">
						<Link
							href={PORTAL_ROUTES.loaNew}
							className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium"
						>
							<PlusCircle className="mr-2 size-4" />
							Submit new LOA request
						</Link>
						<Link
							href={PORTAL_ROUTES.chatbot}
							className="border-border hover:bg-muted inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium"
						>
							<MessageCircle className="mr-2 size-4" />
							Open SLMC assistant
						</Link>
						<Link
							href={PORTAL_ROUTES.chat}
							className="border-border hover:bg-muted inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium"
						>
							<FileText className="mr-2 size-4" />
							Message the team
						</Link>
					</CardContent>
				</Card>
			</section>

			<section>
				<form onSubmit={handleKbSearch} className="flex gap-2">
					<Input
						value={kb}
						onChange={e => setKb(e.target.value)}
						placeholder="Search the knowledge base — e.g. 'LOA submission', 'medication refill'"
						className="flex-1"
					/>
					<Button type="submit">Search</Button>
				</form>
			</section>
		</div>
	)
}
