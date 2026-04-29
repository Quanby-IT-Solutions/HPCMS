"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/core/components/ui/dialog"

import { useWithdrawCaseMutation } from "../api/cases.hooks"

interface WithdrawConfirmDialogProps {
	open: boolean
	caseRef: string
	onClose: () => void
}

export function WithdrawConfirmDialog({ open, caseRef, onClose }: WithdrawConfirmDialogProps) {
	const { mutateAsync: withdraw } = useWithdrawCaseMutation()
	const [pending, setPending] = useState(false)

	async function handleWithdraw() {
		setPending(true)
		try {
			await withdraw({ ref: caseRef })
			toast.success("Request withdrawn successfully.")
			onClose()
		} catch {
			toast.error("Failed to withdraw request. Please try again.")
		} finally {
			setPending(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={open => !open && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Withdraw Request</DialogTitle>
					<DialogDescription>
						Are you sure you want to withdraw case <span className="font-semibold">{caseRef}</span>?
						This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={pending}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={handleWithdraw} disabled={pending}>
						{pending ? "Withdrawing..." : "Withdraw"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
