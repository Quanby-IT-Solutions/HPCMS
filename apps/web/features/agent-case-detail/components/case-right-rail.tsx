"use client"

import type { CaseDetail } from "@repo/contracts"

import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { AssignPopover } from "@/features/agent-case-detail/components/assign-popover"
import { ProgramsAndDevicesPanel } from "@/features/agent-patients/components/programs-and-devices-panel"
import { PlaybookPanel } from "@/features/agent-playbooks/components/playbook-panel"

interface Props {
	detail: CaseDetail
}

/**
 * Right-rail panels per CA-FE-06.
 * Most slots are placeholders that get populated by other tickets:
 *  - Escalation (CA-FE / SUP-FE-09)
 *  - Related cases (SUP-FE-10)
 *  - FHIR (SUP-FE-19)
 *  - Playbook (CA-FE-15)
 *  - Programs / devices (CA-FE-16)
 */
export function CaseRightRail({ detail }: Props) {
	return (
		<aside className="flex w-[320px] shrink-0 flex-col gap-3">
			<Card size="sm">
				<CardHeader>
					<CardTitle className="text-xs uppercase tracking-wider">Assignment</CardTitle>
				</CardHeader>
				<CardContent className="text-xs">
					<p className="text-muted-foreground mb-2">
						{detail.assignedUserId
							? `Assigned to ${detail.assignedUserId.slice(0, 8)}…`
							: "Unassigned"}
					</p>
					<AssignPopover caseRef={detail.caseRef} />
				</CardContent>
			</Card>

			<Card size="sm">
				<CardHeader>
					<CardTitle className="text-xs uppercase tracking-wider">Escalation</CardTitle>
				</CardHeader>
				<CardContent className="text-muted-foreground text-xs italic">
					Stub — escalation form lands in SUP-FE-09.
				</CardContent>
			</Card>

			<Card size="sm">
				<CardHeader>
					<CardTitle className="text-xs uppercase tracking-wider">Related cases</CardTitle>
				</CardHeader>
				<CardContent className="text-muted-foreground text-xs italic">
					Stub — populated by SUP-FE-10.
				</CardContent>
			</Card>

			<PlaybookPanel caseRef={detail.caseRef} />

			<ProgramsAndDevicesPanel patientId={detail.patientId} kind="programs" />
			<ProgramsAndDevicesPanel patientId={detail.patientId} kind="devices" />

			<Card size="sm">
				<CardHeader>
					<CardTitle className="text-xs uppercase tracking-wider">FHIR</CardTitle>
				</CardHeader>
				<CardContent className="text-muted-foreground text-xs italic">
					Stub — SUP-FE-19 FHIR resource viewer.
				</CardContent>
			</Card>
		</aside>
	)
}
