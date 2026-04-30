"use client"

import { useState } from "react"

import { Skeleton } from "@/core/components/ui/skeleton"
import { useSupervisorCaseGetQuery } from "@/features/supervisor-cases/api/supervisor-cases.hooks"
import { CaseAssignmentPanel } from "@/features/supervisor-cases/components/case-assignment-panel"
import { EscalationHistoryPanel } from "@/features/supervisor-cases/components/escalation-history-panel"
import { RelatedCasesPanel } from "@/features/supervisor-cases/components/related-cases-panel"
import { FhirResourceViewerPanel } from "@/features/supervisor-fhir/components/fhir-resource-viewer-panel"
import { useIncidentListQuery } from "@/features/supervisor-incidents/api/supervisor-incidents.hooks"
import { CaseDetailShell } from "@/features/supervisor-workspace/components/case-detail-shell"
import { RightRailPanel } from "@/features/supervisor-workspace/components/right-rail-panel"
import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
import Link from "next/link"

interface Props {
	caseRef: string
}

export function CaseDetailPageClient({ caseRef }: Props) {
	const { data: caseData, isLoading } = useSupervisorCaseGetQuery(caseRef)
	const { data: incidentList } = useIncidentListQuery()
	const linkedIncident = incidentList?.rows.find(i => i.caseRefs.includes(caseRef))
	const [activeTab, setActiveTab] = useState<"overview" | "communications" | "notes" | "linked" | "claims">("overview")

	if (isLoading || !caseData) {
		return (
			<div className="flex flex-col gap-3 p-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-48 w-full" />
			</div>
		)
	}

	const c = caseData as unknown as Record<string, unknown>

	const now = Date.now()
	const slaMs = c.slaDeadline ? new Date(c.slaDeadline as string).getTime() - now : null
	const slaMinutes = slaMs != null ? Math.max(0, Math.floor(slaMs / 60000)) : null

	const rightRail = (
		<>
			<CaseAssignmentPanel caseRef={caseRef} />
			<EscalationHistoryPanel caseRef={caseRef} />
			<RelatedCasesPanel caseRef={caseRef} />
			<FhirResourceViewerPanel patientId={caseData.patientId} caseRef={caseRef} />
			<RightRailPanel title="Linked Incident" storageKey={`case-incident-${caseRef}`}>
				{linkedIncident ? (
					<div className="flex flex-col gap-1 text-xs">
						<Link href={SUPERVISOR_ROUTES.incidentDetail(linkedIncident.incidentId)} className="font-medium hover:underline">{linkedIncident.title}</Link>
						<div className="flex items-center gap-1.5">
							<span className={`inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium ${linkedIncident.severity === "critical" ? "bg-red-100 text-red-700" : linkedIncident.severity === "high" ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-700"}`}>{linkedIncident.severity}</span>
							<span className="text-muted-foreground">{linkedIncident.status.replace(/_/g, " ")}</span>
						</div>
					</div>
				) : (
					<p className="text-xs text-muted-foreground">No incident linked to this case.</p>
				)}
			</RightRailPanel>
		</>
	)

	return (
		<CaseDetailShell
			caseRef={caseRef}
			status={c.status as string}
			priority={c.priority as string}
			slaMinutesRemaining={slaMinutes}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			rightRail={rightRail}
		>
			{activeTab === "overview" ? (
				<div className="flex flex-col gap-4">
					<div className="rounded-md border p-4">
						<h3 className="font-semibold text-sm mb-3">Case Summary</h3>
						<div className="grid grid-cols-2 gap-y-2 text-sm">
							<span className="text-muted-foreground">Case ref</span><span className="font-mono">{caseRef}</span>
							<span className="text-muted-foreground">Type</span><span>{c.caseType as string}</span>
							<span className="text-muted-foreground">Priority</span><span>{c.priority as string}</span>
							<span className="text-muted-foreground">Status</span><span>{(c.status as string).replace(/_/g, " ")}</span>
							<span className="text-muted-foreground">Patient</span><span>{(c.patientName as string) ?? "—"}</span>
						</div>
					</div>
					{c.description ? (
						<div className="rounded-md border p-4">
							<h3 className="font-semibold text-sm mb-2">Description</h3>
							<p className="text-sm whitespace-pre-wrap">{c.description as string}</p>
						</div>
					) : null}
					{caseData.events && (caseData.events as unknown[]).length > 0 && (
						<div className="rounded-md border p-4">
							<h3 className="font-semibold text-sm mb-2">Status History</h3>
							{(caseData.events as unknown as Array<{ id: string; eventType: string; createdAt: string | Date; actorUserId?: string | null }>).map(e => (
								<div key={e.id} className="border-b py-2 text-xs last:border-0">
									<div className="flex justify-between">
										<span className="font-medium">{e.eventType}</span>
										<span className="text-muted-foreground">{new Date(e.createdAt).toLocaleString()}</span>
									</div>
									{e.actorUserId && <p className="text-muted-foreground">{e.actorUserId}</p>}
								</div>
							))}
						</div>
					)}
				</div>
			) : (
				<div className="bg-muted/20 rounded-md p-6 text-center text-sm text-muted-foreground">
					{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content coming soon.
				</div>
			)}
		</CaseDetailShell>
	)
}
