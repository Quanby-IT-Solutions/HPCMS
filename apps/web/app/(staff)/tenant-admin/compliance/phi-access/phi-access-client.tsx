"use client"

import { useState } from "react"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { usePhiAccessReportQuery } from "@/features/tenant-admin/api/tenant-admin.hooks"
import { exportToCsv, exportToPdfPrint } from "@/features/tenant-admin/lib/export-utils"
import { ReportExportPanel } from "@/features/tenant-admin/components/report-export-panel"

interface PhiRow {
	id: string
	userId?: string
	userName: string
	role: string
	patientName: string
	resourceType: string
	accessType: string
	accessContext?: string
	facility?: string
	ipAddress: string | null
	accessedAt: string
	isAnomaly: boolean
	anomalyReason: string | null
	[key: string]: unknown
}

function defaultDateFrom() {
	return new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
}
function defaultDateTo() {
	return new Date().toISOString().slice(0, 10)
}

export function PhiAccessClient() {
	const [form, setForm] = useState({ dateFrom: defaultDateFrom(), dateTo: defaultDateTo(), userId: "", role: "", patientId: "", anomalyOnly: false })
	const [params, setParams] = useState(form)
	const [page, setPage] = useState(1)

	const { data, isLoading } = usePhiAccessReportQuery({ ...params, page, limit: 20 })

	const rows = (data?.items ?? []) as PhiRow[]

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold">PHI Access Report</h1>
				<ReportExportPanel
					onExportCsv={() =>
						exportToCsv(
							rows.map(r => ({ userName: r.userName, role: r.role, patientName: r.patientName, resourceType: r.resourceType, accessType: r.accessType, ipAddress: r.ipAddress ?? "", accessedAt: r.accessedAt, isAnomaly: String(r.isAnomaly), anomalyReason: r.anomalyReason ?? "" })),
							"phi-access.csv"
						)
					}
					onExportPdf={exportToPdfPrint}
				/>
			</div>
			<div className="rounded-lg border bg-muted/20 p-4">
				<div className="flex flex-wrap gap-4 items-end">
					<div className="flex flex-col gap-1 min-w-36">
						<Label className="text-xs text-muted-foreground">From (required)</Label>
						<Input type="date" value={form.dateFrom} onChange={e => setForm(f => ({ ...f, dateFrom: e.target.value }))} className="h-9" />
					</div>
					<div className="flex flex-col gap-1 min-w-36">
						<Label className="text-xs text-muted-foreground">To (required)</Label>
						<Input type="date" value={form.dateTo} onChange={e => setForm(f => ({ ...f, dateTo: e.target.value }))} className="h-9" />
					</div>
					<div className="flex flex-col gap-1 min-w-36">
						<Label className="text-xs text-muted-foreground">User ID</Label>
						<Input type="text" value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))} className="h-9" />
					</div>
					<div className="flex flex-col gap-1 min-w-36">
						<Label className="text-xs text-muted-foreground">Role</Label>
						<Input type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="h-9" />
					</div>
					<div className="flex flex-col gap-1 min-w-36">
						<Label className="text-xs text-muted-foreground">Patient ID</Label>
						<Input type="text" value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} className="h-9" />
					</div>
					<div className="flex items-center gap-2 pb-0.5">
						<input type="checkbox" id="anomalyOnly" checked={form.anomalyOnly} onChange={e => setForm(f => ({ ...f, anomalyOnly: e.target.checked }))} className="size-4" />
						<Label htmlFor="anomalyOnly" className="text-sm cursor-pointer">Anomalies only</Label>
					</div>
					<Button size="sm" type="button" onClick={() => { setParams(form); setPage(1) }}>Apply</Button>
				</div>
				{data?.anomalyCount !== undefined && (
					<p className="mt-3 text-sm text-muted-foreground">Anomaly count in period: <span className="font-semibold text-red-600">{data.anomalyCount}</span></p>
				)}
			</div>
			<AdminDataTable
				isLoading={isLoading}
				rows={rows}
				totalCount={data?.total}
				page={page}
				pageSize={20}
				onPageChange={setPage}
				rowActions={[{ label: "View Audit", onClick: row => { window.location.href = `/tenant-admin/audit?actorUserId=${String((row as PhiRow).userId ?? "")}&dateFrom=${(row as PhiRow).accessedAt.slice(0, 10)}` } }]}
				columns={[
					{ key: "userName", header: "User", render: r => r.userName, sortable: true },
					{ key: "role", header: "Role", render: r => r.role },
					{ key: "patientName", header: "Patient", render: r => r.patientName },
					{ key: "resourceType", header: "Resource", render: r => r.resourceType },
					{ key: "accessType", header: "Access", render: r => r.accessType },
					{ key: "accessContext", header: "Context", render: r => (r.accessContext as string) ?? "—" },
					{ key: "facility", header: "Facility", render: r => (r.facility as string) ?? "—" },
					{ key: "ipAddress", header: "IP", render: r => r.ipAddress ?? "—" },
					{ key: "accessedAt", header: "Accessed At", render: r => new Date(r.accessedAt).toLocaleString(), sortable: true },
					{ key: "isAnomaly", header: "Anomaly", render: r => r.isAnomaly ? <span className="text-red-600 font-medium text-xs">Yes — {r.anomalyReason}</span> : <span className="text-muted-foreground text-xs">No</span> },
				]}
				emptyMessage="No PHI access records found."
			/>
		</div>
	)
}
