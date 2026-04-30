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
import {
	useDeviceDetailQuery,
	useDeviceMaintenanceAddMutation,
	useDeviceStatusUpdateMutation,
} from "@/features/supervisor-devices/api/supervisor-devices.hooks"

const STATUS_STYLES: Record<string, string> = {
	assigned: "bg-blue-100 text-blue-700",
	in_use: "bg-green-100 text-green-700",
	returned: "bg-slate-100 text-slate-600",
	decommissioned: "bg-red-100 text-red-700",
	under_maintenance: "bg-yellow-100 text-yellow-700",
}

interface Props {
	deviceId: string
}

export function DeviceDetailPage({ deviceId }: Props) {
	const { data, isLoading } = useDeviceDetailQuery(deviceId)
	const updateStatus = useDeviceStatusUpdateMutation()
	const addMaintenance = useDeviceMaintenanceAddMutation()

	const [newStatus, setNewStatus] = useState("")
	const [maintDate, setMaintDate] = useState("")
	const [maintType, setMaintType] = useState("routine")
	const [maintTech, setMaintTech] = useState("")
	const [maintNotes, setMaintNotes] = useState("")

	if (isLoading || !data) {
		return <div className="flex flex-col gap-3"><Skeleton className="h-8 w-48" /><Skeleton className="h-32 w-full" /></div>
	}

	async function handleStatusUpdate() {
		if (!newStatus) return
		try {
			await updateStatus.mutateAsync({ deviceId, status: newStatus as "assigned" | "in_use" | "returned" | "decommissioned" | "under_maintenance" })
			toast.success("Status updated")
			setNewStatus("")
		} catch (err) {
			toast.error("Update failed", { description: (err as Error).message })
		}
	}

	async function handleAddMaintenance() {
		if (!maintDate || !maintTech) return
		try {
			await addMaintenance.mutateAsync({
				deviceId,
				date: maintDate,
				maintenanceType: maintType as "routine" | "repair" | "calibration" | "inspection",
				technician: maintTech,
				notes: maintNotes || undefined,
			})
			toast.success("Maintenance record added")
			setMaintDate("")
			setMaintTech("")
			setMaintNotes("")
		} catch (err) {
			toast.error("Failed", { description: (err as Error).message })
		}
	}

	return (
		<div className="flex flex-col gap-4 max-w-xl">
			<header>
				<div className="flex items-center gap-2">
					<h1 className="text-2xl font-bold">{data.deviceType}</h1>
					<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[data.status]}`}>
						{data.status.replace(/_/g, " ")}
					</span>
				</div>
				<p className="text-muted-foreground text-sm font-mono">{data.serialNumber}</p>
			</header>

			<div className="rounded-md border p-4">
				<h3 className="font-semibold text-sm mb-3">Assignment</h3>
				<div className="grid grid-cols-2 gap-y-2 text-sm">
					<span className="text-muted-foreground">Patient</span><span>{data.patientName ?? "—"}</span>
					<span className="text-muted-foreground">Assigned</span><span>{data.assignmentDate ? new Date(data.assignmentDate).toLocaleDateString() : "—"}</span>
					<span className="text-muted-foreground">Last service</span><span>{data.lastServiceDate ? new Date(data.lastServiceDate).toLocaleDateString() : "—"}</span>
				</div>
			</div>

			<div className="rounded-md border p-4 flex flex-col gap-3">
				<h3 className="font-semibold text-sm">Update Status</h3>
				<Select value={newStatus} onValueChange={v => setNewStatus(v ?? "")}>
					<SelectTrigger><SelectValue /></SelectTrigger>
					<SelectContent>
						<SelectItem value="assigned">Assigned</SelectItem>
						<SelectItem value="in_use">In use</SelectItem>
						<SelectItem value="returned">Returned</SelectItem>
						<SelectItem value="under_maintenance">Under maintenance</SelectItem>
						<SelectItem value="decommissioned">Decommissioned</SelectItem>
					</SelectContent>
				</Select>
				<Button size="sm" onClick={handleStatusUpdate} disabled={!newStatus || updateStatus.isPending}>
					{updateStatus.isPending ? "Saving…" : "Update status"}
				</Button>
			</div>

			<div className="rounded-md border p-4 flex flex-col gap-3">
				<h3 className="font-semibold text-sm">Add Maintenance Record</h3>
				<div className="grid grid-cols-2 gap-3">
					<div className="flex flex-col gap-1">
						<Label className="text-xs">Date</Label>
						<Input type="date" value={maintDate} onChange={e => setMaintDate(e.target.value)} className="h-7 text-xs" />
					</div>
					<div className="flex flex-col gap-1">
						<Label className="text-xs">Type</Label>
						<Select value={maintType} onValueChange={v => setMaintType(v ?? "routine")}>
							<SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="routine">Routine</SelectItem>
								<SelectItem value="repair">Repair</SelectItem>
								<SelectItem value="calibration">Calibration</SelectItem>
								<SelectItem value="inspection">Inspection</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="col-span-2 flex flex-col gap-1">
						<Label className="text-xs">Technician</Label>
						<Input value={maintTech} onChange={e => setMaintTech(e.target.value)} className="h-7 text-xs" />
					</div>
					<div className="col-span-2 flex flex-col gap-1">
						<Label className="text-xs">Notes</Label>
						<Textarea value={maintNotes} onChange={e => setMaintNotes(e.target.value)} rows={2} className="text-xs" />
					</div>
				</div>
				<Button size="sm" onClick={handleAddMaintenance} disabled={!maintDate || !maintTech || addMaintenance.isPending}>
					{addMaintenance.isPending ? "Adding…" : "Add record"}
				</Button>
			</div>

			{data.maintenanceHistory.length > 0 ? (
				<div className="rounded-md border p-4">
					<h3 className="font-semibold text-sm mb-2">Maintenance History</h3>
					{[...data.maintenanceHistory].sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()).map(m => (
						<div key={m.id} className="border-b py-2 text-xs last:border-0">
							<div className="flex justify-between">
								<span className="font-medium">{m.maintenanceType}</span>
								<span className="text-muted-foreground">{m.date ? new Date(m.date).toLocaleDateString() : "—"}</span>
							</div>
							<p className="text-muted-foreground">Technician: {m.technician}</p>
							{m.notes ? <p className="mt-0.5">{m.notes}</p> : null}
						</div>
					))}
				</div>
			) : null}
		</div>
	)
}
