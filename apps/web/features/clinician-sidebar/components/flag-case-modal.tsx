"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { FlagType } from "@repo/contracts"

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
import { useFlagCaseMutation } from "@/features/clinician-sidebar/api/sidebar.hooks"

const FLAG_OPTIONS: Array<{ value: FlagType; label: string }> = [
	{ value: "urgent_review", label: "Urgent Review" },
	{ value: "medication_query", label: "Medication Query" },
	{ value: "follow_up_required", label: "Follow-up Required" },
	{ value: "safety_concern", label: "Safety Concern" },
]

export function FlagCaseModal({
	caseRef,
	trigger,
}: {
	caseRef: string
	trigger: React.ReactNode
}) {
	const [open, setOpen] = useState(false)
	const [flagType, setFlagType] = useState<FlagType>("urgent_review")
	const [reason, setReason] = useState("")
	const { mutate, isPending } = useFlagCaseMutation()

	function handleSave() {
		if (reason.trim().length === 0) return
		mutate(
			{ caseRef, flagType, reason: reason.trim() },
			{
				onSuccess: () => {
					toast.success("Case flagged", { description: "The assigned agent will be notified." })
					setReason("")
					setFlagType("urgent_review")
					setOpen(false)
				},
				onError: err => {
					toast.error("Could not flag case", { description: (err as Error).message })
				},
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={trigger as React.ReactElement} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Flag case {caseRef}</DialogTitle>
					<DialogDescription>
						Flags appear on the Case Detail and Case Queue, and notify the assigned agent.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="flag-type">Flag type</Label>
						<Select value={flagType} onValueChange={v => setFlagType(v as FlagType)}>
							<SelectTrigger id="flag-type">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{FLAG_OPTIONS.map(opt => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="flag-reason">Reason</Label>
						<Textarea
							id="flag-reason"
							value={reason}
							onChange={e => setReason(e.target.value)}
							placeholder="What should the case agent know?"
							rows={4}
							maxLength={500}
						/>
						<span className="text-muted-foreground text-[10px]">{reason.length}/500</span>
					</div>
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setOpen(false)}
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={handleSave}
						disabled={reason.trim().length === 0 || isPending}
					>
						{isPending ? "Flagging…" : "Flag case"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
