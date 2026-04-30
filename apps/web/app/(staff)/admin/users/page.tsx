"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { UserDeactivationModal } from "@/features/staff-admin/components/user-deactivation-modal"
import { UserProvisioningForm } from "@/features/staff-admin/components/user-provisioning-form"
import { useAdminUsersQuery } from "@/features/staff-admin/api/admin.hooks"
import { ADMIN_ROUTES } from "@/features/staff-admin/lib/admin-routes"

type UserRole =
	| "system_admin"
	| "tenant_admin"
	| "case_supervisor"
	| "case_agent"
	| "clinician"
	| "patient"

type UserStatus = "active" | "pending_activation" | "inactive"

interface UserRow {
	id: string
	name: string
	email: string
	role: UserRole
	status?: UserStatus
	lastLogin?: Date | string | null
	openCaseCount?: number
}

const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
	system_admin: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
	tenant_admin: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
	case_supervisor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
	case_agent: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
	clinician: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	patient: "bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300",
}

const STATUS_BADGE_CLASSES: Record<UserStatus, string> = {
	active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	pending_activation: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
	inactive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const STATUS_LABELS: Record<UserStatus, string> = {
	active: "Active",
	pending_activation: "Pending Activation",
	inactive: "Inactive",
}

function formatRole(role: string): string {
	return role.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
}

function formatLastLogin(value: Date | string | null | undefined): string {
	if (!value) return "Never"
	try {
		return new Date(value).toLocaleDateString()
	} catch {
		return String(value)
	}
}

interface DeactivationTarget {
	userId: string
	userName: string
	openCaseCount: number
	sessions: Array<{ sessionId: string; ip: string | null; lastActivity: string }>
}

export default function UsersPage() {
	const router = useRouter()
	const [provisioningOpen, setProvisioningOpen] = React.useState(false)
	const [deactivationTarget, setDeactivationTarget] = React.useState<DeactivationTarget | null>(
		null
	)
	const [statusFilter, setStatusFilter] = React.useState("")
	const [roleFilter, setRoleFilter] = React.useState("")
	const [search, setSearch] = React.useState("")

	const { data, isLoading } = useAdminUsersQuery({
		role: (roleFilter || undefined) as UserRole | undefined,
		query: search || undefined,
	})

	const allRows: UserRow[] = (data?.items ?? []) as UserRow[]

	const filteredRows = allRows.filter(row => {
		if (statusFilter && (row.status ?? "active") !== statusFilter) return false
		return true
	})

	const columns = [
		{
			key: "name",
			header: "Name",
			sortable: true,
			render: (row: UserRow) => (
				<div className="flex flex-col">
					<span className="font-medium">{row.name}</span>
					<span className="text-muted-foreground text-xs">{row.email}</span>
				</div>
			),
		},
		{
			key: "role",
			header: "Role",
			render: (row: UserRow) => (
				<span
					className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE_CLASSES[row.role] ?? ""}`}
				>
					{formatRole(row.role)}
				</span>
			),
		},
		{
			key: "status",
			header: "Status",
			render: (row: UserRow) => {
				const s = (row.status ?? "active") as UserStatus
				return (
					<span
						className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[s] ?? ""}`}
					>
						{STATUS_LABELS[s] ?? s}
					</span>
				)
			},
		},
		{
			key: "lastLogin",
			header: "Last Login",
			render: (row: UserRow) => (
				<span className="text-muted-foreground text-sm">
					{formatLastLogin(row.lastLogin)}
				</span>
			),
		},
	]

	const rowActions = [
		{
			label: "Open Profile",
			onClick: (row: UserRow) => router.push(ADMIN_ROUTES.userDetail(String(row.id))),
		},
		{
			label: "Deactivate",
			variant: "destructive" as const,
			onClick: (row: UserRow) => {
				setDeactivationTarget({
					userId: String(row.id),
					userName: row.name,
					openCaseCount: row.openCaseCount ?? 0,
					sessions: [],
				})
			},
		},
	]

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Users</h1>
				<Button onClick={() => setProvisioningOpen(true)}>Add New User</Button>
			</div>

			{/* Filter bar */}
			<div className="flex flex-wrap items-center gap-3">
				<Select value={statusFilter} onValueChange={v => setStatusFilter(v ?? "")}>
					<SelectTrigger className="w-44">
						<SelectValue>{statusFilter === "" ? <span className="text-muted-foreground">All statuses</span> : STATUS_LABELS[statusFilter as UserStatus] ?? statusFilter}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">All statuses</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="pending_activation">Pending Activation</SelectItem>
						<SelectItem value="inactive">Inactive</SelectItem>
					</SelectContent>
				</Select>

				<Select value={roleFilter} onValueChange={v => setRoleFilter(v ?? "")}>
					<SelectTrigger className="w-44">
						<SelectValue>{roleFilter === "" ? <span className="text-muted-foreground">All roles</span> : formatRole(roleFilter)}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">All roles</SelectItem>
						<SelectItem value="system_admin">System Admin</SelectItem>
						<SelectItem value="tenant_admin">Tenant Admin</SelectItem>
						<SelectItem value="case_supervisor">Case Supervisor</SelectItem>
						<SelectItem value="case_agent">Case Agent</SelectItem>
						<SelectItem value="clinician">Clinician</SelectItem>
						<SelectItem value="patient">Patient</SelectItem>
					</SelectContent>
				</Select>

				<Input
					placeholder="Search users…"
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="w-56"
				/>
			</div>

			{/* Table */}
			<AdminDataTable
				columns={columns}
				rows={filteredRows}
				totalCount={data?.total}
				page={1}
				pageSize={data?.limit ?? 20}
				isLoading={isLoading}
				rowActions={rowActions}
				emptyMessage="No users found."
			/>

			{/* Provisioning form */}
			<UserProvisioningForm open={provisioningOpen} onOpenChange={setProvisioningOpen} />

			{/* Deactivation modal */}
			{deactivationTarget && (
				<UserDeactivationModal
					open={!!deactivationTarget}
					onOpenChange={open => {
						if (!open) setDeactivationTarget(null)
					}}
					userId={deactivationTarget.userId}
					userName={deactivationTarget.userName}
					openCaseCount={deactivationTarget.openCaseCount}
					activeSessions={deactivationTarget.sessions}
				/>
			)}
		</div>
	)
}
