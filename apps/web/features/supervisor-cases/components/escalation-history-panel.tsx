"use client"

import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import { useEscalationHistoryQuery } from "@/features/supervisor-cases/api/supervisor-escalation.hooks"
import { EscalateCaseModal } from "@/features/supervisor-cases/components/escalate-case-modal"
import { RightRailPanel } from "@/features/supervisor-workspace/components/right-rail-panel"

const LEVEL_LABELS: Record<string, string> = {
	senior_coordinator: "Senior Coord.",
	department_head: "Dept. Head",
	incident_management: "Incident Mgmt.",
}

interface Props {
	caseRef: string
}

export function EscalationHistoryPanel({ caseRef }: Props) {
	const { data, isLoading } = useEscalationHistoryQuery(caseRef)

	return (
		<RightRailPanel
			title="Escalation History"
			storageKey={`esc-${caseRef}`}
			isLoading={isLoading}
			actions={
				<EscalateCaseModal
					caseRef={caseRef}
					trigger={
						<Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Escalate</Button>
					}
				/>
			}
		>
			{(data?.history ?? []).length === 0 ? (
				<p className="text-muted-foreground text-xs">No escalations yet.</p>
			) : (
				<div className="flex flex-col gap-2">
					{data!.history.map(h => (
						<div key={h.id} className="rounded-md border p-2 text-xs">
							<div className="flex items-center justify-between">
								<span className="font-medium">{LEVEL_LABELS[h.level] ?? h.level}</span>
								<span className="text-muted-foreground">{new Date(h.escalatedAt).toLocaleDateString()}</span>
							</div>
							<p className="text-muted-foreground mt-0.5">{h.reasonCategory} · {h.escalatedBy}</p>
							<p className="mt-1">{h.notes}</p>
						</div>
					))}
				</div>
			)}
		</RightRailPanel>
	)
}
