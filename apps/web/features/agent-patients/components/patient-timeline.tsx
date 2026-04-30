"use client"

import { useState } from "react"

import type { TimelineEntry } from "@repo/contracts"

import { cn } from "@/core/lib/utils"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Skeleton } from "@/core/components/ui/skeleton"
import { usePatientTimelineQuery } from "@/features/agent-patients/api/timeline.hooks"
import { InteractionDetailDrawer } from "@/features/agent-patients/components/interaction-detail-drawer"
import {
	FilterChipBar,
	type FilterChipOption,
} from "@/features/agent-ux/components/filter-chip-bar"
import { ChannelBadge } from "@/features/agent-ux/components/channel-badge"

const CHANNEL_OPTIONS: FilterChipOption[] = [
	{ value: "email", label: "Email" },
	{ value: "phone", label: "Phone" },
	{ value: "portal_chat", label: "Portal chat" },
	{ value: "social_media", label: "Social" },
]

const CASE_TYPE_OPTIONS: FilterChipOption[] = [
	{ value: "loa", label: "LOA" },
	{ value: "follow_up", label: "Follow-up" },
	{ value: "complaint", label: "Complaint" },
]

function formatDateTime(d: Date | string): string {
	const date = d instanceof Date ? d : new Date(d)
	return date.toLocaleString(undefined, {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	})
}

interface TimelineRowProps {
	entry: TimelineEntry
	selected: boolean
	onSelect: () => void
}

function TimelineRow({ entry, selected, onSelect }: TimelineRowProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				"border-border relative flex gap-3 border-l pb-4 pl-4 text-left transition-colors last:pb-0",
				"hover:bg-muted/40",
				selected && "bg-muted/50"
			)}
		>
			<span className="bg-primary absolute -left-1.5 top-1 size-3 rounded-full ring-4 ring-background" />
			<div className="flex flex-1 flex-col gap-1 py-1">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						{entry.channel ? (
							<ChannelBadge
								channel={
									entry.channel as "email" | "phone" | "portal_chat" | "social_media"
								}
							/>
						) : (
							<span className="text-muted-foreground text-[10px] uppercase">
								{entry.kind.replace(/_/g, " ")}
							</span>
						)}
						{entry.caseRef ? (
							<span className="text-muted-foreground font-mono text-[10px]">
								{entry.caseRef}
							</span>
						) : null}
					</div>
					<span className="text-muted-foreground text-[10px] tabular-nums">
						{formatDateTime(entry.occurredAt)}
					</span>
				</div>
				<div>
					<p className="text-sm font-medium">{entry.title}</p>
					{entry.preview ? (
						<p className="text-muted-foreground line-clamp-2 text-xs">{entry.preview}</p>
					) : null}
					{entry.actorName ? (
						<p className="text-muted-foreground mt-0.5 text-[10px]">by {entry.actorName}</p>
					) : null}
				</div>
			</div>
		</button>
	)
}

const PAGE_SIZE = 10

type SortDir = "newest" | "oldest"

export function PatientTimeline({ patientId }: { patientId: string }) {
	const [filters, setFilters] = useState<Record<string, string | undefined>>({})
	const [dateFrom, setDateFrom] = useState("")
	const [dateTo, setDateTo] = useState("")
	const [agentId, setAgentId] = useState("")
	const [sort, setSort] = useState<SortDir>("newest")
	const [visible, setVisible] = useState(PAGE_SIZE)
	const [selectedId, setSelectedId] = useState<string | null>(null)

	const { data, isLoading } = usePatientTimelineQuery(patientId, {
		channel: filters.channel,
		caseType: filters.caseType,
		dateFrom: dateFrom || undefined,
		dateTo: dateTo || undefined,
		agentId: agentId.trim() || undefined,
	})

	const allEntries = [...(data?.entries ?? [])].sort((a, b) => {
		const at = new Date(a.occurredAt).getTime()
		const bt = new Date(b.occurredAt).getTime()
		return sort === "newest" ? bt - at : at - bt
	})
	const visibleEntries = allEntries.slice(0, visible)
	const selectedEntry = allEntries.find(e => e.id === selectedId) ?? null
	const hasMore = visibleEntries.length < allEntries.length

	function clearAdvanced() {
		setDateFrom("")
		setDateTo("")
		setAgentId("")
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center gap-3">
				<FilterChipBar
					chips={[
						{ key: "channel", label: "Channel", options: CHANNEL_OPTIONS },
						{ key: "caseType", label: "Case type", options: CASE_TYPE_OPTIONS },
					]}
					selected={filters}
					onChange={(k, v) => {
						setFilters(prev => ({ ...prev, [k]: v }))
						setVisible(PAGE_SIZE)
					}}
				/>
				<div className="ml-auto flex items-center gap-2">
					<Label htmlFor="tl-sort" className="text-muted-foreground text-[10px] uppercase">
						Sort
					</Label>
					<select
						id="tl-sort"
						value={sort}
						onChange={e => setSort(e.target.value as SortDir)}
						className="border-input bg-background h-8 rounded-md border px-2 text-xs"
					>
						<option value="newest">Newest first</option>
						<option value="oldest">Oldest first</option>
					</select>
				</div>
			</div>

			<div className="bg-muted/30 grid items-end gap-3 rounded-md p-3 sm:grid-cols-4">
				<div className="flex flex-col gap-1">
					<Label htmlFor="tl-from">Date from</Label>
					<Input
						id="tl-from"
						type="date"
						value={dateFrom}
						onChange={e => {
							setDateFrom(e.target.value)
							setVisible(PAGE_SIZE)
						}}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="tl-to">Date to</Label>
					<Input
						id="tl-to"
						type="date"
						value={dateTo}
						onChange={e => {
							setDateTo(e.target.value)
							setVisible(PAGE_SIZE)
						}}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="tl-agent">Agent ID</Label>
					<Input
						id="tl-agent"
						value={agentId}
						onChange={e => {
							setAgentId(e.target.value)
							setVisible(PAGE_SIZE)
						}}
						placeholder="user-uuid"
					/>
				</div>
				<Button variant="ghost" size="sm" onClick={clearAdvanced} className="w-fit">
					Clear advanced
				</Button>
			</div>

			<div className="flex flex-col gap-4 lg:flex-row">
				<div className="min-w-0 flex-1">
					{isLoading || !data ? (
						<div className="flex flex-col gap-3">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className="h-14 w-full" />
							))}
						</div>
					) : allEntries.length === 0 ? (
						<p className="text-muted-foreground text-sm italic">
							No timeline entries match these filters.
						</p>
					) : (
						<>
							<div className="flex flex-col">
								{visibleEntries.map(entry => (
									<TimelineRow
										key={entry.id}
										entry={entry}
										selected={entry.id === selectedId}
										onSelect={() => setSelectedId(entry.id)}
									/>
								))}
							</div>
							{hasMore ? (
								<div className="mt-3 flex justify-center">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setVisible(v => v + PAGE_SIZE)}
									>
										Load more ({allEntries.length - visibleEntries.length} remaining)
									</Button>
								</div>
							) : (
								<p className="text-muted-foreground mt-3 text-center text-[10px] italic">
									End of timeline ({allEntries.length} total).
								</p>
							)}
						</>
					)}
				</div>

				{selectedEntry ? (
					<div className="w-full shrink-0 lg:w-[420px]">
						<InteractionDetailDrawer
							entry={selectedEntry}
							onClose={() => setSelectedId(null)}
						/>
					</div>
				) : null}
			</div>
		</div>
	)
}
