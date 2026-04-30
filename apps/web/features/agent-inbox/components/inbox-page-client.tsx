"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import type { Channel, InboxStatus } from "@repo/contracts"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Skeleton } from "@/core/components/ui/skeleton"
import { useInboxListQuery } from "@/features/agent-inbox/api/inbox.hooks"
import { InboxItemDrawer } from "@/features/agent-inbox/components/inbox-item-drawer"
import {
	FilterChipBar,
	type FilterChipOption,
} from "@/features/agent-ux/components/filter-chip-bar"
import { InboxFeed } from "@/features/agent-ux/components/inbox-feed"

const CHANNEL_OPTIONS: FilterChipOption[] = [
	{ value: "email", label: "Email" },
	{ value: "phone", label: "Phone" },
	{ value: "portal_chat", label: "Portal chat" },
	{ value: "social_media", label: "Social media" },
]

const STATUS_OPTIONS: FilterChipOption[] = [
	{ value: "new", label: "New" },
	{ value: "in_progress", label: "In progress" },
	{ value: "linked", label: "Linked" },
	{ value: "resolved", label: "Resolved" },
]

const SORT_OPTIONS: FilterChipOption[] = [
	{ value: "recent", label: "Recent" },
	{ value: "priority", label: "Priority" },
	{ value: "unanswered", label: "Unanswered duration" },
]

export function InboxPageClient() {
	const searchParams = useSearchParams()
	const focusId = searchParams.get("focus")
	const [filters, setFilters] = useState<Record<string, string | undefined>>({
		sort: "recent",
	})
	const [agentId, setAgentId] = useState("")
	const [dateFrom, setDateFrom] = useState("")
	const [dateTo, setDateTo] = useState("")
	const [selectedId, setSelectedId] = useState<string | null>(focusId)

	// If the inbox page is opened with ?focus=<id> from communications search,
	// pre-open the matching drawer.
	useEffect(() => {
		if (focusId && focusId !== selectedId) {
			setSelectedId(focusId)
		}
		// Only react to the URL param itself.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [focusId])

	const { data, isLoading } = useInboxListQuery({
		channel: filters.channel as Channel | undefined,
		status: filters.status as InboxStatus | undefined,
		assignedAgentId: agentId.trim() || undefined,
		dateFrom: dateFrom || undefined,
		dateTo: dateTo || undefined,
		sort: (filters.sort as "recent" | "priority" | "unanswered") ?? "recent",
	})

	function clearAdvanced() {
		setAgentId("")
		setDateFrom("")
		setDateTo("")
	}

	return (
		<div className="flex flex-col gap-4">
			<header className="flex flex-wrap items-start justify-between gap-2">
				<div>
					<h1 className="text-2xl font-bold">Unified inbox</h1>
					<p className="text-muted-foreground text-sm">
						Email, phone, portal chat, and social media inquiries in one feed.
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<a
						href="/agent/inbox/log-call"
						className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
					>
						Log call
					</a>
					<a
						href="/agent/inbox/log-social"
						className="border-border hover:bg-muted inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium"
					>
						Capture social inquiry
					</a>
				</div>
			</header>

			<FilterChipBar
				chips={[
					{ key: "channel", label: "Channel", options: CHANNEL_OPTIONS },
					{ key: "status", label: "Status", options: STATUS_OPTIONS },
					{ key: "sort", label: "Sort", options: SORT_OPTIONS },
				]}
				selected={filters}
				onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
			/>

			<div className="bg-muted/30 grid items-end gap-3 rounded-md p-3 sm:grid-cols-4">
				<div className="flex flex-col gap-1">
					<Label htmlFor="inbox-agent">Assigned agent ID</Label>
					<Input
						id="inbox-agent"
						value={agentId}
						onChange={e => setAgentId(e.target.value)}
						placeholder="user-agent-1"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="inbox-from">Date from</Label>
					<Input
						id="inbox-from"
						type="date"
						value={dateFrom}
						onChange={e => setDateFrom(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="inbox-to">Date to</Label>
					<Input
						id="inbox-to"
						type="date"
						value={dateTo}
						onChange={e => setDateTo(e.target.value)}
					/>
				</div>
				<Button variant="ghost" size="sm" onClick={clearAdvanced} className="w-fit">
					Clear advanced
				</Button>
			</div>

			<div className="flex gap-4">
				<div className="min-w-0 flex-1">
					{isLoading || !data ? (
						<div className="flex flex-col gap-2">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className="h-20 w-full" />
							))}
						</div>
					) : (
						<InboxFeed
							items={data.items}
							selectedId={selectedId}
							onSelect={setSelectedId}
						/>
					)}
				</div>
				{selectedId ? (
					<div className="w-[480px] shrink-0">
						<InboxItemDrawer itemId={selectedId} onClose={() => setSelectedId(null)} />
					</div>
				) : null}
			</div>
		</div>
	)
}
