"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/core/components/ui/dialog"
import { Textarea } from "@/core/components/ui/textarea"
import { useRejectCaseMutation } from "../api/cases.hooks"

interface RejectDialogProps {
	caseRef: string
}

export function RejectDialog({ caseRef }: RejectDialogProps) {
	const [open, setOpen] = useState(false)
	const [reason, setReason] = useState("")
	const { mutateAsync: reject, isPending } = useRejectCaseMutation()

	async function handleReject() {
		if (!reason.trim()) return
		try {
			await reject({ ref: caseRef, reason: reason.trim() })
			toast.success("Case rejected")
			setOpen(false)
			setReason("")
		} catch {
			toast.error("Failed to reject case")
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button variant="destructive" size="sm" />}>Reject</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Reject Case</DialogTitle>
				</DialogHeader>
				<Textarea
					placeholder="Rejection reason (required)"
					value={reason}
					onChange={e => setReason(e.target.value)}
					className="min-h-24"
				/>
				<DialogFooter>
					<DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
					<Button
						variant="destructive"
						disabled={!reason.trim() || isPending}
						onClick={handleReject}
					>
						{isPending ? "Rejecting…" : "Confirm Reject"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
