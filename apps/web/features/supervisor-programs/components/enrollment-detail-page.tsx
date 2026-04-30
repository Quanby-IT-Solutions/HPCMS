"use client"

import { useState } from "react"
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
import { Skeleton } from "@/core/components/ui/skeleton"
import { Textarea } from "@/core/components/ui/textarea"
import { useEnrollmentDetailQuery, useEnrollmentUpdateMutation } from "@/features/supervisor-programs/api/supervisor-programs.hooks"

const STATUS_STYLES: Record<string, string> = {
	active: "bg-green-100 text-green-700",
	suspended: "bg-yellow-100 text-yellow-700",
	completed: "bg-blue-100 text-blue-700",
	withdrawn: "bg-slate-100 text-slate-600",
}

interface Props {
	enrollmentId: string
}

export function EnrollmentDetailPage({ enrollmentId }: Props) {
	const { data, isLoading } = useEnrollmentDetailQuery(enrollmentId)
	const update = useEnrollmentUpdateMutation()

	const [newStatus, setNewStatus] = useState("")
	const [reason, setReason] = useState("")
	const [endDate, setEndDate] = useState("")

	async function handleUpdate() {
		if (!newStatus || !reason.trim()) return
		try {
			await update.mutateAsync({
				enrollmentId,
				status: newStatus as "active" | "suspended" | "completed" | "withdrawn",
				reason: reason.trim(),
				endDate: endDate || undefined,
			})
			toast.success("Enrollment updated")
			setNewStatus("")
			setReason("")
			setEndDate("")
		} catch (err) {
			toast.error("Update failed", { description: (err as Error).message })
		}
	}

	if (isLoading || !data) {
		return <div className="flex flex-col gap-3"><Skeleton className="h-8 w-48" /><Skeleton className="h-32 w-full" /></div>
	}

	return (
		<div className="flex flex-col gap-4 max-w-xl">
			<header>
				<div className="flex items-center gap-2">
					<h1 className="text-2xl font-bold">{data.programName}</h1>
					<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[data.status]}`}>
						{data.status}
					</span>
				</div>
				<p className="text-muted-foreground text-sm">{data.patientName} · Enrolled {data.startDate ? new Date(data.startDate).toLocaleDateString() : "—"}</p>
			</header>

			<div className="rounded-md border p-4 flex flex-col gap-3">
				<h3 className="font-semibold text-sm">Update Status</h3>
				<div className="flex flex-col gap-1.5">
					<Label>New status</Label>
					<Select value={newStatus} onValueChange={v => setNewStatus(v ?? "")}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							<SelectItem value="active">Active</SelectItem>
							<SelectItem value="suspended">Suspended</SelectItem>
							<SelectItem value="completed">Completed</SelectItem>
							<SelectItem value="withdrawn">Withdrawn</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label>Reason</Label>
					<Textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} />
				</div>
				<div className="flex flex-col gap-1.5">
					<Label>End date (optional)</Label>
					<Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-8 text-sm" />
				</div>
				<Button size="sm" onClick={handleUpdate} disabled={!newStatus || !reason.trim() || update.isPending}>
					{update.isPending ? "Saving…" : "Save"}
				</Button>
			</div>

			{data.statusHistory.length > 0 ? (
				<div className="rounded-md border p-4">
					<h3 className="font-semibold text-sm mb-2">History</h3>
					{data.statusHistory.map(h => (
						<div key={h.id} className="py-1.5 text-xs border-b last:border-0">
							<div className="flex items-center justify-between">
								<span className={`inline-flex items-center rounded-full px-1.5 py-0.5 ${STATUS_STYLES[h.status]}`}>{h.status}</span>
								<span className="text-muted-foreground">{h.updatedBy} · {new Date(h.updatedAt).toLocaleDateString()}</span>
							</div>
							{h.reason ? <p className="mt-0.5 text-muted-foreground">{h.reason}</p> : null}
						</div>
					))}
				</div>
			) : null}
		</div>
	)
}
