"use client"

import { useState } from "react"

import { Button } from "@/core/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/core/components/ui/sheet"
import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { useAuditListQuery } from "@/features/tenant-admin/api/tenant-admin.hooks"
import { exportToCsv } from "@/features/tenant-admin/lib/export-utils"
import { ReportExportPanel } from "@/features/tenant-admin/components/report-export-panel"
import { ReportFilterBar } from "@/features/tenant-admin/components/report-filter-bar"

interface AuditEvent {
	id: string
	actorName: string
	actorRole: string | null
	sessionId: string | null
	actionType: string
	recordType: string
	recordId: string | null
	ipAddress: string | null
	before: unknown
	after: unknown
	createdAt: string
	[key: string]: unknown
}

interface AuditLogPageClientProps {
	initialActorUserId?: string
	initialActionType?: string
	initialRecordType?: string
	initialDateFrom?: string
	initialDateTo?: string
}

export function AuditLogPageClient({ initialActorUserId = "", initialActionType = "", initialRecordType = "", initialDateFrom = "", initialDateTo = "" }: AuditLogPageClientProps) {
	const initialFilters = {
		actionType: initialActionType,
		recordType: initialRecordType,
		actorUserId: initialActorUserId,
		dateFrom: initialDateFrom,
		dateTo: initialDateTo,
	}
	const [filters, setFilters] = useState(initialFilters)
	const [applied, setApplied] = useState(initialFilters)
	const [page, setPage] = useState(1)
	const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null)

	const { data, isLoading } = useAuditListQuery({ ...applied, page, limit: 20 })

	function handleApply() {
		setApplied(filters)
		setPage(1)
	}
	function handleReset() {
		const empty = { actionType: "", recordType: "", actorUserId: "", dateFrom: "", dateTo: "" }
		setFilters(empty)
		setApplied(empty)
		setPage(1)
	}

	const rows = (data?.items ?? []) as AuditEvent[]

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold">Audit Log</h1>
				<ReportExportPanel
					onExportCsv={() =>
						exportToCsv(
							rows.map(r => ({ actorName: r.actorName, actionType: r.actionType, recordType: r.recordType, recordId: r.recordId ?? "", ipAddress: r.ipAddress ?? "", createdAt: r.createdAt })),
							"audit-log.csv"
						)
					}
				/>
			</div>
			<ReportFilterBar
				filters={[
					{ key: "actionType", label: "Action Type", type: "text", value: filters.actionType, onChange: v => setFilters(f => ({ ...f, actionType: v })) },
					{ key: "recordType", label: "Record Type", type: "text", value: filters.recordType, onChange: v => setFilters(f => ({ ...f, recordType: v })) },
					{ key: "actorUserId", label: "Actor User ID", type: "text", value: filters.actorUserId, onChange: v => setFilters(f => ({ ...f, actorUserId: v })) },
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
				rowActions={[{ label: "View Details", onClick: row => setSelectedEvent(row as AuditEvent) }]}
				columns={[
					{ key: "actorName", header: "Actor", render: r => r.actorName, sortable: true },
					{ key: "actorRole", header: "Role", render: r => (r.actorRole as string) ?? "—" },
					{ key: "actionType", header: "Action", render: r => r.actionType, sortable: true },
					{ key: "recordType", header: "Record Type", render: r => r.recordType, sortable: true },
					{ key: "recordId", header: "Record ID", render: r => r.recordId ?? "—" },
					{ key: "ipAddress", header: "IP Address", render: r => r.ipAddress ?? "—" },
					{ key: "sessionId", header: "Session ID", render: r => (r.sessionId as string) ?? "—" },
					{ key: "createdAt", header: "Timestamp", render: r => new Date(r.createdAt).toLocaleString(), sortable: true },
				]}
			/>

			<Sheet open={!!selectedEvent} onOpenChange={open => { if (!open) setSelectedEvent(null) }}>
				<SheetContent className="w-full max-w-lg overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Audit Event Details</SheetTitle>
					</SheetHeader>
					{selectedEvent && (
						<div className="mt-4 flex flex-col gap-4 text-sm">
							<dl className="grid grid-cols-2 gap-x-4 gap-y-2">
								<dt className="text-muted-foreground">Actor</dt><dd>{selectedEvent.actorName}</dd>
								<dt className="text-muted-foreground">Action</dt><dd>{selectedEvent.actionType}</dd>
								<dt className="text-muted-foreground">Record Type</dt><dd>{selectedEvent.recordType}</dd>
								<dt className="text-muted-foreground">Record ID</dt><dd>{selectedEvent.recordId ?? "—"}</dd>
								<dt className="text-muted-foreground">IP Address</dt><dd>{selectedEvent.ipAddress ?? "—"}</dd>
								<dt className="text-muted-foreground">Timestamp</dt><dd>{new Date(selectedEvent.createdAt).toLocaleString()}</dd>
							</dl>
							{selectedEvent.before !== null && (
								<div>
									<p className="text-muted-foreground text-xs mb-1 font-medium">Before</p>
									<pre className="rounded bg-muted p-3 text-xs overflow-x-auto whitespace-pre-wrap">{JSON.stringify(selectedEvent.before, null, 2)}</pre>
								</div>
							)}
							{selectedEvent.after !== null && (
								<div>
									<p className="text-muted-foreground text-xs mb-1 font-medium">After</p>
									<pre className="rounded bg-muted p-3 text-xs overflow-x-auto whitespace-pre-wrap">{JSON.stringify(selectedEvent.after, null, 2)}</pre>
								</div>
							)}
							<Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>Close</Button>
						</div>
					)}
				</SheetContent>
			</Sheet>
		</div>
	)
}
