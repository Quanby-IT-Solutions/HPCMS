"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/core/components/ui/sheet"
import { useRoleMatrixQuery, useUpdateRoleMatrixMutation } from "@/features/staff-admin/api/admin.hooks"
import { PermissionMatrix, type PermissionDiff } from "@/features/staff-admin/components/permission-matrix"

const ROLE_DESCRIPTIONS: Record<string, string> = {
	system_admin: "Full system access",
	tenant_admin: "Manages facility config and users",
	case_supervisor: "Manages cases and teams",
	case_agent: "Handles patient cases",
	clinician: "Clinical care delivery",
	patient: "Patient portal access",
}

function formatRoleLabel(role: string): string {
	return role
		.split("_")
		.map(part => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ")
}

export function RoleMatrixPage() {
	const query = useRoleMatrixQuery()
	const updateMatrix = useUpdateRoleMatrixMutation()

	const [localValues, setLocalValues] = React.useState<Record<string, Record<string, boolean>>>({})
	const [pendingDiffs, setPendingDiffs] = React.useState<PermissionDiff[]>([])
	const [selectedRole, setSelectedRole] = React.useState<string | null>(null)

	const matrixData = query.data

	// Sync localValues when query data arrives
	React.useEffect(() => {
		if (!matrixData) return
		const copy: Record<string, Record<string, boolean>> = {}
		for (const row of matrixData.rows) {
			copy[row.role] = { ...row.permissions }
		}
		setLocalValues(copy)
	}, [matrixData])

	function handleMatrixChange(diffs: PermissionDiff[]) {
		setPendingDiffs(diffs)
		if (!matrixData) return
		const copy: Record<string, Record<string, boolean>> = {}
		for (const row of matrixData.rows) {
			copy[row.role] = { ...row.permissions }
		}
		for (const diff of diffs) {
			if (!copy[diff.role]) copy[diff.role] = {}
			copy[diff.role]![diff.permKey] = diff.enabled
		}
		setLocalValues(copy)
	}

	function handleDiscard() {
		if (!matrixData) return
		const copy: Record<string, Record<string, boolean>> = {}
		for (const row of matrixData.rows) {
			copy[row.role] = { ...row.permissions }
		}
		setLocalValues(copy)
		setPendingDiffs([])
	}

	async function handleSave() {
		if (!matrixData) return
		await updateMatrix.mutateAsync({ changes: pendingDiffs as Array<{ role: "patient" | "case_agent" | "case_supervisor" | "tenant_admin" | "system_admin" | "clinician"; permKey: string; enabled: boolean }> })
		setPendingDiffs([])
		toast.success("Permissions saved")
	}

	const selectedRoleData = selectedRole
		? matrixData?.rows.find(r => r.role === selectedRole)
		: null

	if (query.isLoading) {
		return (
			<div className="space-y-4 p-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-64 w-full" />
			</div>
		)
	}

	if (!matrixData) return null

	const roles = matrixData.rows.map(r => r.role)
	const permKeys = matrixData.permKeys

	return (
		<div className="flex flex-col gap-4 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-semibold">Roles &amp; Permissions</h1>
					<p className="text-muted-foreground text-sm">
						Click a role column header to view details. Grayed columns are read-only.
					</p>
				</div>
			</div>

			<div className="flex gap-4">
				<div className="min-w-0 flex-1">
					<PermissionMatrixWithClickableHeaders
						permKeys={permKeys}
						roles={roles}
						values={localValues}
						readOnlyRoles={["system_admin"]}
						onChange={handleMatrixChange}
						onRoleClick={role => setSelectedRole(role === selectedRole ? null : role)}
						selectedRole={selectedRole}
					/>
				</div>
			</div>

			{/* Role Detail Sheet */}
			<Sheet open={!!selectedRole} onOpenChange={open => { if (!open) setSelectedRole(null) }}>
				<SheetContent side="right" className="w-80">
					<SheetHeader>
						<SheetTitle>{selectedRole ? formatRoleLabel(selectedRole) : ""}</SheetTitle>
						<SheetDescription>
							{selectedRole ? (ROLE_DESCRIPTIONS[selectedRole] ?? "—") : ""}
						</SheetDescription>
					</SheetHeader>
					<div className="p-4">
						<div className="text-sm">
							<span className="text-muted-foreground">Users with this role: </span>
							<span className="font-medium">—</span>
						</div>
						{selectedRoleData && (
							<div className="mt-4">
								<p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
									Permissions
								</p>
								<ul className="space-y-1">
									{permKeys.map(key => (
										<li key={key} className="flex items-center justify-between text-sm">
											<span>{key}</span>
											<span
												className={
													selectedRoleData.permissions[key]
														? "text-green-600 font-medium"
														: "text-muted-foreground"
												}
											>
												{selectedRoleData.permissions[key] ? "Yes" : "No"}
											</span>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</SheetContent>
			</Sheet>

			{/* Save Bar */}
			{pendingDiffs.length > 0 && (
				<div className="bg-background border-t pt-4 sticky bottom-0 flex items-center justify-between gap-4 rounded-lg border p-4 shadow-md">
					<span className="text-sm font-medium">
						{pendingDiffs.length} change{pendingDiffs.length !== 1 ? "s" : ""} pending
					</span>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" onClick={handleDiscard}>
							Discard
						</Button>
						<Button
							size="sm"
							onClick={handleSave}
							disabled={updateMatrix.isPending}
						>
							{updateMatrix.isPending ? "Saving…" : "Save"}
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}

// Wrapper that adds clickable role column headers around PermissionMatrix
interface PermissionMatrixWithClickableHeadersProps {
	permKeys: string[]
	roles: string[]
	values: Record<string, Record<string, boolean>>
	readOnlyRoles?: string[]
	onChange: (diffs: PermissionDiff[]) => void
	onRoleClick: (role: string) => void
	selectedRole: string | null
}

function PermissionMatrixWithClickableHeaders({
	permKeys,
	roles,
	values,
	readOnlyRoles,
	onChange,
	onRoleClick,
	selectedRole,
}: PermissionMatrixWithClickableHeadersProps) {
	// We use the PermissionMatrix as-is but add a thin header row above it via CSS overlay trick.
	// Instead, we render a custom wrapper that intercepts role header clicks.
	// Since PermissionMatrix renders its own table headers, we render the matrix and
	// add an absolutely-positioned transparent button row over each column header.
	// The simplest approach: render the matrix and separately list the role buttons above.
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2 pl-[calc(12rem+7rem)]">
				{roles.map(role => (
					<button
						key={role}
						type="button"
						onClick={() => onRoleClick(role)}
						className={[
							"flex-1 rounded px-2 py-1 text-xs font-medium transition-colors",
							selectedRole === role
								? "bg-primary text-primary-foreground"
								: "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground",
						].join(" ")}
					>
						{role === selectedRole ? "▼ " : ""}Details
					</button>
				))}
			</div>
			<PermissionMatrix
				permKeys={permKeys}
				roles={roles}
				values={values}
				readOnlyRoles={readOnlyRoles}
				onChange={onChange}
			/>
		</div>
	)
}
