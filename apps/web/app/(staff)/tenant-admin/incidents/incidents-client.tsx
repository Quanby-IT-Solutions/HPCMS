"use client"

import { useState } from "react"
import Link from "next/link"

import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { useTaIncidentsListQuery } from "@/features/tenant-admin/api/tenant-admin.hooks"
import { KpiCard } from "@/features/tenant-admin/components/kpi-card"
import { ReportExportPanel } from "@/features/tenant-admin/components/report-export-panel"
import { ReportFilterBar } from "@/features/tenant-admin/components/report-filter-bar"
import { SeverityBadge } from "@/features/tenant-admin/components/severity-badge"
import { StatusBadge } from "@/features/tenant-admin/components/status-badge"
import { TimeSeriesChart } from "@/features/tenant-admin/components/time-series-chart"
import { exportToCsv } from "@/features/tenant-admin/lib/export-utils"
import type { TaIncidentRow } from "@repo/contracts"

type IncidentRow = TaIncidentRow & { id: string }

type AppliedFilters = {
	severity?: "low" | "medium" | "high" | "critical"
	status?: string
	department?: string
	dateFrom?: string
	dateTo?: string
}

export function IncidentsClient() {
	const [severity, setSeverity] = useState("")
	const [status, setStatus] = useState("")
	const [department, setDepartment] = useState("")
	const [dateFrom, setDateFrom] = useState("")
	const [dateTo, setDateTo] = useState("")
	const [applied, setApplied] = useState<AppliedFilters>({})
	const [page, setPage] = useState(1)

	const { data } = useTaIncidentsListQuery({ ...applied, page, limit: 20 })

	const rows: IncidentRow[] = (data?.items ?? []).map(r => ({ ...r, id: r.incidentId }))

	const severityChartData = data?.severityBreakdown
		? [{ label: "All", ...data.severityBreakdown }]
		: []

	function handleApply() {
		setApplied({
			severity: (severity as AppliedFilters["severity"]) || undefined,
			status: status || undefined,
			department: department || undefined,
			dateFrom: dateFrom || undefined,
			dateTo: dateTo || undefined,
		})
		setPage(1)
	}

	function handleReset() {
		setSeverity(""); setStatus(""); setDepartment(""); setDateFrom(""); setDateTo("")
		setApplied({})
		setPage(1)
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between flex-wrap gap-2">
				<h1 className="text-xl font-semibold">Incident Operations Dashboard</h1>
				<ReportExportPanel
					onExportCsv={() => exportToCsv(
						rows.map(r => ({ id: r.incidentId, title: r.title, severity: r.severity, status: r.status, department: r.department ?? "", cases: r.caseCount, opened: r.createdAt })),
						"incidents.csv"
					)}
				/>
			</div>

			{data?.kpis && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<KpiCard label="Open Incidents" value={data.kpis.openCount} />
					<KpiCard label="Critical" value={data.kpis.criticalCount} />
					<KpiCard label="Avg Resolution (hrs)" value={data.kpis.avgResolutionHours.toFixed(1)} />
					<KpiCard label="Resolved This Month" value={data.kpis.resolvedThisMonth} />
				</div>
			)}

			{severityChartData.length > 0 && (
				<div className="rounded-lg border p-4">
					<h2 className="text-sm font-semibold mb-3">Severity Distribution</h2>
					<TimeSeriesChart
						data={severityChartData}
						lines={[
							{ key: "low", label: "Low", color: "#94a3b8" },
							{ key: "medium", label: "Medium", color: "#eab308" },
							{ key: "high", label: "High", color: "#f97316" },
							{ key: "critical", label: "Critical", color: "#ef4444" },
						]}
						height={200}
						xKey="label"
						chartType="bar"
					/>
				</div>
			)}

			<ReportFilterBar
				filters={[
					{
						key: "severity", label: "Severity", type: "select", value: severity, onChange: setSeverity,
						options: [
							{ value: "low", label: "Low" },
							{ value: "medium", label: "Medium" },
							{ value: "high", label: "High" },
							{ value: "critical", label: "Critical" },
						],
					},
					{
						key: "status", label: "Status", type: "select", value: status, onChange: setStatus,
						options: [
							{ value: "open", label: "Open" },
							{ value: "investigating", label: "Investigating" },
							{ value: "mitigating", label: "Mitigating" },
							{ value: "resolved", label: "Resolved" },
							{ value: "closed", label: "Closed" },
						],
					},
					{ key: "department", label: "Department", type: "text", value: department, onChange: setDepartment },
					{ key: "dateFrom", label: "From", type: "date", value: dateFrom, onChange: setDateFrom },
					{ key: "dateTo", label: "To", type: "date", value: dateTo, onChange: setDateTo },
				]}
				onApply={handleApply}
				onReset={handleReset}
			/>

			<AdminDataTable<IncidentRow>
				columns={[
					{
						key: "title", header: "Title", render: row => (
							<Link href={SUPERVISOR_ROUTES.incidentDetail(row.incidentId)} className="hover:underline font-medium">
								{row.title}
							</Link>
						),
					},
					{ key: "severity", header: "Severity", render: row => <SeverityBadge severity={row.severity} /> },
					{ key: "status", header: "Status", render: row => <StatusBadge status={row.status} /> },
					{ key: "department", header: "Department", render: row => row.department ?? "—" },
					{ key: "caseCount", header: "Cases", render: row => row.caseCount },
					{ key: "createdAt", header: "Opened", render: row => new Date(row.createdAt).toLocaleDateString() },
				]}
				rows={rows}
				totalCount={data?.total}
				page={page}
				pageSize={20}
				onPageChange={setPage}
				emptyMessage="No incidents match the current filters."
			/>
		</div>
	)
}
