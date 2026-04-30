"use client"

import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/alert"
import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	useApproveCaseMutation,
	useCaseDetailQuery,
	useCloseCaseMutation,
} from "@/features/agent-case-detail/api/cases.hooks"
import { CaseDetailTabs } from "@/features/agent-case-detail/components/case-detail-tabs"
import { CaseResolutionDialog } from "@/features/agent-case-detail/components/case-resolution-dialog"
import { CaseRightRail } from "@/features/agent-case-detail/components/case-right-rail"
import { RejectDialog } from "@/features/agent-case-detail/components/reject-dialog"
import { SLATimer } from "@/features/agent-ux/components/sla-timer"

const TERMINAL_STATUSES = new Set(["approved", "rejected", "closed", "withdrawn"])

// Derive a default SLA window from submission until backend supplies one.
function deriveSlaDueAt(submittedAt: Date | string): Date {
	const start = submittedAt instanceof Date ? submittedAt : new Date(submittedAt)
	return new Date(start.getTime() + 3 * 24 * 60 * 60 * 1000)
}

function deriveTags(detail: {
	caseType: string
	priority: string
	sourceChannel: string | null
}): string[] {
	const tags = [detail.caseType, detail.priority]
	if (detail.sourceChannel) tags.push(detail.sourceChannel)
	return tags
}

export function CaseDetailShell({ caseRef }: { caseRef: string }) {
	const { data: detail, isLoading } = useCaseDetailQuery(caseRef)
	const { mutateAsync: approve, isPending: approving } = useApproveCaseMutation()
	const { mutateAsync: close, isPending: closing } = useCloseCaseMutation()

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4">
				<Skeleton className="h-12 w-1/2" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-64 w-full" />
			</div>
		)
	}

	if (!detail) {
		return <p className="text-muted-foreground text-sm">Case not found.</p>
	}

	const isReadOnly = TERMINAL_STATUSES.has(detail.status)

	async function handleApprove() {
		try {
			await approve({ ref: caseRef })
			toast.success("Case approved")
		} catch {
			toast.error("Failed to approve case")
		}
	}
	async function handleClose() {
		try {
			await close({ ref: caseRef })
			toast.success("Case closed")
		} catch {
			toast.error("Failed to close case")
		}
	}

	const closureLabels: Record<string, { title: string; description: string }> = {
		approved: {
			title: "Approved",
			description: "Case has been approved. The detail view is read-only.",
		},
		rejected: {
			title: "Rejected",
			description: "Case has been rejected. Reopen via supervisor escalation.",
		},
		closed: {
			title: "Closed",
			description: "Case is closed. No further edits are accepted.",
		},
		withdrawn: {
			title: "Withdrawn",
			description: "Case was withdrawn by the patient. Read-only.",
		},
	}
	const closure = closureLabels[detail.status]

	return (
		<div className="flex flex-col gap-4">
			{isReadOnly && closure ? (
				<Alert>
					<AlertTitle>{closure.title}</AlertTitle>
					<AlertDescription>{closure.description}</AlertDescription>
				</Alert>
			) : null}
			<header className="flex items-start justify-between gap-3 border-b pb-4">
				<div className="flex flex-col gap-2">
					<div className="flex flex-wrap items-center gap-2">
						<h1 className="font-mono text-base font-semibold">{detail.caseRef}</h1>
						<Badge variant="outline">{detail.status.replace(/_/g, " ")}</Badge>
						<Badge variant="secondary">{detail.priority}</Badge>
						{isReadOnly ? <Badge variant="outline">Read-only</Badge> : null}
						{!isReadOnly ? (
							<SLATimer
								dueAt={deriveSlaDueAt(detail.submittedAt)}
								startedAt={detail.submittedAt}
							/>
						) : null}
					</div>
					<div className="flex flex-wrap items-center gap-1.5">
						{deriveTags(detail).map(tag => (
							<Badge key={tag} variant="ghost" className="font-normal">
								#{tag}
							</Badge>
						))}
					</div>
					<p className="text-muted-foreground text-xs">
						submitted {new Date(detail.submittedAt).toLocaleString()}
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{!isReadOnly &&
						(detail.status === "submitted" || detail.status === "in_review") && (
							<>
								<Button size="sm" onClick={handleApprove} disabled={approving}>
									{approving ? "Approving…" : "Approve"}
								</Button>
								<RejectDialog caseRef={caseRef} />
								<CaseResolutionDialog caseRef={caseRef} />
							</>
						)}
					{!isReadOnly && detail.status === "approved" ? (
						<Button variant="outline" size="sm" onClick={handleClose} disabled={closing}>
							{closing ? "Closing…" : "Close"}
						</Button>
					) : null}
				</div>
			</header>

			<div className="flex flex-col gap-4 lg:flex-row">
				<div className="min-w-0 flex-1">
					<CaseDetailTabs detail={detail} />
				</div>
				<CaseRightRail detail={detail} />
			</div>
		</div>
	)
}
