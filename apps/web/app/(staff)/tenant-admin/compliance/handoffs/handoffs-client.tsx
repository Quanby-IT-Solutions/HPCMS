"use client"

import { useState } from "react"

import { Button } from "@/core/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/core/components/ui/sheet"
import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { useHandoffsListQuery } from "@/features/tenant-admin/api/tenant-admin.hooks"
import { exportToCsv, exportToPdfPrint } from "@/features/tenant-admin/lib/export-utils"
import { KpiCard } from "@/features/tenant-admin/components/kpi-card"
import { ReportExportPanel } from "@/features/tenant-admin/components/report-export-panel"
import { ReportFilterBar } from "@/features/tenant-admin/components/report-filter-bar"

interface HandoffRow {
	id: string
	caseRef: string
	patientName: string
	fromAgentName: string
	toAgentName: string
	handoffType: string
	completedAt: string
	verbalConfirmed: boolean
	isCompliant: boolean
	complianceGap: string | null
	[key: string]: unknown
}

export function HandoffsClient() {
	const [filters, setFilters] = useState({ dateFrom: "", dateTo: "", handoffType: "", isCompliant: "" })
	const [applied, setApplied] = useState(filters)
	const [page, setPage] = useState(1)
	const [selectedRow, setSelectedRow] = useState<HandoffRow | null>(null)

	const { data, isLoading } = useHandoffsListQuery({
		...applied,
		isCompliant: applied.isCompliant === "" ? undefined : applied.isCompliant === "true",
		page,
		limit: 20,
	})

	function handleApply() { setApplied(filters); setPage(1) }
	function handleReset() {
		const empty = { dateFrom: "", dateTo: "", handoffType: "", isCompliant: "" }
		setFilters(empty); setApplied(empty); setPage(1)
	}

	const rows = (data?.items ?? []) as HandoffRow[]

	return (
		<div className="flex flex-col gap-4">
			<style>{`@media print { .no-print { display: none !important; } }`}</style>
			<div className="flex items-center justify-between no-print">
				<h1 className="text-lg font-semibold">JCI Handoff Audit</h1>
				<ReportExportPanel
					onExportPdf={exportToPdfPrint}
					onExportCsv={() =>
						exportToCsv(
							rows.map(r => ({
								caseRef: r.caseRef,
								patientName: r.patientName,
								fromAgent: r.fromAgentName,
								toAgent: r.toAgentName,
								handoffType: r.handoffType,
								completedAt: r.completedAt,
								verbalConfirmed: String(r.verbalConfirmed),
								isCompliant: String(r.isCompliant),
								complianceGap: r.complianceGap ?? "",
							})),
							"handoffs.csv"
						)
					}
				/>
			</div>
			{data?.complianceRate !== undefined && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-sm">
					<KpiCard label="Compliance Rate" value={`${Math.round(data.complianceRate * 100)}%`} />
				</div>
			)}
			<ReportFilterBar
				filters={[
					{ key: "dateFrom", label: "From", type: "date", value: filters.dateFrom, onChange: v => setFilters(f => ({ ...f, dateFrom: v })) },
					{ key: "dateTo", label: "To", type: "date", value: filters.dateTo, onChange: v => setFilters(f => ({ ...f, dateTo: v })) },
					{ key: "handoffType", label: "Handoff Type", type: "text", value: filters.handoffType, onChange: v => setFilters(f => ({ ...f, handoffType: v })) },
					{ key: "isCompliant", label: "Compliance", type: "select", value: filters.isCompliant, onChange: v => setFilters(f => ({ ...f, isCompliant: v })), options: [
						{ value: "true", label: "Compliant" },
						{ value: "false", label: "Non-compliant" },
					]},
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
				rowActions={[{ label: "View Gap", onClick: row => setSelectedRow(row as HandoffRow) }]}
				columns={[
					{ key: "caseRef", header: "Case", render: r => r.caseRef, sortable: true },
					{ key: "patientName", header: "Patient", render: r => r.patientName },
					{ key: "fromAgentName", header: "From", render: r => r.fromAgentName },
					{ key: "toAgentName", header: "To", render: r => r.toAgentName },
					{ key: "handoffType", header: "Type", render: r => r.handoffType },
					{ key: "completedAt", header: "Completed", render: r => new Date(r.completedAt).toLocaleString() },
					{ key: "verbalConfirmed", header: "Verbal", render: r => r.verbalConfirmed ? <span className="text-green-600 text-xs font-medium">Yes</span> : <span className="text-red-600 text-xs font-medium">No</span> },
					{ key: "isCompliant", header: "Compliant", render: r => r.isCompliant ? <span className="text-green-600 text-xs font-medium">Yes</span> : <span className="text-red-600 text-xs font-medium">No</span> },
				]}
			/>

			<Sheet open={!!selectedRow} onOpenChange={open => { if (!open) setSelectedRow(null) }}>
				<SheetContent className="w-full max-w-md">
					<SheetHeader>
						<SheetTitle>Handoff Detail — {selectedRow?.caseRef}</SheetTitle>
					</SheetHeader>
					{selectedRow && (
						<div className="mt-4 flex flex-col gap-4 text-sm">
							<dl className="grid grid-cols-2 gap-x-4 gap-y-2">
								<dt className="text-muted-foreground">Patient</dt><dd>{selectedRow.patientName}</dd>
								<dt className="text-muted-foreground">From</dt><dd>{selectedRow.fromAgentName}</dd>
								<dt className="text-muted-foreground">To</dt><dd>{selectedRow.toAgentName}</dd>
								<dt className="text-muted-foreground">Type</dt><dd>{selectedRow.handoffType}</dd>
								<dt className="text-muted-foreground">Verbal Confirmed</dt><dd>{selectedRow.verbalConfirmed ? "Yes" : "No"}</dd>
								<dt className="text-muted-foreground">Compliant</dt><dd>{selectedRow.isCompliant ? "Yes" : "No"}</dd>
							</dl>
							{selectedRow.complianceGap && (
								<div className="rounded-md bg-red-50 border border-red-200 p-3">
									<p className="text-xs font-medium text-red-800 mb-1">Compliance Gap</p>
									<p className="text-sm text-red-700">{selectedRow.complianceGap}</p>
								</div>
							)}
							<Button variant="outline" size="sm" onClick={() => setSelectedRow(null)}>Close</Button>
						</div>
					)}
				</SheetContent>
			</Sheet>
		</div>
	)
}
