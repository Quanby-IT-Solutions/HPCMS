"use client"

import { useState } from "react"

import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { useConsentHistoryListQuery } from "@/features/tenant-admin/api/tenant-admin.hooks"
import { exportToCsv } from "@/features/tenant-admin/lib/export-utils"
import { ReportExportPanel } from "@/features/tenant-admin/components/report-export-panel"
import { ReportFilterBar } from "@/features/tenant-admin/components/report-filter-bar"
import { StatusBadge } from "@/features/tenant-admin/components/status-badge"
import { authClient } from "@/services/better-auth/auth-client"

const ALLOWED_ROLES = ["tenant_admin", "system_admin"]

interface ConsentHistoryPanelProps {
	patientId: string
}

interface ConsentRow {
	id: string
	category: string
	status: string
	captureMethod: string
	recordedBy: string
	recordedByRole: string
	documentKey: string | null
	recordedAt: string
	[key: string]: unknown
}

export function ConsentHistoryPanel({ patientId }: ConsentHistoryPanelProps) {
	const { data: session } = authClient.useSession()
	const role = (session?.user as { role?: string })?.role ?? ""

	const [filters, setFilters] = useState({ category: "" })
	const [applied, setApplied] = useState(filters)
	const [page, setPage] = useState(1)

	const { data, isLoading } = useConsentHistoryListQuery(patientId, { ...applied, page, limit: 20 })

	if (!ALLOWED_ROLES.includes(role)) {
		return (
			<div className="rounded-md bg-muted/20 p-4 text-sm text-muted-foreground">
				Consent history is not available for your role.
			</div>
		)
	}

	const rows = (data?.items ?? []) as ConsentRow[]

	function handleApply() { setApplied(filters); setPage(1) }
	function handleReset() {
		const empty = { category: "" }
		setFilters(empty); setApplied(empty); setPage(1)
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold">Consent History</h3>
				<ReportExportPanel
					onExportCsv={() =>
						exportToCsv(
							rows.map(r => ({
								category: r.category,
								status: r.status,
								captureMethod: r.captureMethod,
								recordedBy: r.recordedBy,
								recordedByRole: r.recordedByRole,
								documentKey: r.documentKey ?? "",
								recordedAt: r.recordedAt,
							})),
							`patient-${patientId}-consent.csv`
						)
					}
				/>
			</div>
			<ReportFilterBar
				filters={[
					{ key: "category", label: "Category", type: "text", value: filters.category, onChange: v => setFilters(f => ({ ...f, category: v })) },
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
					{ key: "category", header: "Category", render: r => r.category, sortable: true },
					{ key: "status", header: "Status", render: r => <StatusBadge status={r.status} /> },
					{ key: "captureMethod", header: "Method", render: r => r.captureMethod },
					{ key: "recordedBy", header: "Recorded By", render: r => r.recordedBy },
					{ key: "recordedByRole", header: "Role", render: r => r.recordedByRole },
					{ key: "recordedAt", header: "Recorded At", render: r => new Date(r.recordedAt).toLocaleString(), sortable: true },
					{ key: "documentKey", header: "Document", render: r => r.documentKey ? <a href={`/documents/${r.documentKey}`} className="text-primary underline text-xs" target="_blank" rel="noreferrer">View</a> : "—" },
				]}
				emptyMessage="No consent records found."
			/>
		</div>
	)
}
