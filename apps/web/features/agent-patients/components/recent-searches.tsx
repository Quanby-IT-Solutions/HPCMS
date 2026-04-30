"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

const STORAGE_KEY = "pcms.agent.recentPatientSearches"
const MAX_RECENT = 5

export function pushRecentSearch(query: string) {
	if (typeof window === "undefined") return
	const trimmed = query.trim()
	if (trimmed.length < 2) return
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY)
		const list: string[] = raw ? JSON.parse(raw) : []
		const next = [trimmed, ...list.filter(q => q !== trimmed)].slice(0, MAX_RECENT)
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
	} catch {
		// localStorage unavailable; ignore.
	}
}

export function RecentSearches() {
	const [recent, setRecent] = useState<string[]>([])

	useEffect(() => {
		// Defer initial read to next microtask to satisfy the synchronous-setState rule.
		const initial = setTimeout(() => {
			try {
				const raw = window.localStorage.getItem(STORAGE_KEY)
				if (raw) setRecent(JSON.parse(raw))
			} catch {
				// ignore
			}
		}, 0)

		function onStorage(e: StorageEvent) {
			if (e.key === STORAGE_KEY) {
				try {
					setRecent(e.newValue ? JSON.parse(e.newValue) : [])
				} catch {
					setRecent([])
				}
			}
		}
		window.addEventListener("storage", onStorage)
		return () => {
			clearTimeout(initial)
			window.removeEventListener("storage", onStorage)
		}
	}, [])

	if (recent.length === 0) {
		return (
			<p className="text-muted-foreground text-xs italic">
				No recent searches yet — your last {MAX_RECENT} queries appear here after you search.
			</p>
		)
	}

	return (
		<ul className="flex flex-wrap gap-2">
			{recent.map(q => (
				<li key={q}>
					<Link
						href={`/agent/patients/results?q=${encodeURIComponent(q)}`}
						className="border-border bg-muted/40 hover:bg-muted text-foreground inline-flex rounded-full border px-3 py-1 text-xs"
					>
						{q}
					</Link>
				</li>
			))}
		</ul>
	)
}
