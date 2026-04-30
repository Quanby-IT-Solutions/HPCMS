"use client"

import { Badge } from "@/core/components/ui/badge"

type CaseTab = "overview" | "communications" | "notes" | "linked" | "claims"

const TABS: { key: CaseTab; label: string }[] = [
	{ key: "overview", label: "Overview" },
	{ key: "communications", label: "Communications" },
	{ key: "notes", label: "Notes" },
	{ key: "linked", label: "Linked" },
	{ key: "claims", label: "Claims" },
]

const PRIORITY_COLORS: Record<string, string> = {
	low: "bg-slate-100 text-slate-700",
	medium: "bg-blue-100 text-blue-700",
	high: "bg-orange-100 text-orange-700",
	urgent: "bg-red-100 text-red-700",
}

const STATUS_COLORS: Record<string, string> = {
	submitted: "bg-yellow-100 text-yellow-700",
	in_review: "bg-blue-100 text-blue-700",
	approved: "bg-green-100 text-green-700",
	rejected: "bg-red-100 text-red-700",
	resolved: "bg-slate-100 text-slate-600",
	escalated: "bg-purple-100 text-purple-700",
}

interface Props {
	caseRef: string
	status: string
	priority: string
	slaMinutesRemaining?: number | null
	activeTab: CaseTab
	onTabChange: (tab: CaseTab) => void
	rightRail?: React.ReactNode
	children: React.ReactNode
}

export function CaseDetailShell({
	caseRef,
	status,
	priority,
	slaMinutesRemaining,
	activeTab,
	onTabChange,
	rightRail,
	children,
}: Props) {
	const slaColor =
		slaMinutesRemaining != null && slaMinutesRemaining < 60
			? "text-destructive font-semibold"
			: "text-muted-foreground"

	const slaLabel =
		slaMinutesRemaining != null
			? slaMinutesRemaining < 60
				? `${slaMinutesRemaining}m remaining`
				: `${Math.floor(slaMinutesRemaining / 60)}h ${slaMinutesRemaining % 60}m remaining`
			: null

	return (
		<div className="flex min-h-screen flex-col">
			<div className="border-b bg-background sticky top-0 z-10">
				<div className="flex items-start justify-between px-6 pt-4 pb-0">
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<span className="font-mono text-lg font-bold">{caseRef}</span>
							<span
								className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
									STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600"
								}`}
							>
								{status.replace(/_/g, " ")}
							</span>
							<span
								className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
									PRIORITY_COLORS[priority] ?? "bg-slate-100 text-slate-600"
								}`}
							>
								{priority}
							</span>
						</div>
						{slaLabel ? (
							<p className={`text-xs ${slaColor}`}>SLA: {slaLabel}</p>
						) : null}
					</div>
				</div>
				<nav className="mt-3 flex gap-0 overflow-x-auto px-6">
					{TABS.map(t => (
						<button
							key={t.key}
							type="button"
							onClick={() => onTabChange(t.key)}
							className={`border-b-2 px-3 py-2 text-sm whitespace-nowrap transition-colors ${
								activeTab === t.key
									? "border-primary text-foreground font-medium"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
						>
							{t.label}
						</button>
					))}
				</nav>
			</div>
			<div className="flex flex-1 gap-6 p-6">
				<div className="min-w-0 flex-1">{children}</div>
				{rightRail ? <aside className="flex w-72 shrink-0 flex-col gap-3">{rightRail}</aside> : null}
			</div>
		</div>
	)
}
