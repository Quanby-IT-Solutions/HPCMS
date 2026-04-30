"use client"

import * as React from "react"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs"
import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { TenantAccessModal } from "@/features/staff-admin/components/tenant-access-modal"
import {
	useEffectiveAccessMatrixQuery,
	useTenantQuery,
} from "@/features/staff-admin/api/admin.hooks"

interface TenantDetailPanelProps {
	tenantId: string
}

type AccessLevel = "none" | "read_only" | "full"

const STATUS_BADGE: Record<string, React.ReactNode> = {
	active: <Badge variant="default">Active</Badge>,
	inactive: <Badge variant="secondary">Inactive</Badge>,
	provisioning: <Badge variant="outline">Provisioning</Badge>,
}

const ACCESS_BADGE: Record<AccessLevel, React.ReactNode> = {
	none: <Badge variant="outline">None</Badge>,
	read_only: <Badge variant="secondary">Read-Only</Badge>,
	full: <Badge variant="default">Full</Badge>,
}

interface TenantUserRow {
	id: string
	userId: string
	userName: string
	role: string
	accessLevel: AccessLevel
	crossFacility: boolean
}

export function TenantDetailPanel({ tenantId }: TenantDetailPanelProps) {
	const [modalOpen, setModalOpen] = React.useState(false)
	const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)

	const { data: tenant, isLoading: tenantLoading } = useTenantQuery(tenantId)
	const { data: matrixData, isLoading: matrixLoading } = useEffectiveAccessMatrixQuery()

	const userRows: TenantUserRow[] = (tenant?.users ?? []).map(u => ({
		id: u.userId,
		userId: u.userId,
		userName: u.userName,
		role: u.role,
		accessLevel: u.accessLevel,
		crossFacility: u.crossFacility,
	}))

	const columns = [
		{
			key: "userName",
			header: "User Name",
			sortable: true,
			render: (row: TenantUserRow) => <span className="font-medium">{row.userName}</span>,
		},
		{
			key: "role",
			header: "Role",
			render: (row: TenantUserRow) => (
				<span className="text-muted-foreground capitalize">{row.role.replace(/_/g, " ")}</span>
			),
		},
		{
			key: "accessLevel",
			header: "Access Level",
			render: (row: TenantUserRow) => ACCESS_BADGE[row.accessLevel],
		},
		{
			key: "crossFacility",
			header: "Cross-Facility",
			render: (row: TenantUserRow) => (
				<span>{row.crossFacility ? "Yes" : "No"}</span>
			),
		},
	]

	const rowActions = [
		{
			label: "Manage Access",
			onClick: (row: TenantUserRow) => {
				setSelectedUserId(row.userId)
				setModalOpen(true)
			},
		},
	]

	if (tenantLoading) {
		return (
			<div className="flex flex-col gap-4 p-4">
				<div className="bg-muted h-8 w-48 animate-pulse rounded" />
				<div className="bg-muted h-4 w-32 animate-pulse rounded" />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4">
			{/* Tenant header */}
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<h2 className="text-lg font-semibold">{tenant?.name}</h2>
						{tenant?.status && STATUS_BADGE[tenant.status]}
					</div>
					<p className="text-muted-foreground text-sm">
						Short code: <span className="font-mono">{tenant?.shortCode}</span>
						{" · "}
						{tenant?.userCount ?? 0} users · {tenant?.caseCount ?? 0} cases
					</p>
				</div>
				<Button onClick={() => setModalOpen(true)}>Manage Access</Button>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="users">
				<TabsList>
					<TabsTrigger value="users">Users</TabsTrigger>
					<TabsTrigger value="matrix">Effective Access Matrix</TabsTrigger>
				</TabsList>

				<TabsContent value="users" className="mt-3">
					<AdminDataTable
						columns={columns}
						rows={userRows}
						rowActions={rowActions}
						isLoading={tenantLoading}
						emptyMessage="No users assigned to this tenant."
					/>
				</TabsContent>

				<TabsContent value="matrix" className="mt-3">
					<div className="rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>User</TableHead>
									<TableHead>Tenant</TableHead>
									<TableHead>Resource Type</TableHead>
									<TableHead>Level</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{matrixLoading ? (
									<TableRow>
										<TableCell colSpan={4} className="text-muted-foreground py-8 text-center text-sm">
											Loading…
										</TableCell>
									</TableRow>
								) : (matrixData?.rows ?? []).length === 0 ? (
									<TableRow>
										<TableCell colSpan={4} className="text-muted-foreground py-8 text-center text-sm">
											No access data found.
										</TableCell>
									</TableRow>
								) : (
									(matrixData?.rows ?? []).map((row, idx) => (
										<TableRow key={idx}>
											<TableCell>{row.userName}</TableCell>
											<TableCell className="font-mono text-xs">{row.tenantId}</TableCell>
											<TableCell>{row.resourceType}</TableCell>
											<TableCell>{ACCESS_BADGE[row.level as AccessLevel]}</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</TabsContent>
			</Tabs>

			{/* Access modal */}
			{tenant && (
				<TenantAccessModal
					open={modalOpen}
					onOpenChange={open => {
						setModalOpen(open)
						if (!open) setSelectedUserId(null)
					}}
					tenantId={tenantId}
					tenantName={tenant.name}
				/>
			)}
		</div>
	)
}
