"use client"

import type { CaseDetail, CaseEvent } from "@repo/contracts"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs"
import { Button } from "@/core/components/ui/button"
import { Download } from "@/core/components/icons"
import { useSignDownloadLazy } from "@/features/agent-case-detail/api/cases.hooks"
import { CaseCommunicationsTab } from "@/features/agent-case-detail/components/case-communications-tab"
import { CaseClaimsTab } from "@/features/agent-case-detail/components/case-claims-tab"
import { InternalNoteForm } from "@/features/agent-case-detail/components/internal-note-form"
import { PatientSummaryCard } from "@/features/agent-case-detail/components/patient-summary-card"

function AttachmentRow({
	caseRef,
	id,
	filename,
	kind,
	sizeBytes,
}: {
	caseRef: string
	id: string
	filename: string
	kind: string
	sizeBytes: number
}) {
	const signDownload = useSignDownloadLazy()
	async function download() {
		const result = await signDownload(caseRef, id)
		const a = document.createElement("a")
		a.href = result.url
		a.download = filename
		a.click()
	}
	return (
		<div className="flex items-center justify-between gap-2 rounded-md border p-2">
			<div className="flex min-w-0 flex-col">
				<span className="truncate text-sm">{filename}</span>
				<span className="text-muted-foreground text-xs">
					{kind} · {Math.round(sizeBytes / 1024)} KB
				</span>
			</div>
			<Button variant="ghost" size="icon-sm" onClick={download} title="Download">
				<Download />
			</Button>
		</div>
	)
}

export function CaseDetailTabs({ detail }: { detail: CaseDetail }) {
	const internalNotes = detail.events.filter((e: CaseEvent) => e.visibility === "internal")

	return (
		<Tabs defaultValue="overview" className="flex-1">
			<TabsList variant="line">
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="communications">Communications</TabsTrigger>
				<TabsTrigger value="notes">Notes</TabsTrigger>
				<TabsTrigger value="linked">Linked</TabsTrigger>
				<TabsTrigger value="claims">Claims</TabsTrigger>
				<TabsTrigger value="attachments">Attachments</TabsTrigger>
			</TabsList>

			<TabsContent value="overview" className="mt-4 flex flex-col gap-3">
				<PatientSummaryCard patientId={detail.patientId} />
				<dl className="grid grid-cols-2 gap-2">
					<div className="bg-muted/40 rounded-md p-2.5">
						<dt className="text-muted-foreground text-[10px] uppercase">Type</dt>
						<dd className="text-sm font-medium">{detail.caseType}</dd>
					</div>
					<div className="bg-muted/40 rounded-md p-2.5">
						<dt className="text-muted-foreground text-[10px] uppercase">Source</dt>
						<dd className="text-sm font-medium">{detail.sourceChannel ?? "—"}</dd>
					</div>
					<div className="bg-muted/40 rounded-md p-2.5">
						<dt className="text-muted-foreground text-[10px] uppercase">Submitted</dt>
						<dd className="text-sm">{new Date(detail.submittedAt).toLocaleString()}</dd>
					</div>
					<div className="bg-muted/40 rounded-md p-2.5">
						<dt className="text-muted-foreground text-[10px] uppercase">Status age</dt>
						<dd className="text-sm">
							{detail.inReviewAt
								? `In review since ${new Date(detail.inReviewAt).toLocaleDateString()}`
								: "Not yet claimed"}
						</dd>
					</div>
				</dl>
				{detail.payload ? (
					<div>
						<h3 className="text-muted-foreground mb-1 text-xs font-semibold uppercase tracking-wider">
							Visit details
						</h3>
						<pre className="bg-muted overflow-x-auto rounded p-2 text-xs">
							{JSON.stringify(detail.payload, null, 2)}
						</pre>
					</div>
				) : null}
			</TabsContent>

			<TabsContent value="communications" className="mt-4">
				<CaseCommunicationsTab caseRef={detail.caseRef} patientId={detail.patientId} />
			</TabsContent>

			<TabsContent value="notes" className="mt-4 flex flex-col gap-3">
				<div className="flex flex-col gap-2">
					{internalNotes.length === 0 ? (
						<p className="text-muted-foreground text-xs">No internal notes yet.</p>
					) : (
						internalNotes.map((e: CaseEvent) => {
							const payloadText =
								(e.payload as { text?: string } | null)?.text ??
								JSON.stringify(e.payload) ??
								""
							return (
								<div key={e.id} className="bg-muted/50 flex flex-col gap-1 rounded-md p-2">
									<p className="text-xs">{payloadText}</p>
									<span className="text-muted-foreground text-[10px]">
										{new Date(e.createdAt).toLocaleString()}
									</span>
								</div>
							)
						})
					)}
				</div>
				<InternalNoteForm caseRef={detail.caseRef} />
			</TabsContent>

			<TabsContent value="linked" className="mt-4">
				<p className="text-muted-foreground text-xs italic">
					Related cases (CA-FE-15 / SUP-FE-10). Stubbed for now.
				</p>
			</TabsContent>

			<TabsContent value="claims" className="mt-4">
				<CaseClaimsTab caseRef={detail.caseRef} />
			</TabsContent>

			<TabsContent value="attachments" className="mt-4 flex flex-col gap-2">
				{detail.attachments.length === 0 ? (
					<p className="text-muted-foreground text-xs">No attachments.</p>
				) : (
					detail.attachments.map(att => (
						<AttachmentRow
							key={att.id}
							caseRef={detail.caseRef}
							id={att.id}
							filename={att.originalFilename}
							kind={att.kind}
							sizeBytes={att.sizeBytes}
						/>
					))
				)}
			</TabsContent>
		</Tabs>
	)
}
