"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import {
	Dialog,
	DialogContent,
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
import { useCaseEscalateMutation } from "@/features/supervisor-cases/api/supervisor-escalation.hooks"

interface Props {
	caseRef: string
	trigger: React.ReactElement
}

export function EscalateCaseModal({ caseRef, trigger }: Props) {
	const [open, setOpen] = useState(false)
	const [level, setLevel] = useState("senior_coordinator")
	const [reasonCategory, setReasonCategory] = useState("quality_concern")
	const [notes, setNotes] = useState("")
	const escalate = useCaseEscalateMutation()

	async function handleSubmit() {
		if (notes.trim().length < 10) return
		try {
			await escalate.mutateAsync({ ref: caseRef, escalationLevel: level as "senior_coordinator" | "department_head" | "incident_management", reasonCategory, notes: notes.trim() })
			toast.success("Case escalated")
			setOpen(false)
			setNotes("")
		} catch (err) {
			toast.error("Escalation failed", { description: (err as Error).message })
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={trigger} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Escalate {caseRef}</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-1.5">
						<Label>Escalation level</Label>
						<Select value={level} onValueChange={v => v && setLevel(v)}>
							<SelectTrigger><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="senior_coordinator">Senior Coordinator</SelectItem>
								<SelectItem value="department_head">Department Head</SelectItem>
								<SelectItem value="incident_management">Incident Management</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label>Reason category</Label>
						<Select value={reasonCategory} onValueChange={v => v && setReasonCategory(v)}>
							<SelectTrigger><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="quality_concern">Quality Concern</SelectItem>
								<SelectItem value="patient_safety">Patient Safety</SelectItem>
								<SelectItem value="regulatory">Regulatory</SelectItem>
								<SelectItem value="operational_delay">Operational Delay</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label>Detailed notes</Label>
						<Textarea
							value={notes}
							onChange={e => setNotes(e.target.value)}
							rows={4}
							placeholder="Describe the escalation reason (min 10 characters)…"
							maxLength={2000}
						/>
						<span className="text-muted-foreground text-[10px]">{notes.length}/2000</span>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={escalate.isPending}>Cancel</Button>
					<Button size="sm" onClick={handleSubmit} disabled={notes.trim().length < 10 || escalate.isPending}>
						{escalate.isPending ? "Escalating…" : "Escalate"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
