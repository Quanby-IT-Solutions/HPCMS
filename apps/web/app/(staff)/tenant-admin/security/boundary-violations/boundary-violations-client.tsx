"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/core/components/ui/button"
import { Textarea } from "@/core/components/ui/textarea"
import { Label } from "@/core/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/core/components/ui/sheet"
import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { useBoundaryViolationsListQuery, useResolveBoundaryViolationMutation } from "@/features/tenant-admin/api/tenant-admin.hooks"
import { exportToCsv } from "@/features/tenant-admin/lib/export-utils"
import { KpiCard } from "@/features/tenant-admin/components/kpi-card"
import { ReportExportPanel } from "@/features/tenant-admin/components/report-export-panel"
import { ReportFilterBar } from "@/features/tenant-admin/components/report-filter-bar"
import { SeverityBadge, type Severity } from "@/features/tenant-admin/components/severity-badge"
import { StatusBadge } from "@/features/tenant-admin/components/status-badge"

interface BVRow {
	id: string
	violationType: string
	severity: Severity
	outcome?: "blocked" | "allowed_with_flag"
	actorName: string
	actorRole?: string
	sourceTenantId?: string
	targetResourceType: string
	ruleViolated: string
	detectedAt: string
	isResolved: boolean
	ipAddress: string | null
	targetTenantId: string
	resolutionNote: string | null
	[key: string]: unknown
}

type SeverityFilter = "low" | "medium" | "high" | "critical"
type OutcomeFilter = "blocked" | "allowed_with_flag"

export function BoundaryViolationsClient() {
	const [filters, setFilters] = useState({ severity: "", outcome: "", actorUserId: "", isResolved: "", dateFrom: "", dateTo: "" })
	const [applied, setApplied] = useState(filters)
	const [page, setPage] = useState(1)
	const [resolveTarget, setResolveTarget] = useState<BVRow | null>(null)
	const [note, setNote] = useState("")

	const { data, isLoading } = useBoundaryViolationsListQuery({
		...applied,
		severity: (applied.severity || undefined) as SeverityFilter | undefined,
		outcome: (applied.outcome || undefined) as OutcomeFilter | undefined,
		actorUserId: applied.actorUserId || undefined,
		isResolved: applied.isResolved === "" ? undefined : applied.isResolved === "true",
		page,
		limit: 20,
	})

	const resolveMutation = useResolveBoundaryViolationMutation()

	function handleApply() { setApplied(filters); setPage(1) }
	function handleReset() {
		const empty = { severity: "", outcome: "", actorUserId: "", isResolved: "", dateFrom: "", dateTo: "" }
		setFilters(empty); setApplied(empty); setPage(1)
	}

	const rows = (data?.items ?? []) as BVRow[]

	async function handleResolve() {
		if (!resolveTarget || !note.trim()) return
		await resolveMutation.mutateAsync({ id: resolveTarget.id, note })
		setResolveTarget(null)
		setNote("")
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold">Boundary Violations</h1>
				<ReportExportPanel
					onExportCsv={() =>
						exportToCsv(
							rows.map(r => ({ violationType: r.violationType, severity: r.severity, actorName: r.actorName, targetResourceType: r.targetResourceType, ruleViolated: r.ruleViolated, detectedAt: r.detectedAt, isResolved: String(r.isResolved) })),
							"boundary-violations.csv"
						)
					}
				/>
			</div>
			{data?.kpis && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<KpiCard label="Open Critical" value={data.kpis.openCritical} />
					<KpiCard label="Open Warning" value={data.kpis.openWarning} />
					<KpiCard label="Resolved This Week" value={data.kpis.resolvedThisWeek} />
					<KpiCard label="Total Unresolved" value={data.kpis.totalUnresolved} />
				</div>
			)}
			<ReportFilterBar
				filters={[
					{ key: "outcome", label: "Outcome", type: "select", value: filters.outcome, onChange: v => setFilters(f => ({ ...f, outcome: v })), options: [
						{ value: "blocked", label: "Blocked" },
						{ value: "allowed_with_flag", label: "Allowed (flagged)" },
					]},
					{ key: "severity", label: "Severity", type: "select", value: filters.severity, onChange: v => setFilters(f => ({ ...f, severity: v })), options: [
						{ value: "low", label: "Low" },
						{ value: "medium", label: "Medium" },
						{ value: "high", label: "High" },
						{ value: "critical", label: "Critical" },
					]},
					{ key: "actorUserId", label: "User ID", type: "text", value: filters.actorUserId, onChange: v => setFilters(f => ({ ...f, actorUserId: v })) },
					{ key: "isResolved", label: "Status", type: "select", value: filters.isResolved, onChange: v => setFilters(f => ({ ...f, isResolved: v })), options: [
						{ value: "false", label: "Unresolved" },
						{ value: "true", label: "Resolved" },
					]},
					{ key: "dateFrom", label: "From", type: "date", value: filters.dateFrom, onChange: v => setFilters(f => ({ ...f, dateFrom: v })) },
					{ key: "dateTo", label: "To", type: "date", value: filters.dateTo, onChange: v => setFilters(f => ({ ...f, dateTo: v })) },
				]}
				onApply={handleApply}
				onReset={handleReset}
			/>
			<AdminDataTable
				isLoading={isLoading}
				rows={rows}
				totalCount={data?.total}
				page={page}
				pageSize={20}
				onPageChange={setPage}
				rowActions={[{ label: "Resolve", onClick: row => { setResolveTarget(row as BVRow); setNote("") } }]}
				columns={[
					{ key: "violationType", header: "Violation Type", render: r => (
						<Link href={`/tenant-admin/audit?actorUserId=${String(r.actorUserId ?? "")}&dateFrom=${r.detectedAt.slice(0, 10)}&recordType=BoundaryViolation`} className="underline text-primary hover:opacity-80">{r.violationType}</Link>
					), sortable: true },
					{ key: "severity", header: "Severity", render: r => <SeverityBadge severity={r.severity} /> },
					{ key: "actorName", header: "Actor", render: r => r.actorName },
					{ key: "actorRole", header: "Role", render: r => (r.actorRole as string) ?? "—" },
					{ key: "sourceTenantId", header: "Source Tenant", render: r => (r.sourceTenantId as string) ?? "—" },
					{ key: "targetTenantId", header: "Target Tenant", render: r => r.targetTenantId ?? "—" },
					{ key: "outcome", header: "Outcome", render: r => {
						const o = r.outcome as string | undefined
						if (!o) return <span className="text-muted-foreground text-xs">—</span>
						return o === "blocked"
							? <span className="text-red-600 text-xs font-medium">Blocked</span>
							: <span className="text-yellow-600 text-xs font-medium">Allowed (flagged)</span>
					}},
					{ key: "targetResourceType", header: "Resource", render: r => r.targetResourceType },
					{ key: "ruleViolated", header: "Rule", render: r => r.ruleViolated },
					{ key: "detectedAt", header: "Detected", render: r => new Date(r.detectedAt).toLocaleString(), sortable: true },
					{ key: "isResolved", header: "Status", render: r => <StatusBadge status={r.isResolved ? "resolved" : "open"} /> },
				]}
			/>

			<Sheet open={!!resolveTarget} onOpenChange={open => { if (!open) setResolveTarget(null) }}>
				<SheetContent className="w-full max-w-md">
					<SheetHeader>
						<SheetTitle>Resolve Violation</SheetTitle>
					</SheetHeader>
					{resolveTarget && (
						<div className="mt-4 flex flex-col gap-4 text-sm">
							<dl className="grid grid-cols-2 gap-x-4 gap-y-2">
								<dt className="text-muted-foreground">Type</dt><dd>{resolveTarget.violationType}</dd>
								<dt className="text-muted-foreground">Severity</dt><dd><SeverityBadge severity={resolveTarget.severity} /></dd>
								<dt className="text-muted-foreground">Actor</dt><dd>{resolveTarget.actorName}</dd>
								<dt className="text-muted-foreground">Rule</dt><dd>{resolveTarget.ruleViolated}</dd>
							</dl>
							<div>
								<Label htmlFor="resolution-note" className="text-xs mb-1 block">Resolution Note (required)</Label>
								<Textarea id="resolution-note" value={note} onChange={e => setNote(e.target.value)} placeholder="Describe the resolution action taken..." rows={4} />
							</div>
							<div className="flex gap-2">
								<Button onClick={handleResolve} disabled={!note.trim() || resolveMutation.isPending} size="sm">
									{resolveMutation.isPending ? "Saving..." : "Mark Resolved"}
								</Button>
								<Button variant="outline" size="sm" onClick={() => setResolveTarget(null)}>Cancel</Button>
							</div>
						</div>
					)}
				</SheetContent>
			</Sheet>
		</div>
	)
}
