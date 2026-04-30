"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { TrendAlert } from "@repo/contracts"

import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import { Textarea } from "@/core/components/ui/textarea"
import {
	useAcknowledgeAlertMutation,
	useTrendAlertsQuery,
} from "@/features/supervisor-insights/api/supervisor-insights.hooks"

const SEVERITY_STYLES: Record<string, string> = {
	info: "bg-blue-100 text-blue-700",
	warning: "bg-yellow-100 text-yellow-700",
	critical: "bg-red-100 text-red-700",
}

const SEVERITY_BORDER: Record<string, string> = {
	info: "border-blue-200",
	warning: "border-yellow-200",
	critical: "border-red-200",
}

interface AlertDetailPanelProps {
	alert: TrendAlert
	onClose: () => void
}

function AlertDetailPanel({ alert, onClose }: AlertDetailPanelProps) {
	const acknowledge = useAcknowledgeAlertMutation()
	const [note, setNote] = useState("")

	async function handleAcknowledge() {
		try {
			await acknowledge.mutateAsync({ alertId: alert.alertId, note })
			toast.success("Alert acknowledged")
			onClose()
		} catch (err) {
			toast.error("Failed", { description: (err as Error).message })
		}
	}

	return (
		<div className="rounded-md border p-4 flex flex-col gap-3 bg-muted/30">
			<div className="flex items-start justify-between gap-2">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${SEVERITY_STYLES[alert.severity]}`}>
							{alert.severity}
						</span>
						<span className="text-xs text-muted-foreground font-mono">{alert.alertType}</span>
					</div>
					<h3 className="font-semibold">{alert.title}</h3>
				</div>
				<Button variant="ghost" size="sm" className="h-6 text-xs" onClick={onClose}>Close</Button>
			</div>

			<div className="flex flex-col gap-1">
				<p className="text-xs font-medium text-muted-foreground">Affected Cases ({alert.affectedCaseRefs.length})</p>
				<div className="flex flex-wrap gap-1">
					{alert.affectedCaseRefs.map(ref => (
						<a
							key={ref}
							href={SUPERVISOR_ROUTES.caseDetail(ref)}
							className="font-mono text-[11px] bg-background border rounded px-1.5 py-0.5 hover:bg-muted"
						>
							{ref}
						</a>
					))}
				</div>
			</div>

			{alert.channelBreakdown ? (
				<div className="flex flex-col gap-1">
					<p className="text-xs font-medium text-muted-foreground">Channel Breakdown</p>
					<div className="flex flex-wrap gap-2">
						{Object.entries(alert.channelBreakdown).map(([ch, count]) => (
							<span key={ch} className="text-xs bg-background border rounded px-2 py-0.5">
								{ch}: <strong>{count}</strong>
							</span>
						))}
					</div>
				</div>
			) : null}

			<div className="text-xs text-muted-foreground">
				Last updated: {new Date(alert.lastUpdated).toLocaleString()}
			</div>

			{alert.acknowledgedAt ? (
				<div className="rounded bg-green-50 border border-green-200 p-2 text-xs text-green-800">
					Acknowledged by <strong>{alert.acknowledgedBy}</strong> at {new Date(alert.acknowledgedAt).toLocaleString()}
					{alert.acknowledgeNote ? <p className="mt-0.5 italic">"{alert.acknowledgeNote}"</p> : null}
				</div>
			) : (
				<div className="flex flex-col gap-2">
					<Textarea
						placeholder="Acknowledge note (optional)…"
						value={note}
						onChange={e => setNote(e.target.value)}
						rows={2}
						maxLength={500}
						className="text-xs"
					/>
					<div className="flex gap-2">
						<Button size="sm" onClick={handleAcknowledge} disabled={acknowledge.isPending}>
							{acknowledge.isPending ? "Acknowledging…" : "Acknowledge"}
						</Button>
						<a href={SUPERVISOR_ROUTES.incidentNew + "?cases=" + alert.affectedCaseRefs.join(",")}>
							<Button size="sm" variant="outline">Escalate to Major Incident</Button>
						</a>
					</div>
				</div>
			)}
		</div>
	)
}

export function InsightsDashboard() {
	const { data, isLoading } = useTrendAlertsQuery()
	const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)
	const alerts = data?.alerts ?? []

	if (isLoading) {
		return (
			<div className="flex flex-col gap-3">
				{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
			</div>
		)
	}

	const selected = alerts.find(a => a.alertId === selectedAlertId)

	return (
		<div className="flex flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">AI Insights</h1>
				<p className="text-muted-foreground text-sm">Trend alerts and patterns detected across cases.</p>
			</header>

			<div className="grid grid-cols-3 gap-3">
				{[
					{ label: "Total Alerts", value: alerts.length },
					{ label: "Critical", value: alerts.filter(a => a.severity === "critical").length },
					{ label: "Unacknowledged", value: alerts.filter(a => !a.acknowledgedAt).length },
				].map(k => (
					<div key={k.label} className="rounded-md border p-3">
						<p className="text-muted-foreground text-xs">{k.label}</p>
						<p className="text-2xl font-bold mt-0.5">{k.value}</p>
					</div>
				))}
			</div>

			{selected ? (
				<AlertDetailPanel alert={selected} onClose={() => setSelectedAlertId(null)} />
			) : null}

			<div className="flex flex-col gap-2">
				{alerts.map(alert => (
					<button
						key={alert.alertId}
						className={`rounded-md border p-3 text-left transition-colors hover:bg-muted/40 ${SEVERITY_BORDER[alert.severity]} ${alert.acknowledgedAt ? "opacity-60" : ""} ${selectedAlertId === alert.alertId ? "bg-muted/40 ring-1 ring-primary" : ""}`}
						onClick={() => setSelectedAlertId(prev => prev === alert.alertId ? null : alert.alertId)}
					>
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${SEVERITY_STYLES[alert.severity]}`}>
									{alert.severity}
								</span>
								<span className="font-medium text-sm">{alert.title}</span>
								{alert.acknowledgedAt ? (
									<span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[11px] font-medium">acknowledged</span>
								) : null}
							</div>
							<span className="text-xs text-muted-foreground shrink-0">
								{alert.affectedCaseRefs.length} cases
							</span>
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							{new Date(alert.lastUpdated).toLocaleString()}
						</p>
					</button>
				))}

				{alerts.length === 0 ? (
					<p className="text-sm text-muted-foreground">No trend alerts at this time.</p>
				) : null}
			</div>
		</div>
	)
}
