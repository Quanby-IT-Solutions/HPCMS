import type { CaseStatus } from "@repo/contracts"

import { CheckCircle } from "@/core/components/icons"
import { cn } from "@/core/lib/utils"

const STEPS: Array<{
	key: CaseStatus | "received"
	label: string
}> = [
	{ key: "received", label: "Received" },
	{ key: "in_review", label: "Under review" },
	{ key: "approved", label: "Approved" },
	{ key: "closed", label: "Closed" },
]

function indexOfStatus(status: CaseStatus): number {
	switch (status) {
		case "submitted":
			return 0
		case "in_review":
			return 1
		case "approved":
			return 2
		case "closed":
			return 3
		case "rejected":
		case "withdrawn":
			return -1
		default:
			return 0
	}
}

export function StatusStepper({ status }: { status: CaseStatus }) {
	const isTerminal = status === "rejected" || status === "withdrawn"
	const idx = indexOfStatus(status)

	if (isTerminal) {
		return (
			<div
				className={cn(
					"rounded-md border p-3 text-sm",
					status === "rejected"
						? "border-destructive/40 bg-destructive/5 text-destructive"
						: "bg-muted/30 text-muted-foreground"
				)}
			>
				This request was {status === "rejected" ? "rejected" : "withdrawn"}.
			</div>
		)
	}

	return (
		<ol className="flex items-center justify-between gap-2">
			{STEPS.map((step, i) => {
				const done = i < idx
				const current = i === idx
				const upcoming = i > idx
				return (
					<li key={step.key} className="flex flex-1 flex-col items-center gap-1.5">
						<div
							className={cn(
								"flex size-8 items-center justify-center rounded-full border text-xs font-semibold",
								done && "bg-primary border-primary text-primary-foreground",
								current && "border-primary text-primary bg-primary/10",
								upcoming && "border-border text-muted-foreground bg-background"
							)}
						>
							{done ? <CheckCircle className="size-4" /> : i + 1}
						</div>
						<span
							className={cn(
								"text-center text-[11px]",
								current ? "text-foreground font-semibold" : "text-muted-foreground"
							)}
						>
							{step.label}
						</span>
					</li>
				)
			})}
		</ol>
	)
}
