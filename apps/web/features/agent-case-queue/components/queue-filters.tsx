"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { X } from "@/core/components/icons"

const STATUS_OPTIONS = ["submitted", "in_review", "approved", "rejected", "closed"] as const
const PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"] as const
const RISK_OPTIONS = ["low", "moderate", "high", "critical"] as const
const TYPE_OPTIONS = ["loa", "follow_up", "complaint"] as const
const SORT_OPTIONS = [
	{ value: "oldest_first", label: "Oldest first (age)" },
	{ value: "newest_first", label: "Newest first (last update)" },
	{ value: "priority_desc", label: "Priority (highest)" },
	{ value: "sla_breach", label: "SLA breach first" },
	{ value: "risk_desc", label: "Risk (highest first)" },
] as const

const FILTER_KEYS = ["status", "priority", "risk", "type", "agent", "from", "to", "sort"] as const

export function QueueFilters() {
	const searchParams = useSearchParams()
	const router = useRouter()

	function setFilter(key: string, value: string | null) {
		const params = new URLSearchParams(searchParams.toString())
		if (value) params.set(key, value)
		else params.delete(key)
		params.delete("page")
		router.push(`?${params.toString()}`)
	}

	function clearAll() {
		const params = new URLSearchParams(searchParams.toString())
		for (const k of FILTER_KEYS) params.delete(k)
		params.delete("page")
		router.push(`?${params.toString()}`)
	}

	const status = searchParams.get("status")
	const priority = searchParams.get("priority")
	const risk = searchParams.get("risk")
	const type = searchParams.get("type")
	const agent = searchParams.get("agent")
	const from = searchParams.get("from")
	const to = searchParams.get("to")
	const sort = searchParams.get("sort") ?? "oldest_first"
	const hasFilter = !!(status || priority || risk || type || agent || from || to)

	return (
		<div className="bg-muted/30 flex flex-wrap items-end gap-2 rounded-md p-3">
			<select
				className="border-input bg-background h-8 rounded-md border px-2 text-sm"
				value={status ?? ""}
				onChange={e => setFilter("status", e.target.value || null)}
				aria-label="Status filter"
			>
				<option value="">All Statuses</option>
				{STATUS_OPTIONS.map(s => (
					<option key={s} value={s}>
						{s.replace(/_/g, " ")}
					</option>
				))}
			</select>

			<select
				className="border-input bg-background h-8 rounded-md border px-2 text-sm"
				value={priority ?? ""}
				onChange={e => setFilter("priority", e.target.value || null)}
				aria-label="Priority filter"
			>
				<option value="">All Priorities</option>
				{PRIORITY_OPTIONS.map(p => (
					<option key={p} value={p}>
						{p}
					</option>
				))}
			</select>

			<select
				className="border-input bg-background h-8 rounded-md border px-2 text-sm"
				value={risk ?? ""}
				onChange={e => setFilter("risk", e.target.value || null)}
				aria-label="Risk filter"
			>
				<option value="">All Risk</option>
				{RISK_OPTIONS.map(r => (
					<option key={r} value={r}>
						{r}
					</option>
				))}
			</select>

			<select
				className="border-input bg-background h-8 rounded-md border px-2 text-sm"
				value={type ?? ""}
				onChange={e => setFilter("type", e.target.value || null)}
				aria-label="Case type filter"
			>
				<option value="">All Types</option>
				{TYPE_OPTIONS.map(t => (
					<option key={t} value={t}>
						{t.replace(/_/g, " ")}
					</option>
				))}
			</select>

			<Input
				type="text"
				value={agent ?? ""}
				onChange={e => setFilter("agent", e.target.value || null)}
				placeholder="Agent ID"
				className="h-8 w-32"
				aria-label="Agent filter"
			/>

			<Input
				type="date"
				value={from ?? ""}
				onChange={e => setFilter("from", e.target.value || null)}
				className="h-8 w-36"
				aria-label="From date"
			/>
			<Input
				type="date"
				value={to ?? ""}
				onChange={e => setFilter("to", e.target.value || null)}
				className="h-8 w-36"
				aria-label="To date"
			/>

			<select
				className="border-input bg-background h-8 rounded-md border px-2 text-sm"
				value={sort}
				onChange={e => setFilter("sort", e.target.value)}
				aria-label="Sort"
			>
				{SORT_OPTIONS.map(o => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</select>

			{hasFilter ? (
				<Button variant="ghost" size="sm" onClick={clearAll}>
					<X className="mr-1 size-3" />
					Clear
				</Button>
			) : null}
		</div>
	)
}
