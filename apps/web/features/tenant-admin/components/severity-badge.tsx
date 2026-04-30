import { cn } from "@/core/lib/utils"

export type Severity = "low" | "medium" | "high" | "critical"

const SEVERITY_CLASSES: Record<Severity, string> = {
	low: "bg-slate-100 text-slate-700 border border-slate-200",
	medium: "bg-yellow-100 text-yellow-800 border border-yellow-200",
	high: "bg-orange-100 text-orange-800 border border-orange-200",
	critical: "bg-red-100 text-red-800 border border-red-200",
}

interface SeverityBadgeProps {
	severity: Severity | string
	className?: string
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
	const classes = SEVERITY_CLASSES[severity as Severity] ?? "bg-gray-100 text-gray-700 border border-gray-200"
	return (
		<span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize", classes, className)}>
			{severity}
		</span>
	)
}
