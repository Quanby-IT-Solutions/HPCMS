"use client"

import Link from "next/link"

import { Button } from "@/core/components/ui/button"
import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { useDpaDashboardQuery } from "@/features/tenant-admin/api/tenant-admin.hooks"
import { KpiCard } from "@/features/tenant-admin/components/kpi-card"
import { StatusBadge } from "@/features/tenant-admin/components/status-badge"

interface ComplianceItem {
	category: string
	status: string
	score: number
	notes: string | null
	lastChecked: string | null
	id: string
	[key: string]: unknown
}

export function DpaDashboardClient() {
	const { data, isLoading } = useDpaDashboardQuery()

	const rows = (data?.complianceItems ?? []).map((item, i) => ({ ...item, id: `ci-${i}` })) as ComplianceItem[]

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold">DPA Compliance Dashboard</h1>
				<Link href="/tenant-admin/compliance/dpa">
					<Button size="sm" variant="outline">Generate DPA Report</Button>
				</Link>
			</div>
			{data?.kpis && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<KpiCard label="Consent Coverage" value={`${Math.round(data.kpis.consentCoverage * 100)}%`} />
					<KpiCard label="Retention Compliance" value={`${Math.round(data.kpis.retentionComplianceRate * 100)}%`} />
					<KpiCard label="Open Requests" value={data.kpis.dataSubjectRequestsOpen} />
					<KpiCard label="Overdue Requests" value={data.kpis.dataSubjectRequestsOverdue} />
					<KpiCard label="PHI Access Events" value={data.kpis.phiAccessEventCount ?? 0} />
					<KpiCard label="Audit Completeness" value={`${Math.round((data.kpis.auditCompletenessRate ?? 0) * 100)}%`} />
				</div>
			)}
			{data?.kpis?.lastAuditDate && (
				<p className="text-sm text-muted-foreground">Last audit: <span className="font-medium">{data.kpis.lastAuditDate}</span> — Next review: <span className="font-medium">{data.kpis.nextReviewDate ?? "—"}</span></p>
			)}
			<AdminDataTable
				isLoading={isLoading}
				rows={rows}
				columns={[
					{ key: "category", header: "Category", render: r => r.category, sortable: true },
					{ key: "status", header: "Status", render: r => <StatusBadge status={r.status} /> },
					{ key: "score", header: "Score", render: r => `${r.score} / 100`, sortable: true },
					{ key: "notes", header: "Notes", render: r => r.notes ?? "—" },
					{ key: "lastChecked", header: "Last Checked", render: r => r.lastChecked ?? "—" },
				]}
				emptyMessage="No compliance items found."
			/>
		</div>
	)
}
