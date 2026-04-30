"use client"

import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
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
import {
	usePatientDevicesQuery,
	useSupervisorDeviceAssignMutation,
} from "@/features/supervisor-devices/api/supervisor-devices.hooks"
import { RightRailPanel } from "@/features/supervisor-workspace/components/right-rail-panel"

const STATUS_STYLES: Record<string, string> = {
	active: "bg-green-100 text-green-700",
	returned: "bg-slate-100 text-slate-600",
	lost: "bg-red-100 text-red-700",
	maintenance: "bg-yellow-100 text-yellow-700",
}

interface Props {
	patientId: string
}

export function AssignedDevicesPanel({ patientId }: Props) {
	const { data, isLoading } = usePatientDevicesQuery(patientId)
	const assign = useSupervisorDeviceAssignMutation()
	const [showForm, setShowForm] = useState(false)
	const [serialNumber, setSerialNumber] = useState("")
	const [deviceType, setDeviceType] = useState("")
	const [assignmentDate, setAssignmentDate] = useState("")
	const [initialStatus, setInitialStatus] = useState<"assigned" | "in_use">("assigned")
	const [caseRef, setCaseRef] = useState("")

	const devices = data?.devices ?? []

	async function handleAssign() {
		if (!serialNumber.trim() || !deviceType.trim() || !assignmentDate) return
		try {
			await assign.mutateAsync({
				patientId,
				serialNumber: serialNumber.trim(),
				deviceType: deviceType.trim(),
				assignmentDate,
				initialStatus,
				caseRef: caseRef.trim() || undefined,
			})
			toast.success("Device assigned")
			setShowForm(false)
			setSerialNumber("")
			setDeviceType("")
			setAssignmentDate("")
			setInitialStatus("assigned")
			setCaseRef("")
		} catch (err) {
			toast.error("Failed", { description: (err as Error).message })
		}
	}

	return (
		<RightRailPanel
			title="Devices"
			storageKey={`devices-${patientId}`}
			actions={
				<Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setShowForm(v => !v)}>
					{showForm ? "Cancel" : "+ Assign"}
				</Button>
			}
		>
			{isLoading ? (
				<Skeleton className="h-8 w-full" />
			) : (
				<div className="flex flex-col gap-1">
					{devices.map(d => (
						<div key={d.id} className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium">{d.deviceType}</p>
								<p className="text-[11px] text-muted-foreground">
									{d.serialNumber ?? "—"}
									{" · "}
									<span className={`inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium ${STATUS_STYLES[d.status] ?? "bg-slate-100 text-slate-600"}`}>
										{d.status}
									</span>
									{d.assignedAt ? ` · ${new Date(d.assignedAt).toLocaleDateString()}` : null}
								</p>
							</div>
							<Link href={SUPERVISOR_ROUTES.deviceDetail(d.id)} className="text-xs text-primary hover:underline">
								View
							</Link>
						</div>
					))}
					{devices.length === 0 && (
						<p className="text-xs text-muted-foreground">No assigned devices.</p>
					)}
				</div>
			)}
			{showForm && (
				<div className="flex flex-col gap-2 mt-2 pt-2 border-t">
					<div className="flex flex-col gap-1">
						<Label className="text-xs">Serial number *</Label>
						<Input
							value={serialNumber}
							onChange={e => setSerialNumber(e.target.value)}
							placeholder="SN-2026-001"
							className="h-7 text-xs"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label className="text-xs">Device type *</Label>
						<Input
							value={deviceType}
							onChange={e => setDeviceType(e.target.value)}
							placeholder="Pulse Oximeter"
							className="h-7 text-xs"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label className="text-xs">Assignment date *</Label>
						<Input
							type="date"
							value={assignmentDate}
							onChange={e => setAssignmentDate(e.target.value)}
							className="h-7 text-xs"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label className="text-xs">Initial status</Label>
						<Select value={initialStatus} onValueChange={v => setInitialStatus(v as "assigned" | "in_use")}>
							<SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="assigned">Assigned</SelectItem>
								<SelectItem value="in_use">In use</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1">
						<Label className="text-xs">Linked case ref</Label>
						<Input
							value={caseRef}
							onChange={e => setCaseRef(e.target.value)}
							placeholder="CASE-001 (optional)"
							className="h-7 text-xs"
						/>
					</div>
					<Button
						size="sm"
						className="h-7 text-xs w-fit"
						onClick={handleAssign}
						disabled={!serialNumber.trim() || !deviceType.trim() || !assignmentDate || assign.isPending}
					>
						{assign.isPending ? "Assigning…" : "Assign"}
					</Button>
				</div>
			)}
		</RightRailPanel>
	)
}
