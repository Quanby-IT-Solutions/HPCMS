"use client"

import { useState } from "react"

import { Button } from "@/core/components/ui/button"
import { Label } from "@/core/components/ui/label"
import { Textarea } from "@/core/components/ui/textarea"
import { useDpaReportQuery } from "@/features/tenant-admin/api/tenant-admin.hooks"
import { exportToPdfPrint } from "@/features/tenant-admin/lib/export-utils"
import { ReportExportPanel } from "@/features/tenant-admin/components/report-export-panel"

const PERIODS = ["2026-Q1", "2025-Q4", "2025-Q3", "2025-Q2", "2025-Q1"]

export function DpaReportClient() {
	const [period, setPeriod] = useState("2026-Q1")
	const [narrativeNote, setNarrativeNote] = useState("")

	const { data, isLoading } = useDpaReportQuery({ period })

	return (
		<div className="flex flex-col gap-4">
			<style>{`@media print { .no-print { display: none !important; } .print-only { display: block !important; } }`}</style>
			<div className="flex items-center justify-between no-print">
				<div className="flex items-center gap-3">
					<h1 className="text-lg font-semibold">DPA Compliance Report</h1>
					<div className="flex items-center gap-2">
						<Label className="text-sm text-muted-foreground">Period:</Label>
						<select
							value={period}
							onChange={e => setPeriod(e.target.value)}
							className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
						>
							{PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
						</select>
					</div>
				</div>
				<div className="flex items-center gap-2">
						<ReportExportPanel onExportPdf={exportToPdfPrint} pdfLabel="Print / Export PDF" />
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								const subject = encodeURIComponent(`DPA Compliance Report — ${period}`)
								const body = encodeURIComponent(`Please find attached the DPA Compliance Report for ${period}.\n\nGenerated: ${new Date().toLocaleString()}`)
								window.location.href = `mailto:?subject=${subject}&body=${body}`
							}}
						>
							Email to DPO
						</Button>
					</div>
			</div>

			{isLoading ? (
				<div className="text-sm text-muted-foreground py-8 text-center">Loading report...</div>
			) : data ? (
				<div id="dpa-report-print" className="flex flex-col gap-6">
					<div className="rounded-lg border p-6">
						<h2 className="text-xl font-bold mb-1">{data.tenantName}</h2>
						<p className="text-sm text-muted-foreground">Period: {data.period} — Generated: {new Date(data.generatedAt).toLocaleString()}</p>
					</div>

					<div className="rounded-lg border p-4">
						<h3 className="text-sm font-semibold mb-3">Key Performance Indicators</h3>
						<table className="w-full text-sm border-collapse">
							<tbody>
								<tr className="border-b"><td className="py-2 text-muted-foreground pr-4">Consent Coverage</td><td className="font-medium">{Math.round(data.kpis.consentCoverage * 100)}%</td></tr>
								<tr className="border-b"><td className="py-2 text-muted-foreground pr-4">Retention Compliance</td><td className="font-medium">{Math.round(data.kpis.retentionComplianceRate * 100)}%</td></tr>
								<tr className="border-b"><td className="py-2 text-muted-foreground pr-4">Open Data Subject Requests</td><td className="font-medium">{data.kpis.dataSubjectRequestsOpen}</td></tr>
								<tr className="border-b"><td className="py-2 text-muted-foreground pr-4">Overdue Requests</td><td className="font-medium text-red-600">{data.kpis.dataSubjectRequestsOverdue}</td></tr>
								<tr className="border-b"><td className="py-2 text-muted-foreground pr-4">Last Audit Date</td><td className="font-medium">{data.kpis.lastAuditDate ?? "—"}</td></tr>
								<tr><td className="py-2 text-muted-foreground pr-4">Next Review Date</td><td className="font-medium">{data.kpis.nextReviewDate ?? "—"}</td></tr>
							</tbody>
						</table>
					</div>

					{data.complianceItems.length > 0 && (
						<div className="rounded-lg border p-4">
							<h3 className="text-sm font-semibold mb-3">Compliance Checklist</h3>
							<table className="w-full text-sm border-collapse">
								<thead><tr className="border-b"><th className="py-2 text-left text-muted-foreground font-medium">Category</th><th className="py-2 text-left text-muted-foreground font-medium">Status</th><th className="py-2 text-left text-muted-foreground font-medium">Score</th><th className="py-2 text-left text-muted-foreground font-medium">Notes</th></tr></thead>
								<tbody>{data.complianceItems.map((item, i) => (
									<tr key={i} className="border-b last:border-0">
										<td className="py-2 pr-4">{item.category}</td>
										<td className="py-2 pr-4 capitalize">{item.status.replace(/_/g, " ")}</td>
										<td className="py-2 pr-4">{item.score} / 100</td>
										<td className="py-2 text-muted-foreground">{item.notes ?? "—"}</td>
									</tr>
								))}</tbody>
							</table>
						</div>
					)}

					{data.phiAccessSummary && (
						<div className="rounded-lg border p-4">
							<h3 className="text-sm font-semibold mb-3">PHI Access Summary</h3>
							<table className="w-full text-sm border-collapse">
								<tbody>
									<tr className="border-b"><td className="py-2 text-muted-foreground pr-4">Total PHI Access Events</td><td className="font-medium">{data.phiAccessSummary.totalEvents}</td></tr>
									<tr className="border-b"><td className="py-2 text-muted-foreground pr-4">Anomalous Events</td><td className={`font-medium ${data.phiAccessSummary.anomalyCount > 0 ? "text-red-600" : ""}`}>{data.phiAccessSummary.anomalyCount}</td></tr>
									<tr><td className="py-2 text-muted-foreground pr-4">Top Accessors</td><td className="font-medium">{data.phiAccessSummary.topAccessors.join(", ")}</td></tr>
								</tbody>
							</table>
						</div>
					)}

					{data.patientsWithoutConsent && data.patientsWithoutConsent.length > 0 && (
						<div className="rounded-lg border p-4">
							<h3 className="text-sm font-semibold mb-3">Patients Without Consent on File</h3>
							<table className="w-full text-sm border-collapse">
								<thead><tr className="border-b"><th className="py-2 text-left text-muted-foreground font-medium">Patient</th><th className="py-2 text-left text-muted-foreground font-medium">Missing Consent Categories</th></tr></thead>
								<tbody>{data.patientsWithoutConsent.map((p, i) => (
									<tr key={i} className="border-b last:border-0">
										<td className="py-2 pr-4">{p.patientName} <span className="text-muted-foreground text-xs">({p.patientId})</span></td>
										<td className="py-2 text-red-600">{p.missingCategories.join(", ")}</td>
									</tr>
								))}</tbody>
							</table>
						</div>
					)}

					{data.findings.length > 0 && (
						<div className="rounded-lg border p-4">
							<h3 className="text-sm font-semibold mb-3">Findings & Recommendations</h3>
							<div className="flex flex-col gap-3">
								{data.findings.map((f, i) => (
									<div key={i} className="rounded-md bg-muted/30 p-3 text-sm">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-medium">{f.area}</span>
											<span className="text-xs text-muted-foreground capitalize border rounded-full px-2 py-0.5">{f.severity}</span>
										</div>
										<p className="mb-1">{f.finding}</p>
										<p className="text-muted-foreground text-xs">Recommended: {f.recommendedAction}</p>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="rounded-lg border p-4 no-print">
						<h3 className="text-sm font-semibold mb-2">Narrative Note</h3>
						<p className="text-xs text-muted-foreground mb-2">Add a note to be appended when printing/exporting.</p>
						<Textarea value={narrativeNote} onChange={e => setNarrativeNote(e.target.value)} rows={4} placeholder="Enter narrative note for the DPO..." />
					</div>
					{narrativeNote.trim() && (
						<div className="rounded-lg border p-4 print-only" style={{ display: 'none' }}>
							<h3 className="text-sm font-semibold mb-2">Narrative Note</h3>
							<p className="text-sm whitespace-pre-wrap">{narrativeNote}</p>
						</div>
					)}
				</div>
			) : null}
		</div>
	)
}
