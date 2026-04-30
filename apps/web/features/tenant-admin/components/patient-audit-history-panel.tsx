"use client"

import { useState } from "react"

import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { usePatientAuditListQuery } from "@/features/tenant-admin/api/tenant-admin.hooks"
import { exportToCsv } from "@/features/tenant-admin/lib/export-utils"
import { ReportExportPanel } from "@/features/tenant-admin/components/report-export-panel"
import { ReportFilterBar } from "@/features/tenant-admin/components/report-filter-bar"
import { authClient } from "@/services/better-auth/auth-client"

const ALLOWED_ROLES = ["tenant_admin", "system_admin"]

interface PatientAuditHistoryPanelProps {
	patientId: string
}

interface AuditRow {
	id: string
	actorName: string
	actorRole: string
	actionType: string
	fieldChanged: string | null
	before: unknown
	after: unknown
	ipAddress: string | null
	occurredAt: string
	[key: string]: unknown
}

export function PatientAuditHistoryPanel({ patientId }: PatientAuditHistoryPanelProps) {
	const { data: session } = authClient.useSession()
	const role = (session?.user as { role?: string })?.role ?? ""

	const [filters, setFilters] = useState({ actionType: "", dateFrom: "", dateTo: "" })
	const [applied, setApplied] = useState(filters)
	const [page, setPage] = useState(1)

	const { data, isLoading } = usePatientAuditListQuery(patientId, { ...applied, page, limit: 20 })

	if (!ALLOWED_ROLES.includes(role)) {
		return (
			<div className="rounded-md bg-muted/20 p-4 text-sm text-muted-foreground">
				Audit history is not available for your role.
			</div>
		)
	}

	const rows = (data?.items ?? []) as AuditRow[]

	function handleApply() { setApplied(filters); setPage(1) }
	function handleReset() {
		const empty = { actionType: "", dateFrom: "", dateTo: "" }
		setFilters(empty); setApplied(empty); setPage(1)
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold">Audit History</h3>
				<ReportExportPanel
					onExportCsv={() =>
						exportToCsv(
							rows.map(r => ({
								actorName: r.actorName,
								actorRole: r.actorRole,
								actionType: r.actionType,
								fieldChanged: r.fieldChanged ?? "",
								before: r.before !== null ? JSON.stringify(r.before) : "",
								after: r.after !== null ? JSON.stringify(r.after) : "",
								ipAddress: r.ipAddress ?? "",
								occurredAt: r.occurredAt,
							})),
							`patient-${patientId}-audit.csv`
						)
					}
				/>
			</div>
			<ReportFilterBar
				filters={[
					{ key: "actionType", label: "Action Type", type: "text", value: filters.actionType, onChange: v => setFilters(f => ({ ...f, actionType: v })) },
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
				columns={[
					{ key: "actorName", header: "Actor", render: r => r.actorName, sortable: true },
					{ key: "actorRole", header: "Role", render: r => r.actorRole },
					{ key: "actionType", header: "Action", render: r => r.actionType, sortable: true },
					{ key: "fieldChanged", header: "Field", render: r => r.fieldChanged ?? "—" },
					{ key: "before", header: "Before", render: r => r.before !== null ? <code className="text-xs">{JSON.stringify(r.before).slice(0, 40)}…</code> : "—" },
					{ key: "after", header: "After", render: r => r.after !== null ? <code className="text-xs">{JSON.stringify(r.after).slice(0, 40)}…</code> : "—" },
					{ key: "ipAddress", header: "IP", render: r => r.ipAddress ?? "—" },
					{ key: "occurredAt", header: "Timestamp", render: r => new Date(r.occurredAt).toLocaleString(), sortable: true },
				]}
				emptyMessage="No audit records found."
			/>
		</div>
	)
}
