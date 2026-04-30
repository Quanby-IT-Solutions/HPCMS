"use client"

import { KpiCard } from "@/features/tenant-admin/components/kpi-card"
import { TimeSeriesChart } from "@/features/tenant-admin/components/time-series-chart"
import { SeverityBadge } from "@/features/tenant-admin/components/severity-badge"
import { StatusBadge } from "@/features/tenant-admin/components/status-badge"
import { ReportFilterBar } from "@/features/tenant-admin/components/report-filter-bar"
import { ReportExportPanel } from "@/features/tenant-admin/components/report-export-panel"
import { exportToCsv, exportToPdfPrint } from "@/features/tenant-admin/lib/export-utils"

const chartData = [
	{ date: "Jan", logins: 120, anomalies: 3 },
	{ date: "Feb", logins: 98, anomalies: 1 },
	{ date: "Mar", logins: 145, anomalies: 5 },
	{ date: "Apr", logins: 110, anomalies: 2 },
]

export default function TenantAdminDesignShowcase() {
	return (
		<div className="flex flex-col gap-8 p-6 max-w-4xl">
			<div>
				<h1 className="text-2xl font-bold mb-1">Tenant Admin Design Showcase</h1>
				<p className="text-muted-foreground text-sm">All component primitives with fixture data.</p>
			</div>

			<section>
				<h2 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">KPI Cards</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<KpiCard label="Total Logins" value="128" delta={12} />
					<KpiCard label="Success Rate" value="92%" delta={-3} />
					<KpiCard label="Failed Attempts" value="10" />
					<KpiCard label="Suspicious" value="1" delta={0} />
				</div>
			</section>

			<section>
				<h2 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">Time Series Chart</h2>
				<div className="rounded-lg border p-4">
					<TimeSeriesChart
						data={chartData}
						xKey="date"
						lines={[
							{ key: "logins", label: "Logins", color: "#6366f1" },
							{ key: "anomalies", label: "Anomalies", color: "#ef4444" },
						]}
					/>
				</div>
			</section>

			<section>
				<h2 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">Severity Badges</h2>
				<div className="flex gap-2 flex-wrap">
					<SeverityBadge severity="low" />
					<SeverityBadge severity="medium" />
					<SeverityBadge severity="high" />
					<SeverityBadge severity="critical" />
				</div>
			</section>

			<section>
				<h2 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">Status Badges</h2>
				<div className="flex gap-2 flex-wrap">
					<StatusBadge status="active" />
					<StatusBadge status="inactive" />
					<StatusBadge status="compliant" />
					<StatusBadge status="partial" />
					<StatusBadge status="non_compliant" />
					<StatusBadge status="not_assessed" />
					<StatusBadge status="success" />
					<StatusBadge status="blocked" />
					<StatusBadge status="suspicious" />
					<StatusBadge status="draft" />
				</div>
			</section>

			<section>
				<h2 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">Report Filter Bar</h2>
				<ReportFilterBar
					filters={[
						{ key: "actionType", label: "Action Type", type: "text", value: "", onChange: () => {} },
						{ key: "dateFrom", label: "From", type: "date", value: "", onChange: () => {} },
						{ key: "outcome", label: "Outcome", type: "select", value: "", onChange: () => {}, options: [{ value: "success", label: "Success" }, { value: "blocked", label: "Blocked" }] },
					]}
					onApply={() => {}}
					onReset={() => {}}
				/>
			</section>

			<section>
				<h2 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">Export Panel</h2>
				<ReportExportPanel
					onExportCsv={() => exportToCsv(chartData, "sample-export.csv")}
					onExportPdf={exportToPdfPrint}
				/>
			</section>
		</div>
	)
}
