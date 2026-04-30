"use client"

import { useState } from "react"
import Link from "next/link"

import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { useLoginEventsQuery } from "@/features/tenant-admin/api/tenant-admin.hooks"
import { exportToCsv } from "@/features/tenant-admin/lib/export-utils"
import { KpiCard } from "@/features/tenant-admin/components/kpi-card"
import { ReportExportPanel } from "@/features/tenant-admin/components/report-export-panel"
import { ReportFilterBar } from "@/features/tenant-admin/components/report-filter-bar"
import { StatusBadge } from "@/features/tenant-admin/components/status-badge"

type LoginOutcome = "success" | "failed_credentials" | "failed_mfa" | "blocked" | "suspicious"

interface LoginEvent {
	id: string
	userId?: string
	userName: string
	role: string
	outcome: LoginOutcome
	ipAddress: string | null
	userAgent: string | null
	sessionId?: string | null
	occurredAt: string
	[key: string]: unknown
}

export function LoginEventsClient() {
	const [filters, setFilters] = useState({ outcome: "", role: "", ipAddress: "", dateFrom: "", dateTo: "" })
	const [applied, setApplied] = useState(filters)
	const [page, setPage] = useState(1)

	const { data, isLoading } = useLoginEventsQuery({
		...applied,
		outcome: (applied.outcome || undefined) as LoginOutcome | undefined,
		page,
		limit: 20,
	})

	function handleApply() { setApplied(filters); setPage(1) }
	function handleReset() {
		const empty = { outcome: "", role: "", ipAddress: "", dateFrom: "", dateTo: "" }
		setFilters(empty); setApplied(empty); setPage(1)
	}

	const rows = (data?.items ?? []) as LoginEvent[]
	const kpis = data?.kpis

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold">Login Events</h1>
				<ReportExportPanel
					onExportCsv={() =>
						exportToCsv(
							rows.map(r => ({ userName: r.userName, role: r.role, outcome: r.outcome, ipAddress: r.ipAddress ?? "", occurredAt: r.occurredAt })),
							"login-events.csv"
						)
					}
				/>
			</div>
			{kpis && (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					<KpiCard label="Logins Today" value={kpis.loginsToday ?? kpis.totalLogins} />
					<KpiCard label="Failed Attempts (24h)" value={kpis.failedAttempts} />
					<KpiCard label="Blocked" value={kpis.blockedAttempts} />
					<KpiCard label="Active Sessions" value={kpis.activeSessions ?? "—"} />
					<KpiCard label="MFA Challenges" value={kpis.mfaChallengesIssued ?? "—"} />
					<KpiCard label="Suspicious" value={kpis.suspiciousCount} />
				</div>
			)}
			<ReportFilterBar
				filters={[
					{ key: "outcome", label: "Outcome", type: "select", value: filters.outcome, onChange: v => setFilters(f => ({ ...f, outcome: v })), options: [
						{ value: "success", label: "Success" },
						{ value: "failed_credentials", label: "Failed Credentials" },
						{ value: "failed_mfa", label: "Failed MFA" },
						{ value: "blocked", label: "Blocked" },
						{ value: "suspicious", label: "Suspicious" },
					]},
					{ key: "role", label: "Role", type: "text", value: filters.role, onChange: v => setFilters(f => ({ ...f, role: v })) },
					{ key: "ipAddress", label: "IP Address", type: "text", value: filters.ipAddress, onChange: v => setFilters(f => ({ ...f, ipAddress: v })) },
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
				rowActions={[
					{ label: "View Profile", onClick: row => { window.location.href = `/tenant-admin/audit?actorUserId=${String((row as { userId?: string }).userId ?? "")}` } },
				]}
				columns={[
					{ key: "userName", header: "User", render: r => (
						<Link href={`/tenant-admin/audit?actorUserId=${(r as LoginEvent & { userId: string }).userId ?? ""}&dateFrom=${r.occurredAt.slice(0, 10)}&dateTo=${r.occurredAt.slice(0, 10)}`} className="underline text-primary hover:opacity-80">{r.userName}</Link>
					), sortable: true },
					{ key: "role", header: "Role", render: r => r.role, sortable: true },
					{ key: "outcome", header: "Outcome", render: r => <StatusBadge status={r.outcome} />, sortable: true },
					{ key: "ipAddress", header: "IP Address", render: r => r.ipAddress ?? "—" },
					{ key: "userAgent", header: "User Agent", render: r => r.userAgent ? <span className="text-xs text-muted-foreground truncate max-w-[160px] block" title={r.userAgent}>{r.userAgent}</span> : "—" },
					{ key: "sessionId", header: "Session", render: r => (r.sessionId as string) ?? "—" },
					{ key: "occurredAt", header: "Timestamp", render: r => new Date(r.occurredAt).toLocaleString(), sortable: true },
				]}
			/>
		</div>
	)
}
