"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Lock } from "@/core/components/icons"
import { Button } from "@/core/components/ui/button"
import { Label } from "@/core/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Textarea } from "@/core/components/ui/textarea"
import {
	useCrossFacilityContextQuery,
	useRequestCrossFacilityAccessMutation,
} from "@/features/supervisor-patients/api/supervisor-cross-facility.hooks"
import { RightRailPanel } from "@/features/supervisor-workspace/components/right-rail-panel"

interface Props {
	patientId: string
}

export function CrossFacilityPatientContextPanel({ patientId }: Props) {
	const { data, isLoading } = useCrossFacilityContextQuery(patientId)
	const request = useRequestCrossFacilityAccessMutation()

	const [requestingFacilityId, setRequestingFacilityId] = useState<string | null>(null)
	const [justification, setJustification] = useState("")
	const [urgency, setUrgency] = useState<"read_only" | "full">("read_only")
	const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())

	const facilities = data?.facilities ?? []
	const isMultiFacility = facilities.length > 1

	async function handleRequest(targetTenantId: string) {
		if (!justification.trim()) return
		try {
			await request.mutateAsync({
				patientId,
				targetTenantId,
				requestedLevel: urgency,
				justification: justification.trim(),
			})
			toast.success("Access request submitted")
			setPendingIds(prev => new Set([...prev, targetTenantId]))
			setRequestingFacilityId(null)
			setJustification("")
		} catch (err) {
			toast.error("Request failed", { description: (err as Error).message })
		}
	}

	return (
		<RightRailPanel
			title="Cross-Facility"
			storageKey={`cross-fac-${patientId}`}
			isLoading={isLoading}
		>
			{!isMultiFacility ? (
				<p className="text-muted-foreground text-xs">Single facility — no cross-facility records.</p>
			) : (
				<div className="flex flex-col gap-2 text-sm">
					{facilities.map(f => (
						<div key={f.tenantId} className="rounded-md border p-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-1">
									{f.accessLevel === "none" ? (
										<Lock className="text-muted-foreground size-3" />
									) : null}
									<span className="font-medium text-xs">{f.facilityName}</span>
								</div>
								<span className="text-muted-foreground text-[10px]">{f.accessLevel === "none" ? "— cases" : `${f.caseCount} cases`}</span>
								{(f.accessLevel === "full" || f.accessLevel === "read_only") && <a href={"/supervisor/cases?facility=" + f.tenantId} className="text-xs text-primary hover:underline ml-2">View Cases</a>}
							</div>
							{f.lastInteractionAt ? (
								<p className="text-[10px] text-muted-foreground mt-0.5">
									Last: {new Date(f.lastInteractionAt).toLocaleDateString()}
								</p>
							) : null}
							{pendingIds.has(f.tenantId) && f.accessLevel === "none" ? (
							<p className="text-[10px] text-yellow-700 bg-yellow-50 rounded px-1.5 py-0.5 mt-1">
								Access request pending
							</p>
						) : null}
						{!pendingIds.has(f.tenantId) && f.accessLevel === "none" ? (
								requestingFacilityId === f.tenantId ? (
									<div className="flex flex-col gap-1.5 mt-2">
										<Label className="text-xs">Access level</Label>
										<Select value={urgency} onValueChange={v => setUrgency(v as typeof urgency)}>
											<SelectTrigger className="h-6 text-xs"><SelectValue /></SelectTrigger>
											<SelectContent>
												<SelectItem value="read_only">Read only</SelectItem>
												<SelectItem value="full">Full</SelectItem>
											</SelectContent>
										</Select>
										<Textarea
											rows={2}
											value={justification}
											onChange={e => setJustification(e.target.value)}
											placeholder="Justification…"
											className="text-xs"
										/>
										<div className="flex gap-1">
											<Button size="sm" className="h-6 text-xs" onClick={() => handleRequest(f.tenantId)} disabled={!justification.trim() || request.isPending}>
												{request.isPending ? "Sending…" : "Request"}
											</Button>
											<Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setRequestingFacilityId(null)}>Cancel</Button>
										</div>
									</div>
								) : (
									<Button variant="ghost" size="sm" className="h-6 text-xs mt-1" onClick={() => setRequestingFacilityId(f.tenantId)}>
										Request access
									</Button>
								)
							) : null}
						</div>
					))}
				</div>
			)}
		</RightRailPanel>
	)
}
