import { cn } from "@/core/lib/utils"

export const DEFAULT_COLOR_MAP: Record<string, string> = {
	active: "bg-green-100 text-green-800 border border-green-200",
	compliant: "bg-green-100 text-green-800 border border-green-200",
	success: "bg-green-100 text-green-800 border border-green-200",
	consented: "bg-green-100 text-green-800 border border-green-200",
	resolved: "bg-green-100 text-green-800 border border-green-200",
	partial: "bg-yellow-100 text-yellow-800 border border-yellow-200",
	draft: "bg-yellow-100 text-yellow-800 border border-yellow-200",
	suspicious: "bg-yellow-100 text-yellow-800 border border-yellow-200",
	failed_credentials: "bg-red-100 text-red-800 border border-red-200",
	failed_mfa: "bg-red-100 text-red-800 border border-red-200",
	blocked: "bg-red-100 text-red-800 border border-red-200",
	non_compliant: "bg-red-100 text-red-800 border border-red-200",
	withdrawn: "bg-red-100 text-red-800 border border-red-200",
	inactive: "bg-slate-100 text-slate-700 border border-slate-200",
	not_assessed: "bg-slate-100 text-slate-700 border border-slate-200",
	open: "bg-blue-100 text-blue-800 border border-blue-200",
	pending: "bg-blue-100 text-blue-800 border border-blue-200",
}

interface StatusBadgeProps {
	status: string
	colorMap?: Record<string, string>
	className?: string
}

export function StatusBadge({ status, colorMap, className }: StatusBadgeProps) {
	const map = colorMap ?? DEFAULT_COLOR_MAP
	const classes = map[status] ?? "bg-gray-100 text-gray-700 border border-gray-200"
	const label = status.replace(/_/g, " ")
	return (
		<span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize", classes, className)}>
			{label}
		</span>
	)
}
