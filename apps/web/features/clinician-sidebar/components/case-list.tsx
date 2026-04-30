"use client"

import { useState } from "react"

import type { ClinicianCaseSummaryItem } from "@repo/contracts"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { AddNoteForm } from "@/features/clinician-sidebar/components/add-note-form"
import { ClinicianCard } from "@/features/clinician-sidebar/components/clinician-card"
import { DenseInfoRow } from "@/features/clinician-sidebar/components/dense-info-row"
import { FlagCaseModal } from "@/features/clinician-sidebar/components/flag-case-modal"
import { ViewFullCaseLink } from "@/features/clinician-sidebar/components/view-full-case-link"

const STATUS_VARIANT: Record<
	ClinicianCaseSummaryItem["status"],
	"default" | "secondary" | "destructive" | "outline"
> = {
	submitted: "outline",
	in_review: "secondary",
	approved: "default",
	rejected: "destructive",
	closed: "outline",
	withdrawn: "outline",
}

const STATUS_LABEL: Record<ClinicianCaseSummaryItem["status"], string> = {
	submitted: "Submitted",
	in_review: "In review",
	approved: "Approved",
	rejected: "Rejected",
	closed: "Closed",
	withdrawn: "Withdrawn",
}

function formatDate(value: Date | string | null | undefined): string {
	if (!value) return "—"
	const date = value instanceof Date ? value : new Date(value)
	if (Number.isNaN(date.getTime())) return "—"
	return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

function CaseRow({ item }: { item: ClinicianCaseSummaryItem }) {
	const [showAddNote, setShowAddNote] = useState(false)

	return (
		<ClinicianCard
			title={item.caseRef}
			defaultOpen={false}
			lastSyncedAt={null}
			headerAction={
				<>
					{item.flagCount > 0 ? (
						<Badge variant="destructive" className="shrink-0">
							{item.flagCount} flag{item.flagCount === 1 ? "" : "s"}
						</Badge>
					) : null}
					<Badge variant={STATUS_VARIANT[item.status]} className="shrink-0">
						{STATUS_LABEL[item.status]}
					</Badge>
				</>
			}
		>
			<dl className="divide-border divide-y">
				<DenseInfoRow label="Type" value={item.caseType} />
				<DenseInfoRow label="Opened" value={formatDate(item.openedAt)} />
				<DenseInfoRow
					label="Assigned"
					value={item.assignedAgentName ?? "Unassigned"}
					sub={item.assignedAgentEmail ?? undefined}
				/>
				{item.loaStatus ? <DenseInfoRow label="LOA" value={item.loaStatus} /> : null}
				{item.latestNote ? (
					<DenseInfoRow
						label="Latest note"
						value={item.latestNote}
						sub={item.latestNoteAt ? formatDate(item.latestNoteAt) : undefined}
					/>
				) : null}
			</dl>

			<div className="mt-3 flex items-center justify-between gap-2">
				<ViewFullCaseLink caseRef={item.caseRef} />
				<div className="flex items-center gap-1">
					<FlagCaseModal
						caseRef={item.caseRef}
						trigger={
							<Button type="button" variant="outline" size="xs">
								Flag
							</Button>
						}
					/>
					<Button
						type="button"
						variant="outline"
						size="xs"
						onClick={() => setShowAddNote(v => !v)}
					>
						{showAddNote ? "Hide" : "Add note"}
					</Button>
				</div>
			</div>

			{showAddNote ? (
				<div className="mt-3 border-t pt-3">
					<AddNoteForm caseRef={item.caseRef} onClose={() => setShowAddNote(false)} />
				</div>
			) : null}
		</ClinicianCard>
	)
}

export function CaseList({ cases }: { cases: ClinicianCaseSummaryItem[] }) {
	if (cases.length === 0) {
		return (
			<p className="text-muted-foreground rounded-md border border-dashed px-3 py-4 text-center text-xs italic">
				No active cases for this patient.
			</p>
		)
	}

	return (
		<div className="flex flex-col gap-2">
			{cases.map(item => (
				<CaseRow key={item.caseRef} item={item} />
			))}
		</div>
	)
}
