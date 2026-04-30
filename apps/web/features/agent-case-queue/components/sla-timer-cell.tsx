import { cn } from "@/core/lib/utils"

interface SlaTimerCellProps {
	dueAt: Date | string | null
	breached: boolean
}

function diffMinutes(target: Date): number {
	return Math.round((target.getTime() - Date.now()) / 60_000)
}

function format(diff: number): string {
	const abs = Math.abs(diff)
	if (abs < 60) return `${abs}m`
	const hours = Math.floor(abs / 60)
	if (abs < 24 * 60) return `${hours}h`
	const days = Math.floor(hours / 24)
	return `${days}d`
}

export function SlaTimerCell({ dueAt, breached }: SlaTimerCellProps) {
	if (!dueAt) {
		return <span className="text-muted-foreground text-xs">—</span>
	}
	const target = dueAt instanceof Date ? dueAt : new Date(dueAt)
	if (Number.isNaN(target.getTime())) {
		return <span className="text-muted-foreground text-xs">—</span>
	}
	const diff = diffMinutes(target)
	const label = breached || diff < 0 ? `Breached ${format(diff)} ago` : `Due in ${format(diff)}`
	const tone =
		breached || diff < 0
			? "text-destructive font-medium"
			: diff < 60
				? "text-amber-600 font-medium dark:text-amber-400"
				: "text-muted-foreground"

	return <span className={cn("text-xs tabular-nums", tone)}>{label}</span>
}
