"use client"

import type { ClinicianCaseSummary } from "@repo/contracts"

import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/alert"
import { CaseList } from "@/features/clinician-sidebar/components/case-list"

export function CaseSummaryTab({ summary }: { summary: ClinicianCaseSummary }) {
	if (!summary.patient.linkedToPcms) {
		return (
			<div className="flex flex-col gap-3">
				<Alert>
					<AlertTitle>Patient not linked to PCMS</AlertTitle>
					<AlertDescription>
						This patient has not been registered in PCMS yet. Create a PCMS record to
						start tracking cases.
					</AlertDescription>
				</Alert>
				<a
					href="/staff/cases?createForMrn=open"
					target="_blank"
					rel="noopener noreferrer"
					className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-3 py-2 text-xs font-medium"
				>
					Open PCMS to create case
				</a>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-3">
			<dl className="grid grid-cols-2 gap-2">
				<div className="bg-muted/50 rounded-md p-2.5">
					<dt className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
						Active cases
					</dt>
					<dd className="text-foreground mt-0.5 text-xl font-semibold">
						{summary.activeCount}
					</dd>
				</div>
				<div className="bg-muted/50 rounded-md p-2.5">
					<dt className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
						Latest comm
					</dt>
					<dd className="text-foreground mt-0.5 line-clamp-2 text-xs">
						{summary.mostRecentCommunication ?? "No recent communication"}
					</dd>
				</div>
			</dl>

			<CaseList cases={summary.cases} />
		</div>
	)
}
