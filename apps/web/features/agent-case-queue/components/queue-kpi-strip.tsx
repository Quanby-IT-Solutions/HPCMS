"use client"

import { useQueueKpisQuery } from "@/features/agent-case-queue/api/queue.hooks"

export function QueueKpiStrip() {
	const { data } = useQueueKpisQuery()

	const cards: Array<{ label: string; value: number; tone?: "warn" | "danger" }> = [
		{ label: "Mine", value: data?.mineCount ?? 0 },
		{ label: "Team", value: data?.teamCount ?? 0 },
		{ label: "All open", value: data?.allOpenCount ?? 0 },
		{ label: "SLA breaching", value: data?.slaBreachingCount ?? 0, tone: "warn" },
		{ label: "Critical risk", value: data?.criticalRiskCount ?? 0, tone: "danger" },
	]

	return (
		<dl className="grid grid-cols-2 gap-2 sm:grid-cols-5">
			{cards.map(card => (
				<div
					key={card.label}
					className={`rounded-md border p-2.5 ${
						card.tone === "danger"
							? "border-destructive/40 bg-destructive/5"
							: card.tone === "warn"
								? "border-amber-500/40 bg-amber-500/5"
								: "bg-muted/40"
					}`}
				>
					<dt className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
						{card.label}
					</dt>
					<dd className="text-foreground mt-0.5 text-xl font-semibold">{card.value}</dd>
				</div>
			))}
		</dl>
	)
}
