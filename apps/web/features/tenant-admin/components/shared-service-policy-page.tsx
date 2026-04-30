"use client"

import { useState } from "react"

import { Button } from "@/core/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/components/ui/dialog"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Textarea } from "@/core/components/ui/textarea"
import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import {
	useCreateSharedPolicyMutation,
	useDeleteSharedPolicyMutation,
	useSharedPoliciesListQuery,
	useUpdateSharedPolicyMutation,
} from "@/features/tenant-admin/api/tenant-admin.hooks"
import { ReportFilterBar } from "@/features/tenant-admin/components/report-filter-bar"
import { StatusBadge } from "@/features/tenant-admin/components/status-badge"

type PolicyStatus = "active" | "inactive" | "draft"

interface PolicyRow {
	id: string
	name: string
	serviceType: string
	coveredTenantIds: string[]
	slaHours: number
	status: PolicyStatus
	effectiveDate: string | null
	expiryDate: string | null
	notes: string | null
	[key: string]: unknown
}

const EMPTY_FORM = { name: "", serviceType: "", coveredTenantIds: "", slaHours: "48", status: "active" as PolicyStatus, effectiveDate: "", expiryDate: "", notes: "" }

export function SharedServicePolicyPage() {
	const [filters, setFilters] = useState({ status: "", serviceType: "" })
	const [applied, setApplied] = useState(filters)
	const [page, setPage] = useState(1)
	const [dialog, setDialog] = useState<PolicyRow | "new" | null>(null)
	const [form, setForm] = useState(EMPTY_FORM)
	const [confirmOpen, setConfirmOpen] = useState(false)

	const { data, isLoading } = useSharedPoliciesListQuery({ ...applied, status: (applied.status || undefined) as PolicyStatus | undefined, page, limit: 20 })
	const createMutation = useCreateSharedPolicyMutation()
	const updateMutation = useUpdateSharedPolicyMutation()
	const deleteMutation = useDeleteSharedPolicyMutation()

	function handleApply() { setApplied(filters); setPage(1) }
	function handleReset() {
		const empty = { status: "", serviceType: "" }
		setFilters(empty); setApplied(empty); setPage(1)
	}

	function openNew() {
		setForm(EMPTY_FORM)
		setDialog("new")
	}

	function openEdit(row: PolicyRow) {
		setForm({
			name: row.name,
			serviceType: row.serviceType,
			coveredTenantIds: row.coveredTenantIds.join(", "),
			slaHours: String(row.slaHours),
			status: row.status,
			effectiveDate: row.effectiveDate ?? "",
			expiryDate: row.expiryDate ?? "",
			notes: row.notes ?? "",
		})
		setDialog(row)
	}

	async function handleConfirmSave() {
		const tenants = form.coveredTenantIds.split(",").map(s => s.trim()).filter(Boolean)
		const payload = {
			name: form.name,
			serviceType: form.serviceType,
			coveredTenantIds: tenants,
			slaHours: Number(form.slaHours),
			status: form.status,
			effectiveDate: form.effectiveDate || null,
			expiryDate: form.expiryDate || null,
			notes: form.notes || null,
		}
		if (dialog === "new") {
			await createMutation.mutateAsync(payload)
		} else if (dialog) {
			await updateMutation.mutateAsync({ id: (dialog as PolicyRow).id, ...payload })
		}
		setConfirmOpen(false)
		setDialog(null)
	}

	async function handleDelete(row: PolicyRow) {
		if (!confirm(`Delete policy "${row.name}"?`)) return
		await deleteMutation.mutateAsync({ id: row.id })
	}

	const rows = (data?.items ?? []) as PolicyRow[]
	const isPending = createMutation.isPending || updateMutation.isPending

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold">Shared Service Policies</h1>
				<Button size="sm" onClick={openNew}>Add Policy</Button>
			</div>
			<ReportFilterBar
				filters={[
					{ key: "status", label: "Status", type: "select", value: filters.status, onChange: v => setFilters(f => ({ ...f, status: v })), options: [
						{ value: "active", label: "Active" },
						{ value: "inactive", label: "Inactive" },
						{ value: "draft", label: "Draft" },
					]},
					{ key: "serviceType", label: "Service Type", type: "text", value: filters.serviceType, onChange: v => setFilters(f => ({ ...f, serviceType: v })) },
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
					{ label: "Edit", onClick: row => openEdit(row as PolicyRow) },
					{ label: "Delete", onClick: row => { void handleDelete(row as PolicyRow) }, variant: "destructive" },
				]}
				columns={[
					{ key: "name", header: "Name", render: r => r.name, sortable: true },
					{ key: "serviceType", header: "Service Type", render: r => r.serviceType },
					{ key: "slaHours", header: "SLA (hrs)", render: r => String(r.slaHours) },
					{ key: "status", header: "Status", render: r => <StatusBadge status={r.status} /> },
					{ key: "effectiveDate", header: "Effective", render: r => r.effectiveDate ?? "—" },
					{ key: "expiryDate", header: "Expiry", render: r => r.expiryDate ?? "—" },
				]}
			/>

			<Dialog open={!!dialog} onOpenChange={open => { if (!open) setDialog(null) }}>
				<DialogContent className="max-w-lg">
					<DialogHeader><DialogTitle>{dialog === "new" ? "Add Policy" : "Edit Policy"}</DialogTitle></DialogHeader>
					<div className="flex flex-col gap-4 text-sm mt-2">
						<div className="grid grid-cols-2 gap-3">
							<div>
								<Label className="text-xs mb-1 block">Name</Label>
								<Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
							</div>
							<div>
								<Label className="text-xs mb-1 block">Service Type</Label>
								<Input value={form.serviceType} onChange={e => setForm(f => ({ ...f, serviceType: e.target.value }))} />
							</div>
							<div>
								<Label className="text-xs mb-1 block">SLA Hours</Label>
								<Input type="number" value={form.slaHours} onChange={e => setForm(f => ({ ...f, slaHours: e.target.value }))} />
							</div>
							<div>
								<Label className="text-xs mb-1 block">Status</Label>
								<select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as PolicyStatus }))} className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
									<option value="active">Active</option>
									<option value="inactive">Inactive</option>
									<option value="draft">Draft</option>
								</select>
							</div>
							<div>
								<Label className="text-xs mb-1 block">Effective Date</Label>
								<Input type="date" value={form.effectiveDate} onChange={e => setForm(f => ({ ...f, effectiveDate: e.target.value }))} />
							</div>
							<div>
								<Label className="text-xs mb-1 block">Expiry Date</Label>
								<Input type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} />
							</div>
						</div>
						<div>
							<Label className="text-xs mb-1 block">Covered Tenant IDs (comma-separated)</Label>
							<Input value={form.coveredTenantIds} onChange={e => setForm(f => ({ ...f, coveredTenantIds: e.target.value }))} />
						</div>
						<div>
							<Label className="text-xs mb-1 block">Notes</Label>
							<Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} />
						</div>
						<div className="flex gap-2">
							<Button size="sm" onClick={() => setConfirmOpen(true)} disabled={!form.name.trim()}>Review & Save</Button>
							<Button variant="outline" size="sm" onClick={() => setDialog(null)}>Cancel</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog open={confirmOpen} onOpenChange={open => { if (!open) setConfirmOpen(false) }}>
				<DialogContent className="max-w-sm">
					<DialogHeader><DialogTitle>Confirm Policy Change</DialogTitle></DialogHeader>
					<div className="flex flex-col gap-3 text-sm mt-2">
						<p>This policy will affect users at the following tenants:</p>
						<ul className="list-disc pl-5 space-y-1">
							{form.coveredTenantIds.split(",").map(s => s.trim()).filter(Boolean).map(tid => (
								<li key={tid} className="font-mono text-xs">{tid} <span className="text-muted-foreground">(affected users: —)</span></li>
							))}
						</ul>
						<p className="text-xs text-muted-foreground">Exact user counts will be available once the backend is connected.</p>
						<div className="flex gap-2">
							<Button size="sm" onClick={handleConfirmSave} disabled={isPending}>{isPending ? "Saving..." : "Confirm Save"}</Button>
							<Button variant="outline" size="sm" onClick={() => setConfirmOpen(false)}>Back</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
