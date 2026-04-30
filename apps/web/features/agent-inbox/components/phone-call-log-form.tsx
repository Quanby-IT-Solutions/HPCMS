"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Textarea } from "@/core/components/ui/textarea"
import { orpc } from "@/services/orpc/client"

const REASONS = [
	{ value: "loa_inquiry", label: "LOA inquiry" },
	{ value: "appointment", label: "Appointment" },
	{ value: "medication_query", label: "Medication query" },
	{ value: "billing", label: "Billing" },
	{ value: "complaint", label: "Complaint" },
	{ value: "other", label: "Other" },
]

interface Props {
	defaultPatientId?: string | null
}

export function PhoneCallLogForm({ defaultPatientId = null }: Props) {
	const router = useRouter()
	const queryClient = useQueryClient()
	const [direction, setDirection] = useState<"inbound" | "outbound">("inbound")
	const [patientId, setPatientId] = useState<string | null>(defaultPatientId)
	const [patientNameFreeform, setPatientNameFreeform] = useState("")
	const [calledAt, setCalledAt] = useState(new Date().toISOString().slice(0, 16))
	const [duration, setDuration] = useState("5")
	const [reason, setReason] = useState("loa_inquiry")
	const [summary, setSummary] = useState("")
	const [caseRef, setCaseRef] = useState("")

	const { mutate, isPending } = useMutation(
		orpc.channels.phone.log.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.inbox.list.key() })
				queryClient.invalidateQueries({ queryKey: orpc.patient.timeline.list.key() })
			},
		})
	)

	const errors = {
		summary: summary.trim().length === 0,
		patient: !patientId && patientNameFreeform.trim().length === 0,
		duration: !duration || Number(duration) <= 0,
	}
	const canSubmit = !errors.summary && !errors.patient && !errors.duration

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!canSubmit) {
			toast.error("Fill required fields", {
				description: "Patient (ID or name), duration, and summary are required.",
			})
			return
		}
		mutate(
			{
				direction,
				patientId,
				patientNameFreeform: patientNameFreeform.trim() || null,
				calledAt: new Date(calledAt).toISOString(),
				durationSeconds: Math.max(1, Math.round(Number(duration) * 60)),
				reasonCategory: reason as "loa_inquiry",
				summary: summary.trim(),
				caseRef: caseRef.trim() || null,
			},
			{
				onSuccess: () => {
					toast.success("Phone call logged")
					router.push("/agent/inbox")
				},
				onError: err => {
					toast.error("Could not log call", { description: (err as Error).message })
				},
			}
		)
	}

	return (
		<form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-3">
			<div className="grid gap-3 sm:grid-cols-2">
				<div className="flex flex-col gap-1">
					<Label htmlFor="direction">Direction</Label>
					<Select
						value={direction}
						onValueChange={v => setDirection(v as "inbound" | "outbound")}
					>
						<SelectTrigger id="direction">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="inbound">Inbound</SelectItem>
							<SelectItem value="outbound">Outbound</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="reason">Reason category</Label>
					<Select value={reason} onValueChange={v => setReason(v ?? "loa_inquiry")}>
						<SelectTrigger id="reason">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{REASONS.map(r => (
								<SelectItem key={r.value} value={r.value}>
									{r.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="patient-id">
						Patient ID <span className="text-muted-foreground">(or use freeform name)</span>
					</Label>
					<Input
						id="patient-id"
						value={patientId ?? ""}
						onChange={e => setPatientId(e.target.value || null)}
						placeholder="patient-uuid"
						aria-invalid={errors.patient}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="patient-freeform">
						Caller name{" "}
						<span className="text-muted-foreground">(free text, used if no ID)</span>
					</Label>
					<Input
						id="patient-freeform"
						value={patientNameFreeform}
						onChange={e => setPatientNameFreeform(e.target.value)}
						placeholder="Patient or caller name"
						aria-invalid={errors.patient}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="called-at">Called at</Label>
					<Input
						id="called-at"
						type="datetime-local"
						value={calledAt}
						onChange={e => setCalledAt(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="duration">Duration (minutes)</Label>
					<Input
						id="duration"
						type="number"
						min={1}
						value={duration}
						onChange={e => setDuration(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-1 sm:col-span-2">
					<Label htmlFor="case-ref">
						Link to case (or leave blank to create new)
					</Label>
					<Input
						id="case-ref"
						value={caseRef}
						onChange={e => setCaseRef(e.target.value)}
						placeholder="LOA-2026-00128"
					/>
					<p className="text-muted-foreground text-[10px]">
						Empty value triggers a new case via the patient&apos;s linked workflow on
						submit (CA-BE-06).
					</p>
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<Label htmlFor="summary">Summary</Label>
				<Textarea
					id="summary"
					rows={5}
					value={summary}
					onChange={e => setSummary(e.target.value)}
					maxLength={2000}
					placeholder="What did the patient need? What was the resolution?"
				/>
			</div>
			<div className="flex items-center justify-between">
				{!canSubmit ? (
					<p className="text-muted-foreground text-[10px]">
						Required: patient (ID or name), duration ≥ 1 minute, summary.
					</p>
				) : (
					<span />
				)}
				<Button type="submit" disabled={!canSubmit || isPending}>
					{isPending ? "Logging…" : "Log call"}
				</Button>
			</div>
		</form>
	)
}
