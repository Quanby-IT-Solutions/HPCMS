"use client"

import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	usePatientProgramsQuery,
	useSupervisorEnrollMutation,
} from "@/features/supervisor-programs/api/supervisor-programs.hooks"
import { RightRailPanel } from "@/features/supervisor-workspace/components/right-rail-panel"

interface Props {
	patientId: string
}

export function EnrolledProgramsPanel({ patientId }: Props) {
	const { data, isLoading } = usePatientProgramsQuery(patientId)
	const enroll = useSupervisorEnrollMutation()
	const [showForm, setShowForm] = useState(false)
	const [programId, setProgramId] = useState("")
	const [startDate, setStartDate] = useState("")
	const [coordinator, setCoordinator] = useState("")
	const [notes, setNotes] = useState("")

	const enrollments = data?.enrollments ?? []

	async function handleEnroll() {
		if (!programId.trim() || !startDate) return
		try {
			await enroll.mutateAsync({
				patientId,
				programId: programId.trim(),
				startDate,
				coordinatorUserId: coordinator.trim() || undefined,
				notes: notes.trim() || undefined,
			})
			toast.success("Enrolled in program")
			setShowForm(false)
			setProgramId("")
			setStartDate("")
			setCoordinator("")
			setNotes("")
		} catch (err) {
			toast.error("Failed", { description: (err as Error).message })
		}
	}

	return (
		<RightRailPanel
			title="Programs"
			storageKey={`programs-${patientId}`}
			actions={
				<Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setShowForm(v => !v)}>
					{showForm ? "Cancel" : "+ Enroll"}
				</Button>
			}
		>
			{isLoading ? (
				<Skeleton className="h-8 w-full" />
			) : (
				<div className="flex flex-col gap-1">
					{enrollments.map(e => (
						<div key={e.id} className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium">{e.programName}</p>
								<p className="text-[11px] text-muted-foreground">
									{e.status}
									{e.enrolledAt ? ` · ${new Date(e.enrolledAt).toLocaleDateString()}` : null}
									{e.coordinatorName ? ` · ${e.coordinatorName}` : null}
								</p>
							</div>
							<Link href={SUPERVISOR_ROUTES.enrollmentDetail(e.id)} className="text-xs text-primary hover:underline">
								View
							</Link>
						</div>
					))}
					{enrollments.length === 0 && (
						<p className="text-xs text-muted-foreground">No enrollments.</p>
					)}
				</div>
			)}
			{showForm && (
				<div className="flex flex-col gap-2 mt-2 pt-2 border-t">
					<div className="flex flex-col gap-1">
						<Label className="text-xs">Program ID *</Label>
						<Input
							value={programId}
							onChange={e => setProgramId(e.target.value)}
							placeholder="prog-diabetes-mgmt"
							className="h-7 text-xs"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label className="text-xs">Start date *</Label>
						<Input
							type="date"
							value={startDate}
							onChange={e => setStartDate(e.target.value)}
							className="h-7 text-xs"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label className="text-xs">Coordinator user ID</Label>
						<Input
							value={coordinator}
							onChange={e => setCoordinator(e.target.value)}
							placeholder="Optional coordinator…"
							className="h-7 text-xs"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label className="text-xs">Notes</Label>
						<Input
							value={notes}
							onChange={e => setNotes(e.target.value)}
							placeholder="Optional notes…"
							className="h-7 text-xs"
						/>
					</div>
					<Button
						size="sm"
						className="h-7 text-xs w-fit"
						onClick={handleEnroll}
						disabled={!programId.trim() || !startDate || enroll.isPending}
					>
						{enroll.isPending ? "Enrolling…" : "Enroll"}
					</Button>
				</div>
			)}
		</RightRailPanel>
	)
}
