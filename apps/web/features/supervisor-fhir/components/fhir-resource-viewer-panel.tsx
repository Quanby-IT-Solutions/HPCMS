"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { FhirResourceType } from "@repo/contracts"

import { Button } from "@/core/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	useFhirLinkResourceMutation,
	useFhirResourceQuery,
} from "@/features/supervisor-fhir/api/supervisor-fhir.hooks"
import { RightRailPanel } from "@/features/supervisor-workspace/components/right-rail-panel"
import { orpc } from "@/services/orpc/client"
import { useQueryClient } from "@tanstack/react-query"

const RESOURCE_TYPES: FhirResourceType[] = ["Encounter", "Condition", "ServiceRequest"]

const STATUS_STYLES: Record<string, string> = {
	active: "bg-green-100 text-green-700",
	finished: "bg-slate-100 text-slate-600",
	completed: "bg-slate-100 text-slate-600",
	planned: "bg-blue-100 text-blue-700",
	cancelled: "bg-red-100 text-red-700",
}

interface Props {
	patientId: string
	caseRef?: string
	readOnly?: boolean
}

export function FhirResourceViewerPanel({ patientId, caseRef, readOnly = false }: Props) {
	const [resourceType, setResourceType] = useState<FhirResourceType>("Encounter")
	const { data, isLoading, refetch } = useFhirResourceQuery(patientId, resourceType)
	const linkResource = useFhirLinkResourceMutation()
	const queryClient = useQueryClient()
	const [contextPulled, setContextPulled] = useState(false)
	const [pullingCtx, setPullingCtx] = useState(false)

	async function handleLink(fhirResourceId: string) {
		if (!caseRef) return
		try {
			await linkResource.mutateAsync({ caseRef, fhirResourceId, resourceType })
			toast.success("Linked to case")
		} catch (err) {
			const status = (err as { status?: number })?.status
			if (status === 403) {
				toast.error("Access denied", { description: "You do not have permission to link FHIR resources to this case." })
			} else {
				toast.error("Failed", { description: (err as Error).message })
			}
		}
	}

	async function handlePullContext() {
		setPullingCtx(true)
		try {
			await Promise.all(
				RESOURCE_TYPES.map(rt =>
					queryClient.refetchQueries({
						queryKey: orpc.supervisor.fhir.queryResources.queryOptions({ input: { patientId, resourceType: rt } }).queryKey,
					})
				)
			)
			setContextPulled(true)
		} finally {
			setPullingCtx(false)
		}
	}

	return (
		<RightRailPanel
			title="FHIR Resources"
			storageKey={`fhir-viewer-${patientId}`}
			actions={
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="sm"
						className="h-6 text-xs"
						onClick={handlePullContext}
						disabled={pullingCtx}
					>
						{pullingCtx ? "Pulling…" : "Pull Context"}
					</Button>
					<Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => refetch()}>
						Refresh
					</Button>
				</div>
			}
		>
			<div className="flex flex-col gap-2">
				{(data?.syncedAt || contextPulled) && (
					<span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[10px] font-medium">
						Synced {data?.syncedAt ? new Date(data.syncedAt).toLocaleTimeString() : "just now"}
					</span>
				)}

				<Select value={resourceType} onValueChange={v => setResourceType(v as FhirResourceType)}>
					<SelectTrigger className="h-7 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{RESOURCE_TYPES.map(rt => (
							<SelectItem key={rt} value={rt}>{rt}</SelectItem>
						))}
					</SelectContent>
				</Select>

				{isLoading ? (
					<div className="flex flex-col gap-1">
						{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
					</div>
				) : (
					<div className="flex flex-col gap-1">
						{(data?.rows ?? []).map(row => (
							<div key={row.id} className="flex items-start justify-between gap-2 rounded border p-2">
								<div className="flex flex-col gap-0.5 min-w-0">
									<p className="text-xs font-medium truncate">{row.display}</p>
									<div className="flex items-center gap-1">
										{row.status ? (
											<span className={`inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium ${STATUS_STYLES[row.status] ?? "bg-slate-100 text-slate-600"}`}>
												{row.status}
											</span>
										) : null}
										{row.date ? (
											<span className="text-[11px] text-muted-foreground">
												{new Date(row.date).toLocaleDateString()}
											</span>
										) : null}
									</div>
								</div>
								{!readOnly && caseRef ? (
									<Button
										variant="ghost"
										size="sm"
										className="h-6 text-xs shrink-0"
										onClick={() => handleLink(row.id)}
										disabled={linkResource.isPending}
									>
										Link
									</Button>
								) : null}
							</div>
						))}
						{(data?.rows ?? []).length === 0 ? (
							<p className="text-xs text-muted-foreground">No {resourceType} records found.</p>
						) : null}
					</div>
				)}
			</div>
		</RightRailPanel>
	)
}
