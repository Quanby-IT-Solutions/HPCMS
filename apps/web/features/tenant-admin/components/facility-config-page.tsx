"use client"

import { useState } from "react"

import { Button } from "@/core/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/components/ui/dialog"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/core/components/ui/sheet"
import { Switch } from "@/core/components/ui/switch"
import { Textarea } from "@/core/components/ui/textarea"
import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { SettingsTabs } from "@/features/staff-admin/components/settings-tabs"
import { useFacilityConfigQuery, useUpdateSlaMutation, useUpdateTemplateMutation, useUpsertDepartmentMutation } from "@/features/tenant-admin/api/tenant-admin.hooks"

interface SlaThreshold {
	priority: string
	responseHours: number
	resolutionHours: number
	escalationHours: number
	id: string
	[key: string]: unknown
}

interface NotifTemplate {
	id: string
	name: string
	channel: string
	eventType: string
	subjectTemplate: string
	bodyTemplate: string
	isActive: boolean
	updatedAt: string
	[key: string]: unknown
}

interface Department {
	id: string
	name: string
	careTeams: string[]
	headUserId: string | null
	isActive: boolean
	[key: string]: unknown
}

interface RoutingDefault {
	caseType: string
	defaultTeamId: string | null
	defaultDepartmentId: string | null
	defaultPriority: string
	id: string
	[key: string]: unknown
}

export function FacilityConfigPage() {
	const { data, isLoading } = useFacilityConfigQuery()
	const updateSla = useUpdateSlaMutation()
	const updateTemplate = useUpdateTemplateMutation()
	const upsertDept = useUpsertDepartmentMutation()

	// SLA state
	const [slaRows, setSlaRows] = useState<SlaThreshold[] | null>(null)
	const [businessHoursOnly, setBusinessHoursOnly] = useState<boolean | null>(null)

	// Template editing
	const [editTemplate, setEditTemplate] = useState<NotifTemplate | null>(null)

	// Department dialog
	const [deptDialog, setDeptDialog] = useState<Department | "new" | null>(null)
	const [deptForm, setDeptForm] = useState({ name: "", careTeams: "", isActive: true })

	const thresholds = slaRows ?? (data?.sla.thresholds ?? []).map((t, i) => ({ ...t, id: `sla-${i}` })) as SlaThreshold[]
	const bho = businessHoursOnly ?? (data?.sla.businessHoursOnly ?? false)
	const templates = (data?.notificationTemplates ?? []) as NotifTemplate[]
	const departments = (data?.departments ?? []) as Department[]
	const routingDefaults = (data?.routingDefaults ?? []).map((r, i) => ({ ...r, id: `rd-${i}` })) as RoutingDefault[]

	function handleSlaChange(idx: number, field: keyof SlaThreshold, val: string) {
		setSlaRows(prev => {
			const rows = prev ?? thresholds
			return rows.map((r, i) => i === idx ? { ...r, [field]: field === "priority" ? val : Number(val) } : r)
		})
	}

	async function handleSaveSla() {
		await updateSla.mutateAsync({ thresholds: thresholds.map(({ id: _id, ...rest }) => rest as { priority: string; responseHours: number; resolutionHours: number; escalationHours: number }), businessHoursOnly: bho, holidayCalendarId: data?.sla.holidayCalendarId ?? null })
	}

	async function handleSaveTemplate() {
		if (!editTemplate) return
		await updateTemplate.mutateAsync({ id: editTemplate.id, subjectTemplate: editTemplate.subjectTemplate, bodyTemplate: editTemplate.bodyTemplate, isActive: editTemplate.isActive })
		setEditTemplate(null)
	}

	async function handleSaveDept() {
		const careTeamsArr = deptForm.careTeams.split(",").map(s => s.trim()).filter(Boolean)
		if (deptDialog === "new") {
			await upsertDept.mutateAsync({ name: deptForm.name, careTeams: careTeamsArr, isActive: deptForm.isActive })
		} else if (deptDialog) {
			await upsertDept.mutateAsync({ id: deptDialog.id, name: deptForm.name, careTeams: careTeamsArr, isActive: deptForm.isActive })
		}
		setDeptDialog(null)
	}

	const slaContent = (
		<div className="flex flex-col gap-4">
			<div className="rounded-lg border overflow-hidden">
				<table className="w-full text-sm">
					<thead className="bg-muted/50">
						<tr>
							<th className="px-4 py-2 text-left font-medium">Priority</th>
							<th className="px-4 py-2 text-left font-medium">Response (hrs)</th>
							<th className="px-4 py-2 text-left font-medium">Resolution (hrs)</th>
							<th className="px-4 py-2 text-left font-medium">Escalation (hrs)</th>
						</tr>
					</thead>
					<tbody>
						{thresholds.map((row, i) => (
							<tr key={row.id} className="border-t">
								<td className="px-4 py-2 capitalize">{row.priority}</td>
								<td className="px-4 py-2"><Input type="number" value={row.responseHours} onChange={e => handleSlaChange(i, "responseHours", e.target.value)} className="h-8 w-20" /></td>
								<td className="px-4 py-2"><Input type="number" value={row.resolutionHours} onChange={e => handleSlaChange(i, "resolutionHours", e.target.value)} className="h-8 w-20" /></td>
								<td className="px-4 py-2"><Input type="number" value={row.escalationHours} onChange={e => handleSlaChange(i, "escalationHours", e.target.value)} className="h-8 w-20" /></td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="flex items-center gap-3">
				<Switch checked={bho} onCheckedChange={setBusinessHoursOnly} id="bho" />
				<Label htmlFor="bho">Business hours only</Label>
			</div>
		</div>
	)

	const templateContent = (
		<>
			<AdminDataTable
				isLoading={isLoading}
				rows={templates}
				rowActions={[{ label: "Edit", onClick: row => setEditTemplate(row as NotifTemplate) }]}
				columns={[
					{ key: "name", header: "Name", render: r => r.name },
					{ key: "channel", header: "Channel", render: r => r.channel },
					{ key: "eventType", header: "Event", render: r => r.eventType },
					{ key: "isActive", header: "Active", render: r => r.isActive ? <span className="text-green-600 text-xs font-medium">Yes</span> : <span className="text-muted-foreground text-xs">No</span> },
					{ key: "updatedAt", header: "Updated", render: r => new Date(r.updatedAt).toLocaleDateString() },
				]}
			/>
			<Sheet open={!!editTemplate} onOpenChange={open => { if (!open) setEditTemplate(null) }}>
				<SheetContent className="w-full max-w-md overflow-y-auto">
					<SheetHeader><SheetTitle>Edit Template</SheetTitle></SheetHeader>
					{editTemplate && (
						<div className="mt-4 flex flex-col gap-4 text-sm">
							<div>
								<Label className="text-xs mb-1 block">Subject Template</Label>
								<Input value={editTemplate.subjectTemplate} onChange={e => setEditTemplate(t => t ? ({ ...t, subjectTemplate: e.target.value }) : t)} />
							</div>
							<div>
								<Label className="text-xs mb-1 block">Body Template</Label>
								<Textarea value={editTemplate.bodyTemplate} onChange={e => setEditTemplate(t => t ? ({ ...t, bodyTemplate: e.target.value }) : t)} rows={6} />
							</div>
							<div className="rounded-md border bg-muted/30 p-3">
								<p className="text-xs font-medium text-muted-foreground mb-2">Preview (sample values)</p>
								<p className="text-xs font-medium mb-0.5">{editTemplate.subjectTemplate.replace(/\{\{patient\.name\}\}/g, "John Doe").replace(/\{\{case\.ref\}\}/g, "CASE-001").replace(/\{\{agent\.name\}\}/g, "Alice Chen").replace(/\{\{date\}\}/g, new Date().toLocaleDateString())}</p>
								<pre className="text-xs whitespace-pre-wrap text-muted-foreground">{editTemplate.bodyTemplate.replace(/\{\{patient\.name\}\}/g, "John Doe").replace(/\{\{case\.ref\}\}/g, "CASE-001").replace(/\{\{agent\.name\}\}/g, "Alice Chen").replace(/\{\{date\}\}/g, new Date().toLocaleDateString()).replace(/\{\{tenant\.name\}\}/g, "HPCMS Hospital QC")}</pre>
							</div>
							<div className="flex items-center gap-3">
								<Switch checked={editTemplate.isActive} onCheckedChange={v => setEditTemplate(t => t ? ({ ...t, isActive: v }) : t)} id="tpl-active" />
								<Label htmlFor="tpl-active">Active</Label>
							</div>
							<div className="flex gap-2">
								<Button size="sm" onClick={handleSaveTemplate} disabled={updateTemplate.isPending}>{updateTemplate.isPending ? "Saving..." : "Save"}</Button>
								<Button variant="outline" size="sm" onClick={() => setEditTemplate(null)}>Cancel</Button>
							</div>
						</div>
					)}
				</SheetContent>
			</Sheet>
		</>
	)

	const deptContent = (
		<>
			<div className="flex justify-end mb-3">
				<Button size="sm" onClick={() => { setDeptForm({ name: "", careTeams: "", isActive: true }); setDeptDialog("new") }}>Add Department</Button>
			</div>
			<AdminDataTable
				isLoading={isLoading}
				rows={departments}
				rowActions={[{ label: "Edit", onClick: row => { const d = row as Department; setDeptForm({ name: d.name, careTeams: d.careTeams.join(", "), isActive: d.isActive }); setDeptDialog(d) } }]}
				columns={[
					{ key: "name", header: "Name", render: r => r.name, sortable: true },
					{ key: "careTeams", header: "Care Teams", render: r => r.careTeams.join(", ") || "—" },
					{ key: "isActive", header: "Active", render: r => r.isActive ? <span className="text-green-600 text-xs font-medium">Yes</span> : <span className="text-muted-foreground text-xs">No</span> },
				]}
			/>
			<Dialog open={!!deptDialog} onOpenChange={open => { if (!open) setDeptDialog(null) }}>
				<DialogContent>
					<DialogHeader><DialogTitle>{deptDialog === "new" ? "Add Department" : "Edit Department"}</DialogTitle></DialogHeader>
					<div className="flex flex-col gap-4 text-sm mt-2">
						<div>
							<Label className="text-xs mb-1 block">Name</Label>
							<Input value={deptForm.name} onChange={e => setDeptForm(f => ({ ...f, name: e.target.value }))} />
						</div>
						<div>
							<Label className="text-xs mb-1 block">Care Teams (comma-separated)</Label>
							<Input value={deptForm.careTeams} onChange={e => setDeptForm(f => ({ ...f, careTeams: e.target.value }))} />
						</div>
						<div className="flex items-center gap-3">
							<Switch checked={deptForm.isActive} onCheckedChange={v => setDeptForm(f => ({ ...f, isActive: v }))} id="dept-active" />
							<Label htmlFor="dept-active">Active</Label>
						</div>
						<div className="flex gap-2">
							<Button size="sm" onClick={handleSaveDept} disabled={upsertDept.isPending}>{upsertDept.isPending ? "Saving..." : "Save"}</Button>
							<Button variant="outline" size="sm" onClick={() => setDeptDialog(null)}>Cancel</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)

	const routingContent = (
		<div className="flex flex-col gap-3">
			<AdminDataTable
				isLoading={isLoading}
				rows={routingDefaults}
				columns={[
					{ key: "caseType", header: "Case Type", render: r => r.caseType },
					{ key: "defaultTeamId", header: "Default Team", render: r => r.defaultTeamId ?? "—" },
					{ key: "defaultDepartmentId", header: "Department", render: r => r.defaultDepartmentId ?? "—" },
					{ key: "defaultPriority", header: "Priority", render: r => r.defaultPriority },
				]}
			/>
			<p className="text-xs text-muted-foreground">To modify routing rules, visit <a href="/admin/routing-rules" className="underline text-primary">Routing Rules</a> in System Admin.</p>
		</div>
	)

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-lg font-semibold">Facility Configuration</h1>
			<SettingsTabs
				tabs={[
					{
						key: "sla",
						label: "SLA Settings",
						content: slaContent,
						saveBar: (
							<Button size="sm" onClick={handleSaveSla} disabled={updateSla.isPending}>
								{updateSla.isPending ? "Saving..." : "Save SLA Settings"}
							</Button>
						),
					},
					{ key: "templates", label: "Notification Templates", content: templateContent },
					{ key: "departments", label: "Departments", content: deptContent },
					{ key: "routing", label: "Routing Defaults", content: routingContent },
				]}
			/>
		</div>
	)
}
