"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { useCaseAssignMutation } from "@/features/supervisor-cases/api/supervisor-cases.hooks"
import { TeamWorkloadView } from "@/features/supervisor-cases/components/team-workload-view"
import { RightRailPanel } from "@/features/supervisor-workspace/components/right-rail-panel"

interface Props {
	caseRef: string
}

export function CaseAssignmentPanel({ caseRef }: Props) {
	const [teamId, setTeamId] = useState("")
	const [agentUserId, setAgentUserId] = useState("")
	const [routingNotes, setRoutingNotes] = useState("")
	const assign = useCaseAssignMutation()

	async function handleAssign() {
		if (!teamId || !agentUserId) return
		try {
			await assign.mutateAsync({ ref: caseRef, teamId, agentUserId, routingNotes: routingNotes || undefined })
			toast.success("Case assigned")
			setRoutingNotes("")
		} catch (err) {
			toast.error("Assignment failed", { description: (err as Error).message })
		}
	}

	return (
		<RightRailPanel title="Assignment" storageKey={`assign-${caseRef}`}>
			<div className="flex flex-col gap-3 text-sm">
				<TeamWorkloadView onSelectAgent={id => setAgentUserId(id)} />
				<div className="border-t pt-2 flex flex-col gap-2">
					<div className="flex flex-col gap-1">
						<Label className="text-xs">Team ID</Label>
						<Input value={teamId} onChange={e => setTeamId(e.target.value)} className="h-7 text-xs" placeholder="team-uuid" />
					</div>
					<div className="flex flex-col gap-1">
						<Label className="text-xs">Agent ID</Label>
						<Input value={agentUserId} onChange={e => setAgentUserId(e.target.value)} className="h-7 text-xs" placeholder="Selected from above" />
					</div>
					<div className="flex flex-col gap-1">
						<Label className="text-xs">Routing notes</Label>
						<Input value={routingNotes} onChange={e => setRoutingNotes(e.target.value)} className="h-7 text-xs" placeholder="Optional" />
					</div>
					<Button size="sm" className="h-7 text-xs" onClick={handleAssign} disabled={!teamId || !agentUserId || assign.isPending}>
						{assign.isPending ? "Assigning…" : "Confirm Assignment"}
					</Button>
				</div>
			</div>
		</RightRailPanel>
	)
}
