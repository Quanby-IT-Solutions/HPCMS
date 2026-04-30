"use client"

import * as React from "react"
import { toast } from "sonner"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { CaseTypeForm } from "@/features/staff-admin/components/case-type-form"
import {
	useArchiveCaseTypeMutation,
	useCaseTypesQuery,
	useReactivateCaseTypeMutation,
} from "@/features/staff-admin/api/admin.hooks"

type Priority = "low" | "medium" | "high" | "urgent"

const PRIORITY_BADGE: Record<Priority, React.ReactNode> = {
	low: <Badge variant="secondary">Low</Badge>,
	medium: <Badge variant="outline">Medium</Badge>,
	high: <Badge className="bg-orange-100 text-orange-700 border-orange-200">High</Badge>,
	urgent: <Badge variant="destructive">Urgent</Badge>,
}

interface CaseTypeRow {
	id: string
	name: string
	description: string | null
	defaultPriority: Priority
	slaHours: number
	defaultTeam: string | null
	requiredFields: string[]
	optionalFields: string[]
	defaultRoutingRuleId: string | null
	status: "active" | "archived"
}

export default function CaseTypesPage() {
	const { data, isLoading } = useCaseTypesQuery()
	const archiveMutation = useArchiveCaseTypeMutation()
	const reactivateMutation = useReactivateCaseTypeMutation()

	const [formOpen, setFormOpen] = React.useState(false)
	const [editData, setEditData] = React.useState<CaseTypeRow | undefined>(undefined)

	const rows: CaseTypeRow[] = (data?.items ?? []) as CaseTypeRow[]

	const columns = [
		{
			key: "name",
			header: "Name",
			sortable: true,
			render: (row: CaseTypeRow) => <span className="font-medium">{row.name}</span>,
		},
		{
			key: "defaultPriority",
			header: "Default Priority",
			render: (row: CaseTypeRow) => PRIORITY_BADGE[row.defaultPriority],
		},
		{
			key: "slaHours",
			header: "SLA Hours",
			render: (row: CaseTypeRow) => <span>{row.slaHours}h</span>,
		},
		{
			key: "defaultTeam",
			header: "Default Team",
			render: (row: CaseTypeRow) => (
				<span className="text-muted-foreground">{row.defaultTeam ?? "—"}</span>
			),
		},
		{
			key: "status",
			header: "Status",
			render: (row: CaseTypeRow) =>
				row.status === "active" ? (
					<Badge variant="default">Active</Badge>
				) : (
					<Badge variant="secondary">Archived</Badge>
				),
		},
	]

	const rowActions = [
		{
			label: "Edit",
			onClick: (row: CaseTypeRow) => {
				setEditData(row)
				setFormOpen(true)
			},
		},
		{
			label: "Archive",
			variant: "destructive" as const,
			onClick: async (row: CaseTypeRow) => {
				if (row.status === "archived") return
				if (!confirm(`Archive case type "${row.name}"?`)) return
				try {
					await archiveMutation.mutateAsync({ id: row.id })
					toast.success(`"${row.name}" archived.`)
				} catch {
					toast.error("Failed to archive case type.")
				}
			},
		},
		{
			label: "Reactivate",
			onClick: async (row: CaseTypeRow) => {
				if (row.status === "active") return
				try {
					await reactivateMutation.mutateAsync({ id: row.id })
					toast.success(`"${row.name}" reactivated.`)
				} catch {
					toast.error("Failed to reactivate case type.")
				}
			},
		},
	]

	function handleAdd() {
		setEditData(undefined)
		setFormOpen(true)
	}

	return (
		<div className="flex flex-col gap-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold">Case Types</h1>
				<Button onClick={handleAdd}>Add Case Type</Button>
			</div>

			<AdminDataTable
				columns={columns}
				rows={rows}
				rowActions={rowActions}
				isLoading={isLoading}
				emptyMessage="No case types found."
			/>

			<CaseTypeForm
				open={formOpen}
				onOpenChange={open => {
					setFormOpen(open)
					if (!open) setEditData(undefined)
				}}
				initialData={editData}
			/>
		</div>
	)
}
