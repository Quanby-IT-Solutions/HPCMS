"use client"

import { toast } from "sonner"

import type { CaseEvent } from "@repo/contracts"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import { Download } from "@/core/components/icons"
import {
	useApproveCaseMutation,
	useCaseDetailQuery,
	useCloseCaseMutation,
	useSignDownloadLazy,
} from "../api/cases.hooks"
import { AssignPopover } from "./assign-popover"
import { InternalNoteForm } from "./internal-note-form"
import { PopOutToggle } from "./pop-out-toggle"
import { RejectDialog } from "./reject-dialog"

interface CaseSidePanelProps {
	caseRef: string
	mode?: "inline" | "full"
	onClose?: () => void
}

export function CaseSidePanel({ caseRef, mode = "inline", onClose }: CaseSidePanelProps) {
	const { data: detail, isLoading } = useCaseDetailQuery(caseRef)
	const { mutateAsync: approve, isPending: approving } = useApproveCaseMutation()
	const { mutateAsync: close, isPending: closing } = useCloseCaseMutation()
	const signDownload = useSignDownloadLazy()

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

	async function handleDownload(attachmentId: string, filename: string) {
		try {
			const result = await signDownload(caseRef, attachmentId)
			const a = document.createElement("a")
			a.href = result.url
			a.download = filename
			a.click()
		} catch {
			toast.error("Failed to get download link")
		}
	}

	const internalNotes = (detail?.events ?? []).filter(
		(e: CaseEvent) => e.visibility === "internal"
	)

	const containerClass =
		mode === "full"
			? "flex flex-col gap-6"
			: "border-border bg-background flex h-full flex-col gap-4 overflow-y-auto rounded-lg border p-4"

	if (isLoading) {
		return (
			<div className={containerClass}>
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
			</div>
		)
	}

	if (!detail) {
		return (
			<div className={containerClass}>
				<p className="text-muted-foreground text-sm">Case not found</p>
			</div>
		)
	}

	return (
		<div className={containerClass}>
			{/* Header */}
			<div className="flex items-start justify-between gap-2">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<h2 className="font-mono text-sm font-semibold">{detail.caseRef}</h2>
						<Badge variant="outline">{detail.status.replace(/_/g, " ")}</Badge>
						<Badge variant="secondary">{detail.priority}</Badge>
					</div>
					<p className="text-muted-foreground text-xs">{detail.caseType}</p>
				</div>
				<div className="flex items-center gap-1">
					<PopOutToggle caseRef={caseRef} />
					{onClose && (
						<Button variant="ghost" size="icon-sm" onClick={onClose}>
							<span className="sr-only">Close</span>
							&times;
						</Button>
					)}
				</div>
			</div>

			{/* Patient info */}
			<section className="flex flex-col gap-1">
				<h3 className="text-xs font-semibold uppercase tracking-wider opacity-60">Patient</h3>
				<p className="font-mono text-sm">{detail.patientId}</p>
			</section>

			{/* Payload */}
			{detail.payload && (
				<section className="flex flex-col gap-1">
					<h3 className="text-xs font-semibold uppercase tracking-wider opacity-60">
						Visit Details
					</h3>
					<pre className="bg-muted overflow-x-auto rounded p-2 text-xs">
						{JSON.stringify(detail.payload, null, 2)}
					</pre>
				</section>
			)}

			{/* Attachments */}
			{detail.attachments.length > 0 && (
				<section className="flex flex-col gap-2">
					<h3 className="text-xs font-semibold uppercase tracking-wider opacity-60">
						Attachments ({detail.attachments.length})
					</h3>
					{detail.attachments.map(att => (
						<div key={att.id} className="flex items-center justify-between gap-2">
							<div className="flex min-w-0 flex-col">
								<span className="truncate text-sm">{att.originalFilename}</span>
								<span className="text-muted-foreground text-xs">
									{att.kind} &middot; {Math.round(att.sizeBytes / 1024)} KB
								</span>
							</div>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => handleDownload(att.id, att.originalFilename)}
								title="Download"
							>
								<Download />
							</Button>
						</div>
					))}
				</section>
			)}

			{/* Internal notes */}
			<section className="flex flex-col gap-2">
				<h3 className="text-xs font-semibold uppercase tracking-wider opacity-60">
					Internal Notes ({internalNotes.length})
				</h3>
				{internalNotes.length === 0 && (
					<p className="text-muted-foreground text-xs">No internal notes yet</p>
				)}
				{internalNotes.map((e: CaseEvent) => (
					<div key={e.id} className="bg-muted flex flex-col gap-1 rounded p-2">
						<p className="text-xs">
							{(e.payload as { text?: string } | null)?.text ?? JSON.stringify(e.payload)}
						</p>
						<span className="text-muted-foreground text-xs">
							{new Date(e.createdAt).toLocaleString()}
						</span>
					</div>
				))}
				<InternalNoteForm caseRef={caseRef} />
			</section>

			{/* Action bar */}
			<div className="mt-auto flex flex-wrap gap-2 border-t pt-4">
				{(detail.status === "submitted" || detail.status === "in_review") && (
					<Button size="sm" disabled={approving} onClick={handleApprove}>
						{approving ? "Approving…" : "Approve"}
					</Button>
				)}
				{(detail.status === "submitted" || detail.status === "in_review") && (
					<RejectDialog caseRef={caseRef} />
				)}
				{detail.status === "approved" && (
					<Button variant="outline" size="sm" disabled={closing} onClick={handleClose}>
						{closing ? "Closing…" : "Close"}
					</Button>
				)}
				<AssignPopover caseRef={caseRef} />
			</div>
		</div>
	)
}
