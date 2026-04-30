"use client"

import { Skeleton } from "@/core/components/ui/skeleton"
import { useClaimHeaderQuery } from "@/features/agent-claims/api/claims.hooks"
import { ClaimHeaderForm } from "@/features/agent-claims/components/claim-header-form"
import { ClaimLinesTable } from "@/features/agent-claims/components/claim-lines-table"
import { ClaimStatusUpdateModal } from "@/features/agent-claims/components/claim-status-update-modal"
import { DrgPanel } from "@/features/agent-claims/components/drg-panel"
import { XmlExportPanel } from "@/features/agent-claims/components/xml-export-panel"

export function ClaimDetailPage({ claimId }: { claimId: string }) {
	const { data, isLoading } = useClaimHeaderQuery(claimId)

	if (isLoading || !data) {
		return <Skeleton className="h-64 w-full" />
	}

	return (
		<div className="flex flex-col gap-4">
			<header className="flex items-start justify-between gap-2 border-b pb-3">
				<div>
					<h1 className="text-2xl font-bold">Claim {data.id}</h1>
					<p className="text-muted-foreground text-xs">
						{data.patientName} · case <code>{data.caseRef}</code> ·{" "}
						<span className="capitalize">{data.status.replace(/_/g, " ")}</span>
					</p>
				</div>
				<ClaimStatusUpdateModal header={data} />
			</header>
			<ClaimHeaderForm header={data} />
			<ClaimLinesTable header={data} />
			<DrgPanel claimId={data.id} />
			<XmlExportPanel claimId={data.id} />
		</div>
	)
}
