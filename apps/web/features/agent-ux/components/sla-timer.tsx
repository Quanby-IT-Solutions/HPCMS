"use client"

import { useEffect, useState } from "react"

import { cn } from "@/core/lib/utils"

interface SLATimerProps {
	dueAt: Date | string | null
	startedAt?: Date | string | null
	breached?: boolean
	className?: string
}

function format(diff: number): string {
	const abs = Math.abs(diff)
	if (abs < 60) return `${abs}m`
	const hours = Math.floor(abs / 60)
	if (abs < 24 * 60) return `${hours}h ${abs % 60}m`
	const days = Math.floor(hours / 24)
	return `${days}d`
}

/**
 * Generic SLA timer used in inbox/queue/composer rows.
 * Warns at 75% elapsed, marks breached at 100%.
 *
 * Uses an internal `now` state that updates every minute on the client to
 * keep React purity rules happy — `Date.now()` is never called during render.
 */
export function SLATimer({ dueAt, startedAt, breached, className }: SLATimerProps) {
	const [now, setNow] = useState<number | null>(null)

	useEffect(() => {
		// Defer the initial setNow to the next microtask so the effect doesn't
		// trigger a synchronous re-render in the same commit.
		const initial = setTimeout(() => setNow(Date.now()), 0)
		const id = setInterval(() => setNow(Date.now()), 60_000)
		return () => {
			clearTimeout(initial)
			clearInterval(id)
		}
	}, [])

	if (!dueAt || now === null) {
		return (
			<span
				className={cn(
					"text-muted-foreground inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
					className
				)}
			>
				—
			</span>
		)
	}
	const target = dueAt instanceof Date ? dueAt : new Date(dueAt)
	if (Number.isNaN(target.getTime())) return null

	const remaining = Math.round((target.getTime() - now) / 60_000)
	const isBreached = breached ?? remaining < 0

	let tone: string
	if (isBreached) {
		tone = "bg-destructive/10 text-destructive border-destructive/30"
	} else if (startedAt) {
		const start = startedAt instanceof Date ? startedAt : new Date(startedAt)
		const total = (target.getTime() - start.getTime()) / 60_000
		const elapsed = (now - start.getTime()) / 60_000
		const pct = total > 0 ? elapsed / total : 0
		tone =
			pct >= 0.75
				? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
				: "bg-muted/50 text-muted-foreground border-border"
	} else {
		tone =
			remaining < 60
				? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
				: "bg-muted/50 text-muted-foreground border-border"
	}

	const label = isBreached
		? `Breached ${format(remaining)}`
		: `Due in ${format(remaining)}`

	return (
		<span
			className={cn(
				"inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
				tone,
				className
			)}
		>
			{label}
		</span>
	)
}
