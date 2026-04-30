"use client"

import { TenantDetailPanel } from "@/features/staff-admin/components/tenant-detail-panel"

export default function TenantDetailPage({ params }: { params: { id: string } }) {
	return (
		<div className="max-w-4xl">
			<TenantDetailPanel tenantId={params.id} />
		</div>
	)
}
