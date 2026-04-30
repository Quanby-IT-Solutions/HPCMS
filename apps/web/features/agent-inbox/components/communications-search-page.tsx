"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import type { Channel, InboxStatus, InboxSearchResultRow } from "@repo/contracts"

import { sessionOptions } from "@/features/auth/api/session.hooks"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { ChannelBadge } from "@/features/agent-ux/components/channel-badge"
import {
	FilterChipBar,
	type FilterChipOption,
} from "@/features/agent-ux/components/filter-chip-bar"
import { orpc } from "@/services/orpc/client"

const CHANNEL_OPTIONS: FilterChipOption[] = [
	{ value: "email", label: "Email" },
	{ value: "phone", label: "Phone" },
	{ value: "portal_chat", label: "Portal chat" },
	{ value: "social_media", label: "Social" },
]
const STATUS_OPTIONS: FilterChipOption[] = [
	{ value: "new", label: "New" },
	{ value: "in_progress", label: "In progress" },
	{ value: "linked", label: "Linked" },
	{ value: "resolved", label: "Resolved" },
]

const ISSUE_TYPES: FilterChipOption[] = [
	{ value: "loa", label: "LOA" },
	{ value: "billing", label: "Billing" },
	{ value: "complaint", label: "Complaint" },
	{ value: "appointment", label: "Appointment" },
]

const PAGE_SIZE = 25

function buildMockRows(): InboxSearchResultRow[] {
	const now = Date.now()
	return [
		{
			id: "ix-1",
			channel: "email",
			patientName: "Maria Santos",
			caseRef: "LOA-2026-00128",
			receivedAt: new Date(now - 30 * 60 * 1000),
			snippet: "HMO replied saying they need additional supporting documents…",
			agentName: "J. Reyes",
			actorIp: "192.168.1.10",
			sessionId: "sess_mock_001",
		},
		{
			id: "ix-3",
			channel: "social_media",
			patientName: "Anonymous",
			caseRef: null,
			receivedAt: new Date(now - 26 * 60 * 60 * 1000),
			snippet: "Waited 3 hours at the ER on Tuesday…",
			agentName: null,
			actorIp: null,
			sessionId: null,
		},
	]
}

function downloadCsv(rows: InboxSearchResultRow[], isTenantAdmin: boolean) {
	const baseHeader = "id,channel,patientName,caseRef,receivedAt,snippet,agentName"
	const auditHeader = isTenantAdmin ? ",actorIp,sessionId" : ""
	const header = `${baseHeader}${auditHeader}\n`
	const body = rows
		.map(r => {
			const base = [
				r.id,
				r.channel,
				JSON.stringify(r.patientName ?? ""),
				r.caseRef ?? "",
				new Date(r.receivedAt).toISOString(),
				JSON.stringify(r.snippet),
				JSON.stringify(r.agentName ?? ""),
			]
			if (isTenantAdmin) {
				base.push(r.actorIp ?? "", r.sessionId ?? "")
			}
			return base.join(",")
		})
		.join("\n")
	const blob = new Blob([header + body], { type: "text/csv" })
	const url = URL.createObjectURL(blob)
	const a = document.createElement("a")
	a.href = url
	a.download = `communications-search-${Date.now()}.csv`
	a.click()
	URL.revokeObjectURL(url)
}

export function CommunicationsSearchPage() {
	const { data: session } = useQuery(sessionOptions)
	const role = (session?.user as { role?: string } | undefined)?.role ?? ""
	const isTenantAdmin = role === "tenant_admin" || role === "system_admin"

	const [q, setQ] = useState("")
	const [filters, setFilters] = useState<Record<string, string | undefined>>({})
	const [agentId, setAgentId] = useState("")
	const [dateFrom, setDateFrom] = useState("")
	const [dateTo, setDateTo] = useState("")
	const [submittedQuery, setSubmittedQuery] = useState("")
	const [page, setPage] = useState(1)
	const [selectedId, setSelectedId] = useState<string | null>(null)

	const { data, isLoading } = useQuery({
		...orpc.inbox.search.queryOptions({
			input: {
				q: submittedQuery,
				channel: filters.channel as Channel | undefined,
				status: filters.status as InboxStatus | undefined,
				caseType: filters.issueType,
				agentId: agentId.trim() || undefined,
				dateFrom: dateFrom || undefined,
				dateTo: dateTo || undefined,
				page,
				limit: PAGE_SIZE,
			},
		}),
		enabled: submittedQuery.length > 0,
		placeholderData: () => ({
			rows: buildMockRows(),
			total: 2,
			page,
			pageSize: PAGE_SIZE,
		}),
	})

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setSubmittedQuery(q.trim())
		setPage(1)
	}

	const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1
	const selectedRow = data?.rows.find(r => r.id === selectedId) ?? null

	return (
		<div className="flex flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">Communications search</h1>
				<p className="text-muted-foreground text-sm">
					Cross-channel search across email, phone logs, portal chat, social media.
				</p>
			</header>

			<form onSubmit={handleSubmit} className="flex max-w-3xl items-end gap-2">
				<div className="flex-1">
					<Input
						value={q}
						onChange={e => setQ(e.target.value)}
						placeholder="Search by keyword, sender, case ref…"
					/>
				</div>
				<Button type="submit">Search</Button>
			</form>

			<FilterChipBar
				chips={[
					{ key: "channel", label: "Channel", options: CHANNEL_OPTIONS },
					{ key: "status", label: "Status", options: STATUS_OPTIONS },
					{ key: "issueType", label: "Issue type", options: ISSUE_TYPES },
				]}
				selected={filters}
				onChange={(k, v) => {
					setFilters(prev => ({ ...prev, [k]: v }))
					setPage(1)
				}}
			/>

			<div className="bg-muted/30 grid items-end gap-3 rounded-md p-3 sm:grid-cols-4">
				<div className="flex flex-col gap-1">
					<Label htmlFor="cs-agent">Agent</Label>
					<Input
						id="cs-agent"
						value={agentId}
						onChange={e => setAgentId(e.target.value)}
						placeholder="agent-uuid"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="cs-from">From</Label>
					<Input
						id="cs-from"
						type="date"
						value={dateFrom}
						onChange={e => setDateFrom(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="cs-to">To</Label>
					<Input
						id="cs-to"
						type="date"
						value={dateTo}
						onChange={e => setDateTo(e.target.value)}
					/>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => {
						setAgentId("")
						setDateFrom("")
						setDateTo("")
						setFilters({})
						setPage(1)
					}}
					className="w-fit"
				>
					Clear all
				</Button>
			</div>

			{submittedQuery.length === 0 ? (
				<p className="text-muted-foreground text-sm italic">Enter a query to begin.</p>
			) : isLoading || !data ? (
				<div className="flex flex-col gap-2">
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton key={i} className="h-12 w-full" />
					))}
				</div>
			) : data.rows.length === 0 ? (
				<p className="text-muted-foreground text-sm">No results.</p>
			) : (
				<>
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground text-xs">
							{data.total} results · page {data.page} of {totalPages}
						</p>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => downloadCsv(data.rows, isTenantAdmin)}
							>
								{isTenantAdmin ? "Export CSV (audit)" : "Export CSV"}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									if (typeof window !== "undefined") window.print()
								}}
							>
								Print / PDF
							</Button>
						</div>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Channel</TableHead>
								<TableHead>Patient</TableHead>
								<TableHead>Case</TableHead>
								<TableHead>Received</TableHead>
								<TableHead>Snippet</TableHead>
								<TableHead>Agent</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.rows.map(r => (
								<TableRow
									key={r.id}
									className={`cursor-pointer ${
										selectedId === r.id ? "bg-muted" : ""
									}`}
									onClick={() =>
										setSelectedId(prev => (prev === r.id ? null : r.id))
									}
								>
									<TableCell>
										<ChannelBadge channel={r.channel} />
									</TableCell>
									<TableCell className="text-xs">{r.patientName ?? "—"}</TableCell>
									<TableCell className="font-mono text-xs">{r.caseRef ?? "—"}</TableCell>
									<TableCell className="text-xs tabular-nums">
										{new Date(r.receivedAt).toLocaleString()}
									</TableCell>
									<TableCell className="text-xs">
										<span className="line-clamp-1">{r.snippet}</span>
									</TableCell>
									<TableCell className="text-xs">{r.agentName ?? "—"}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{selectedRow ? (
						<div className="bg-muted/30 flex flex-col gap-2 rounded-md p-3">
							<div className="flex items-center gap-2">
								<ChannelBadge channel={selectedRow.channel} />
								<span className="text-sm font-medium">{selectedRow.patientName}</span>
								{selectedRow.caseRef ? (
									<span className="font-mono text-[11px]">{selectedRow.caseRef}</span>
								) : null}
							</div>
							<p className="text-sm">{selectedRow.snippet}</p>
							<div className="flex flex-wrap gap-2">
								<a
									href={`/agent/inbox?focus=${selectedRow.id}`}
									className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
								>
									Open in inbox
								</a>
								{selectedRow.caseRef ? (
									<a
										href={`/agent/cases/${selectedRow.caseRef}`}
										className="border-border hover:bg-muted inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium"
									>
										Go to case
									</a>
								) : null}
							</div>
						</div>
					) : null}

					{totalPages > 1 ? (
						<div className="flex items-center justify-end gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled={page <= 1}
								onClick={() => setPage(p => p - 1)}
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								disabled={page >= totalPages}
								onClick={() => setPage(p => p + 1)}
							>
								Next
							</Button>
						</div>
					) : null}
				</>
			)}
		</div>
	)
}
