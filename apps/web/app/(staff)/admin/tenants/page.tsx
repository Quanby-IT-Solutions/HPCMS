"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@/core/components/ui/badge"
import { Button, buttonVariants } from "@/core/components/ui/button"
import { cn } from "@/core/lib/utils"
import { TenantDetailPanel } from "@/features/staff-admin/components/tenant-detail-panel"
import { useTenantsQuery } from "@/features/staff-admin/api/admin.hooks"
import { ADMIN_ROUTES } from "@/features/staff-admin/lib/admin-routes"

const STATUS_BADGE: Record<string, React.ReactNode> = {
	active: <Badge variant="default">Active</Badge>,
	inactive: <Badge variant="secondary">Inactive</Badge>,
	provisioning: <Badge variant="outline">Provisioning</Badge>,
}

export default function TenantsPage() {
	const [selectedTenantId, setSelectedTenantId] = React.useState<string | null>(null)
	const { data, isLoading } = useTenantsQuery()
	const tenants = data?.tenants ?? []

	return (
		<div className="flex flex-col gap-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold">Tenants</h1>
				<Link href={ADMIN_ROUTES.tenantNew} className={buttonVariants()}>
					New Facility
				</Link>
			</div>

			{/* Two-panel layout */}
			<div className="flex gap-4">
				{/* Left: tenant list */}
				<div className="w-72 shrink-0">
					<div className="flex flex-col gap-1 rounded-lg border p-1">
						{isLoading ? (
							Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="bg-muted h-14 animate-pulse rounded-md" />
							))
						) : tenants.length === 0 ? (
							<p className="text-muted-foreground p-4 text-sm">No tenants found.</p>
						) : (
							tenants.map(tenant => (
								<button
									key={tenant.id}
									type="button"
									onClick={() => setSelectedTenantId(tenant.id)}
									className={cn(
										"flex w-full flex-col gap-0.5 rounded-md px-3 py-2 text-left transition-colors",
										selectedTenantId === tenant.id
											? "bg-accent text-accent-foreground"
											: "hover:bg-muted"
									)}
								>
									<div className="flex items-center justify-between gap-2">
										<span className="truncate text-sm font-medium">{tenant.name}</span>
										{STATUS_BADGE[tenant.status]}
									</div>
									<div className="text-muted-foreground flex items-center gap-2 text-xs">
										<span className="font-mono">{tenant.shortCode}</span>
										<span>·</span>
										<span>{tenant.userCount} users</span>
										<span>·</span>
										<span>{tenant.caseCount} cases</span>
									</div>
								</button>
							))
						)}
					</div>
				</div>

				{/* Right: detail panel */}
				<div className="min-w-0 flex-1 rounded-lg border p-4">
					{selectedTenantId ? (
						<TenantDetailPanel tenantId={selectedTenantId} />
					) : (
						<div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
							Select a tenant to view details.
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
