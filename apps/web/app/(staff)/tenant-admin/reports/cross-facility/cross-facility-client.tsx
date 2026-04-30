"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { useGenerateCrossFacilityReportMutation } from "@/features/tenant-admin/api/tenant-admin.hooks"
import { ReportExportPanel } from "@/features/tenant-admin/components/report-export-panel"
import { exportToCsv, exportToPdfPrint } from "@/features/tenant-admin/lib/export-utils"
import type { CrossFacilityMetric, CrossFacilityReportOutput } from "@repo/contracts"

const REPORT_TYPES: { metric: CrossFacilityMetric; label: string; description: string }[] = [
	{ metric: "case_volume", label: "Case Volume", description: "Total cases per facility over the selected period." },
	{ metric: "resolution_time", label: "Resolution Time", description: "Average case resolution hours by facility." },
	{ metric: "sla_compliance", label: "SLA Compliance", description: "SLA adherence rate across facilities." },
	{ metric: "incident_count", label: "Incident Rate", description: "Number of incidents raised per facility." },
]

const MOCK_TENANTS = [
	{ id: "tenant-01", name: "Metro General Hospital" },
	{ id: "tenant-02", name: "Eastside Medical Center" },
	{ id: "tenant-03", name: "Northview Clinic" },
]

type RecentReport = { generatedAt: string; label: string; result: CrossFacilityReportOutput }

export function CrossFacilityClient() {
	const [selectedMetric, setSelectedMetric] = useState<CrossFacilityMetric | null>(null)
	const [tenantIds, setTenantIds] = useState<string[]>([])
	const [dateFrom, setDateFrom] = useState("")
	const [dateTo, setDateTo] = useState("")
	const [groupBy, setGroupBy] = useState("facility")
	const [combined, setCombined] = useState(false)
	const [result, setResult] = useState<CrossFacilityReportOutput | null>(null)
	const [recentReports, setRecentReports] = useState<RecentReport[]>([])

	const generate = useGenerateCrossFacilityReportMutation()

	function toggleTenant(id: string) {
		setTenantIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
	}

	async function handleGenerate() {
		if (!selectedMetric) { toast.error("Select a report type"); return }
		if (!dateFrom || !dateTo) { toast.error("Date range required"); return }
		if (tenantIds.length === 0) { toast.error("Select at least one facility"); return }
		try {
			const data = await generate.mutateAsync({
				tenantIds,
				metrics: [selectedMetric],
				dateFrom,
				dateTo,
				groupBy,
			})
			setResult(data)
			const label = REPORT_TYPES.find(r => r.metric === selectedMetric)?.label ?? selectedMetric
			setRecentReports(prev => [{ generatedAt: data.generatedAt, label, result: data }, ...prev].slice(0, 5))
		} catch (err) {
			toast.error("Generation failed", { description: (err as Error).message })
		}
	}

	function getTenantName(id: string) {
		return MOCK_TENANTS.find(t => t.id === id)?.name ?? id
	}

	function getCombinedRows(): Record<string, unknown>[] {
		if (!result) return []
		if (combined) {
			const combined: Record<string, number> = {}
			for (const [, metrics] of Object.entries(result.summaryByTenant)) {
				for (const [k, v] of Object.entries(metrics)) {
					combined[k] = (combined[k] ?? 0) + v
				}
			}
			return [{ facility: "All Facilities (Combined)", ...combined }]
		}
		return Object.entries(result.summaryByTenant).map(([tenantId, metrics]) => ({
			facility: getTenantName(tenantId),
			...metrics,
		}))
	}

	const tableRows = getCombinedRows()
	const tableHeaders = tableRows.length > 0 ? Object.keys(tableRows[0]!) : []

	return (
		<div className="flex flex-col gap-6 max-w-5xl">
			<div className="flex items-center justify-between flex-wrap gap-2">
				<h1 className="text-xl font-semibold">Cross-Facility Report Builder</h1>
				{result && (
					<ReportExportPanel
						onExportCsv={() => exportToCsv(tableRows, "cross-facility-report.csv")}
						onExportPdf={() => {
							document.title = "Cross-Facility Report"
							exportToPdfPrint()
						}}
					/>
				)}
			</div>

			{/* Report type cards */}
			<div>
				<p className="text-sm font-medium mb-3">Select report type</p>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
					{REPORT_TYPES.map(rt => (
						<button
							key={rt.metric}
							onClick={() => setSelectedMetric(rt.metric)}
							className={`rounded-lg border p-4 text-left transition-colors ${
								selectedMetric === rt.metric
									? "border-primary bg-primary/5 ring-1 ring-primary"
									: "hover:bg-muted/40"
							}`}
						>
							<p className="font-semibold text-sm">{rt.label}</p>
							<p className="text-xs text-muted-foreground mt-1">{rt.description}</p>
						</button>
					))}
				</div>
			</div>

			{/* Parameter form */}
			{selectedMetric && (
				<div className="rounded-lg border p-4 flex flex-col gap-4">
					<p className="text-sm font-semibold">Report Parameters — {REPORT_TYPES.find(r => r.metric === selectedMetric)?.label}</p>

					<div className="flex flex-col gap-1.5">
						<Label className="text-xs">Facilities</Label>
						<div className="flex flex-wrap gap-2">
							{MOCK_TENANTS.map(t => (
								<label key={t.id} className="flex items-center gap-1.5 text-sm cursor-pointer">
									<input
										type="checkbox"
										checked={tenantIds.includes(t.id)}
										onChange={() => toggleTenant(t.id)}
										className="rounded"
									/>
									{t.name}
								</label>
							))}
						</div>
					</div>

					<div className="flex gap-4 flex-wrap">
						<div className="flex flex-col gap-1">
							<Label className="text-xs">Date From</Label>
							<Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 text-sm w-40" />
						</div>
						<div className="flex flex-col gap-1">
							<Label className="text-xs">Date To</Label>
							<Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 text-sm w-40" />
						</div>
						<div className="flex flex-col gap-1">
							<Label className="text-xs">Group By</Label>
							<select
								value={groupBy}
								onChange={e => setGroupBy(e.target.value)}
								className="h-8 rounded-md border border-input bg-background px-3 text-sm"
							>
								<option value="facility">Facility</option>
								<option value="month">Month</option>
								<option value="week">Week</option>
							</select>
						</div>
					</div>

					<div className="flex justify-end">
						<Button onClick={handleGenerate} disabled={generate.isPending}>
							{generate.isPending ? "Generating…" : "Generate Report"}
						</Button>
					</div>
				</div>
			)}

			{/* Results */}
			{result && (
				<div id="cross-facility-report-print" className="flex flex-col gap-4">
					<style>{`@media print { .no-print { display: none !important } }`}</style>

					<div className="flex items-center justify-between">
						<h2 className="text-sm font-semibold">
							Results — {REPORT_TYPES.find(r => r.metric === selectedMetric)?.label}
							<span className="text-muted-foreground font-normal ml-2 text-xs">
								Generated {new Date(result.generatedAt).toLocaleString()}
							</span>
						</h2>
						<label className="no-print flex items-center gap-2 text-sm cursor-pointer">
							<input type="checkbox" checked={combined} onChange={e => setCombined(e.target.checked)} />
							Combined view
						</label>
					</div>

					{tableRows.length > 0 ? (
						<div className="overflow-x-auto rounded-lg border">
							<table className="w-full text-sm">
								<thead className="bg-muted/30">
									<tr>
										{tableHeaders.map(h => (
											<th key={h} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground capitalize">
												{h.replace(/_/g, " ")}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{tableRows.map((row, i) => (
										<tr key={i} className="border-t hover:bg-muted/20">
											{tableHeaders.map(h => (
												<td key={h} className="px-4 py-2">
													{typeof row[h] === "number" ? (row[h] as number).toFixed(2) : String(row[h] ?? "—")}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<p className="text-sm text-muted-foreground">No data returned for the selected parameters.</p>
					)}
				</div>
			)}

			{/* Recent reports */}
			{recentReports.length > 0 && (
				<div className="no-print">
					<h2 className="text-sm font-semibold mb-2">Recent Reports</h2>
					<div className="flex flex-col gap-1">
						{recentReports.map((r, i) => (
							<button
								key={i}
								onClick={() => { setResult(r.result); setSelectedMetric(r.result.params.metrics[0] ?? null) }}
								className="flex items-center justify-between rounded-md border px-4 py-2 text-sm hover:bg-muted/40 text-left"
							>
								<span className="font-medium">{r.label}</span>
								<span className="text-xs text-muted-foreground">{new Date(r.generatedAt).toLocaleString()}</span>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
