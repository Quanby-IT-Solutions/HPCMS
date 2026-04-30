"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { ClaimHeader, ClaimStatus } from "@repo/contracts"

import { AlertTriangle } from "@/core/components/icons"
import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/alert"
import { Button } from "@/core/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/core/components/ui/dialog"
import { Label } from "@/core/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Textarea } from "@/core/components/ui/textarea"
import { useUpdateClaimStatusMutation } from "@/features/agent-claims/api/claims.hooks"

const STATUS_FLOW: Record<ClaimStatus, ClaimStatus[]> = {
	draft: ["submitted"],
	submitted: ["under_review", "rejected"],
	under_review: ["approved", "rejected"],
	approved: ["paid"],
	rejected: ["appealed"],
	appealed: ["under_review", "approved", "rejected"],
	paid: [],
}

const LABELS: Record<ClaimStatus, string> = {
	draft: "Draft",
	submitted: "Submitted",
	under_review: "Under review",
	approved: "Approved",
	rejected: "Rejected",
	appealed: "Appealed",
	paid: "Paid",
}

interface Props {
	header: ClaimHeader
}

export function ClaimStatusUpdateModal({ header }: Props) {
	const [open, setOpen] = useState(false)
	const allowedNext = STATUS_FLOW[header.status]
	const [next, setNext] = useState<ClaimStatus | "">(allowedNext[0] ?? "")
	const [note, setNote] = useState("")
	const update = useUpdateClaimStatusMutation()

	const isRejected = header.status === "rejected"

	function handleSubmit() {
		if (!next) return
		update.mutate(
			{ claimId: header.id, nextStatus: next as ClaimStatus, note: note.trim() || undefined },
			{
				onSuccess: () => {
					toast.success(`Claim moved to ${LABELS[next as ClaimStatus]}`)
					setOpen(false)
					setNote("")
				},
				onError: err =>
					toast.error("Could not update status", { description: (err as Error).message }),
			}
		)
	}

	function initiateAppeal() {
		update.mutate(
			{ claimId: header.id, nextStatus: "appealed", note: note.trim() || "Appeal initiated" },
			{
				onSuccess: () => {
					toast.success("Appeal initiated")
					setOpen(false)
					setNote("")
				},
				onError: err =>
					toast.error("Could not initiate appeal", { description: (err as Error).message }),
			}
		)
	}

	if (allowedNext.length === 0 && !isRejected) {
		return (
			<Button variant="outline" size="sm" disabled>
				Status: {LABELS[header.status]}
			</Button>
		)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button size="sm" variant={isRejected ? "destructive" : "default"}>
						{isRejected ? "Initiate appeal…" : "Update status"}
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update {header.id}</DialogTitle>
					<DialogDescription>
						Current status: <span className="font-medium">{LABELS[header.status]}</span>.
						Status changes are recorded on the claim history with the note as the
						payer-reference / rejection-reason / payment-receipt.
					</DialogDescription>
				</DialogHeader>

				{isRejected ? (
					<Alert variant="destructive">
						<AlertTitle className="flex items-center gap-2">
							<AlertTriangle className="size-4" />
							Claim was rejected
						</AlertTitle>
						<AlertDescription>
							Initiate an appeal to send this claim back for review. Document the
							rejection code and supporting context in the note below.
						</AlertDescription>
					</Alert>
				) : (
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="next-status">Next status</Label>
						<Select
							value={next}
							onValueChange={v => v && setNext(v as ClaimStatus)}
						>
							<SelectTrigger id="next-status">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{allowedNext.map(s => (
									<SelectItem key={s} value={s}>
										{LABELS[s]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="status-note">Note (payer ref / rejection code / receipt)</Label>
					<Textarea
						id="status-note"
						value={note}
						onChange={e => setNote(e.target.value)}
						rows={4}
						maxLength={2000}
						placeholder={
							isRejected
								? "Why are you appealing? Reference the rejection code."
								: "Optional payer reference or notes."
						}
					/>
				</div>

				<DialogFooter>
					<Button variant="outline" size="sm" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					{isRejected ? (
						<Button
							size="sm"
							variant="destructive"
							onClick={initiateAppeal}
							disabled={update.isPending}
						>
							{update.isPending ? "Submitting…" : "Initiate appeal"}
						</Button>
					) : (
						<Button
							size="sm"
							onClick={handleSubmit}
							disabled={!next || update.isPending}
						>
							{update.isPending ? "Updating…" : "Apply"}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
