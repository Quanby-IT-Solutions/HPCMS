"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/core/components/ui/button"
import { X } from "@/core/components/icons"

const STATUS_OPTIONS = ["submitted", "in_review", "approved", "rejected", "closed"] as const
const PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"] as const

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
		params.delete("status")
		params.delete("priority")
		params.delete("page")
		router.push(`?${params.toString()}`)
	}

	const status = searchParams.get("status")
	const priority = searchParams.get("priority")

	return (
		<div className="flex flex-wrap items-center gap-2">
			<select
				className="border-input h-8 rounded-md border px-2 text-sm"
				value={status ?? ""}
				onChange={e => setFilter("status", e.target.value || null)}
			>
				<option value="">All Statuses</option>
				{STATUS_OPTIONS.map(s => (
					<option key={s} value={s}>
						{s.replace(/_/g, " ")}
					</option>
				))}
			</select>

			<select
				className="border-input h-8 rounded-md border px-2 text-sm"
				value={priority ?? ""}
				onChange={e => setFilter("priority", e.target.value || null)}
			>
				<option value="">All Priorities</option>
				{PRIORITY_OPTIONS.map(p => (
					<option key={p} value={p}>
						{p}
					</option>
				))}
			</select>

			{(status || priority) && (
				<Button variant="ghost" size="sm" onClick={clearAll}>
					<X className="mr-1 size-3" />
					Clear
				</Button>
			)}
		</div>
	)
}
