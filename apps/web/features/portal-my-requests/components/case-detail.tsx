"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Download, Loader2 } from "@/core/components/icons"

import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/alert"
import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Skeleton } from "@/core/components/ui/skeleton"
import type { CaseAttachment, CaseEvent, CaseStatus } from "@repo/contracts"

import Link from "next/link"

import { useCaseQuery, useSignDownloadQuery } from "../api/cases.hooks"
import { StatusStepper } from "./status-stepper"
import { WithdrawConfirmDialog } from "./withdraw-confirm-dialog"

const STATUS_BADGE: Record<CaseStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
	submitted: { label: "Submitted", variant: "default" },
	in_review: { label: "In Review", variant: "secondary" },
	approved: { label: "Approved", variant: "default" },
	rejected: { label: "Rejected", variant: "destructive" },
	closed: { label: "Closed", variant: "outline" },
	withdrawn: { label: "Withdrawn", variant: "outline" },
}

const EVENT_LABELS: Record<string, string> = {
	submitted: "Request submitted",
	claimed: "Review started",
	assigned: "Assigned to staff",
	approved: "Request approved",
	rejected: "Request rejected",
	closed: "Case closed",
	withdrawn: "Request withdrawn",
	note_added: "Note added",
}

function AttachmentRow({ caseRef, attachment }: { caseRef: string; attachment: CaseAttachment }) {
	const { data, isFetching } = useSignDownloadQuery(caseRef, attachment.id)

	return (
		<div className="flex items-center justify-between gap-3 rounded-md border p-3">
			<div className="min-w-0">
				<p className="truncate text-sm font-medium">{attachment.originalFilename}</p>
				<p className="text-muted-foreground text-xs capitalize">
					{attachment.kind.replace(/_/g, " ")}
				</p>
			</div>
			<Button
				variant="outline"
				size="sm"
				disabled={isFetching || !data?.url}
				onClick={() => data?.url && window.open(data.url, "_blank")}
			>
				{isFetching ? (
					<Loader2 className="size-4 animate-spin" />
				) : (
					<>
						<Download className="mr-1 size-4" />
						Download
					</>
				)}
			</Button>
		</div>
	)
}

function extractNoteBody(payload: unknown): string | null {
	if (payload && typeof payload === "object") {
		const p = payload as Record<string, unknown>
		const candidates = [p.note, p.body, p.message, p.comment]
		for (const c of candidates) {
			if (typeof c === "string" && c.trim().length > 0) return c
		}
	}
	return null
}

function EventTimeline({ events }: { events: CaseEvent[] }) {
	const patientEvents = events.filter(e => e.visibility === "patient")

	if (!patientEvents.length) {
		return <p className="text-muted-foreground text-sm">No timeline events yet.</p>
	}

	return (
		<ol className="relative border-l">
			{patientEvents.map(event => {
				const noteBody = extractNoteBody(event.payload)
				return (
					<li key={event.id} className="mb-6 ml-4">
						<div className="bg-primary absolute -left-1.5 mt-1.5 size-3 rounded-full border" />
						<p className="text-sm font-medium">
							{EVENT_LABELS[event.eventType] ?? event.eventType.replace(/_/g, " ")}
						</p>
						<p className="text-muted-foreground text-xs">
							{new Date(event.createdAt).toLocaleString()}
						</p>
						{noteBody ? (
							<p className="bg-muted/30 mt-2 whitespace-pre-wrap rounded-md p-2 text-xs">
								{noteBody}
							</p>
						) : null}
					</li>
				)
			})}
		</ol>
	)
}

interface CaseDetailProps {
	caseRef: string
}

export function CaseDetail({ caseRef }: CaseDetailProps) {
	const router = useRouter()
	const { data, isLoading, isError } = useCaseQuery(caseRef)
	const [showWithdraw, setShowWithdraw] = useState(false)

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
			</div>
		)
	}

	if (isError || !data) {
		router.replace("/not-found")
		return null
	}

	const badge = STATUS_BADGE[data.status]
	const canWithdraw = data.status === "submitted" || data.status === "in_review"

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="text-2xl font-bold">{data.caseRef}</h1>
					<p className="text-muted-foreground text-sm">
						Submitted {new Date(data.submittedAt).toLocaleDateString()}
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Badge variant={badge.variant}>{badge.label}</Badge>
					{canWithdraw && (
						<Button variant="outline" onClick={() => setShowWithdraw(true)}>
							Withdraw
						</Button>
					)}
				</div>
			</div>

			{data.status === "rejected" && data.rejectionReason && (
				<Alert variant="destructive">
					<AlertCircle className="size-4" />
					<AlertTitle>Request Rejected</AlertTitle>
					<AlertDescription>{data.rejectionReason}</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Status</CardTitle>
				</CardHeader>
				<CardContent>
					<StatusStepper status={data.status} />
				</CardContent>
			</Card>

			{data.payload && typeof data.payload === "object" ? (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Submitted details</CardTitle>
					</CardHeader>
					<CardContent>
						<dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
							{Object.entries(data.payload as Record<string, unknown>).map(([k, v]) => {
								const value =
									v === null || v === undefined
										? "—"
										: typeof v === "string" || typeof v === "number"
											? String(v)
											: JSON.stringify(v)
								return (
									<div key={k} className="flex flex-col gap-0.5">
										<dt className="text-muted-foreground text-[11px] uppercase tracking-wider">
											{k.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase())}
										</dt>
										<dd className="font-medium">{value}</dd>
									</div>
								)
							})}
						</dl>
					</CardContent>
				</Card>
			) : null}

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Need to send more info?</CardTitle>
				</CardHeader>
				<CardContent className="text-muted-foreground flex items-center justify-between gap-4 text-sm">
					<span>
						Reply directly to the team if they&apos;ve asked for additional documents or
						clarifications.
					</span>
					<Link
						href={`/portal/chat?case=${data.caseRef}`}
						className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex shrink-0 items-center rounded-md px-3 py-1.5 text-xs font-medium"
					>
						Reply to team
					</Link>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Timeline</CardTitle>
				</CardHeader>
				<CardContent>
					<EventTimeline events={data.events} />
				</CardContent>
			</Card>

			{data.attachments.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Attachments</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						{data.attachments.map(att => (
							<AttachmentRow key={att.id} caseRef={data.caseRef} attachment={att} />
						))}
					</CardContent>
				</Card>
			)}

			<WithdrawConfirmDialog
				open={showWithdraw}
				caseRef={data.caseRef}
				onClose={() => setShowWithdraw(false)}
			/>
		</div>
	)
}
