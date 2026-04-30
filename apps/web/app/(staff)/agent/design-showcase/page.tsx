"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { InboxItem } from "@repo/contracts"

import { ChannelBadge } from "@/features/agent-ux/components/channel-badge"
import {
	FilterChipBar,
	type FilterChipOption,
} from "@/features/agent-ux/components/filter-chip-bar"
import { InboxFeed } from "@/features/agent-ux/components/inbox-feed"
import { MessageComposer } from "@/features/agent-ux/components/message-composer"
import { SLATimer } from "@/features/agent-ux/components/sla-timer"

const sampleItems: InboxItem[] = [
	{
		id: "ix-1",
		channel: "email",
		subject: "LOA follow-up: HMO requesting documents",
		preview: "Hi, the HMO replied saying they need additional supporting documents…",
		senderName: "patient@example.com",
		senderHandle: null,
		patientId: "patient-maria-santos",
		patientName: "Maria Santos",
		caseRef: "LOA-2026-00128",
		status: "new",
		receivedAt: new Date(Date.now() - 30 * 60 * 1000),
		unansweredMinutes: 30,
		aiSuggestion: {
			categoryKey: "loa_followup",
			categoryLabel: "LOA follow-up",
			confidence: 0.92,
			model: "gpt-stub",
		},
		hasAttachments: true,
	},
	{
		id: "ix-2",
		channel: "phone",
		subject: "Phone call · Outpatient inquiry",
		preview: "Patient called asking about preferred provider list…",
		senderName: "Reception desk",
		senderHandle: null,
		patientId: null,
		patientName: null,
		caseRef: null,
		status: "in_progress",
		receivedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
		unansweredMinutes: null,
		aiSuggestion: null,
		hasAttachments: false,
	},
	{
		id: "ix-3",
		channel: "social_media",
		subject: "Facebook complaint about wait time",
		preview: "@anonymous: Waited 3 hours at the ER on Tuesday…",
		senderName: null,
		senderHandle: "@anonymous",
		patientId: null,
		patientName: "Anonymous",
		caseRef: null,
		status: "new",
		receivedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
		unansweredMinutes: 26 * 60,
		aiSuggestion: {
			categoryKey: "complaint",
			categoryLabel: "Complaint",
			confidence: 0.78,
			model: "gpt-stub",
		},
		hasAttachments: false,
	},
]

const SLA_DEMO = {
	dueIn4h: new Date(Date.now() + 4 * 60 * 60 * 1000),
	dueIn30m: new Date(Date.now() + 30 * 60 * 1000),
	breached2h: new Date(Date.now() - 2 * 60 * 60 * 1000),
}

const FILTER_CHANNELS: FilterChipOption[] = [
	{ value: "email", label: "Email" },
	{ value: "phone", label: "Phone" },
	{ value: "portal_chat", label: "Portal chat" },
	{ value: "social_media", label: "Social media" },
]
const FILTER_STATUSES: FilterChipOption[] = [
	{ value: "new", label: "New" },
	{ value: "in_progress", label: "In progress" },
	{ value: "linked", label: "Linked" },
	{ value: "resolved", label: "Resolved" },
]

export default function AgentDesignShowcasePage() {
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [filters, setFilters] = useState<Record<string, string | undefined>>({})

	return (
		<main className="flex flex-col gap-8">
			<header>
				<h1 className="text-2xl font-bold">Agent UX primitives</h1>
				<p className="text-muted-foreground text-sm">
					CA-FE-02 design showcase. Reusable primitives for the case agent workspace.
				</p>
			</header>

			<section className="flex flex-col gap-3">
				<h2 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
					ChannelBadge
				</h2>
				<div className="flex flex-wrap items-center gap-2">
					<ChannelBadge channel="email" />
					<ChannelBadge channel="phone" />
					<ChannelBadge channel="portal_chat" />
					<ChannelBadge channel="social_media" />
				</div>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
					SLATimer
				</h2>
				<div className="flex flex-wrap items-center gap-2">
					<SLATimer dueAt={SLA_DEMO.dueIn4h} />
					<SLATimer dueAt={SLA_DEMO.dueIn30m} />
					<SLATimer dueAt={SLA_DEMO.breached2h} />
				</div>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
					FilterChipBar
				</h2>
				<FilterChipBar
					chips={[
						{ key: "channel", label: "Channel", options: FILTER_CHANNELS },
						{ key: "status", label: "Status", options: FILTER_STATUSES },
					]}
					selected={filters}
					onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
				/>
				<p className="text-muted-foreground text-xs">
					Selected: <code>{JSON.stringify(filters)}</code>
				</p>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
					InboxFeed
				</h2>
				<div className="max-w-2xl">
					<InboxFeed
						items={sampleItems}
						selectedId={selectedId}
						onSelect={setSelectedId}
					/>
				</div>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
					MessageComposer
				</h2>
				<div className="max-w-2xl">
					<MessageComposer
						templates={[
							{
								key: "loa_followup",
								label: "LOA follow-up template",
								subject: "Update on your LOA request",
								body: "Hi, we wanted to give you an update on your LOA…",
							},
						]}
						onSend={async value => {
							toast.success(`Send (${value.channel}) → ${value.to}`)
						}}
					/>
				</div>
			</section>
		</main>
	)
}
