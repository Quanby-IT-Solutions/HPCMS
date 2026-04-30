"use client"

import { useState } from "react"

import type { AssignedDevice, ProgramEnrollment } from "@repo/contracts"

import { X } from "@/core/components/icons"
import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/core/components/ui/dialog"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	useDevicesForPatientQuery,
	useProgramsForPatientQuery,
} from "@/features/agent-patients/api/programs-devices.hooks"

function formatDate(d: Date | string | null): string {
	if (!d) return "—"
	const date = d instanceof Date ? d : new Date(d)
	return date.toLocaleDateString()
}

function ProgramRowDetail({
	program,
	onClose,
}: {
	program: ProgramEnrollment
	onClose: () => void
}) {
	return (
		<Dialog open onOpenChange={open => !open && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{program.programName}
						<Badge variant="secondary">{program.status}</Badge>
					</DialogTitle>
					<DialogDescription>
						Read-only — managed by Supervisor (SUP-FE-16).
					</DialogDescription>
				</DialogHeader>
				<dl className="grid grid-cols-2 gap-3 text-xs">
					<div>
						<dt className="text-muted-foreground uppercase tracking-wider">Enrolled</dt>
						<dd>{formatDate(program.enrolledAt)}</dd>
					</div>
					<div>
						<dt className="text-muted-foreground uppercase tracking-wider">Ended</dt>
						<dd>{formatDate(program.endedAt)}</dd>
					</div>
					<div className="col-span-2">
						<dt className="text-muted-foreground uppercase tracking-wider">
							Coordinator
						</dt>
						<dd>{program.coordinatorName ?? "—"}</dd>
					</div>
					{program.notes ? (
						<div className="col-span-2">
							<dt className="text-muted-foreground uppercase tracking-wider">Notes</dt>
							<dd className="whitespace-pre-wrap">{program.notes}</dd>
						</div>
					) : null}
				</dl>
				<div className="flex justify-end">
					<Button variant="outline" size="sm" onClick={onClose}>
						<X className="mr-1 size-3" />
						Close
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

function DeviceRowDetail({
	device,
	onClose,
}: {
	device: AssignedDevice
	onClose: () => void
}) {
	return (
		<Dialog open onOpenChange={open => !open && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{device.deviceType}
						<Badge variant={device.status === "active" ? "secondary" : "outline"}>
							{device.status}
						</Badge>
					</DialogTitle>
					<DialogDescription>
						Read-only — managed by Supervisor (SUP-FE-17).
					</DialogDescription>
				</DialogHeader>
				<dl className="grid grid-cols-2 gap-3 text-xs">
					<div>
						<dt className="text-muted-foreground uppercase tracking-wider">Model</dt>
						<dd>{device.model ?? "—"}</dd>
					</div>
					<div>
						<dt className="text-muted-foreground uppercase tracking-wider">Serial</dt>
						<dd className="font-mono">{device.serialNumber ?? "—"}</dd>
					</div>
					<div>
						<dt className="text-muted-foreground uppercase tracking-wider">Assigned</dt>
						<dd>{formatDate(device.assignedAt)}</dd>
					</div>
					<div>
						<dt className="text-muted-foreground uppercase tracking-wider">Returned</dt>
						<dd>{formatDate(device.returnedAt)}</dd>
					</div>
					{device.notes ? (
						<div className="col-span-2">
							<dt className="text-muted-foreground uppercase tracking-wider">Notes</dt>
							<dd className="whitespace-pre-wrap">{device.notes}</dd>
						</div>
					) : null}
					<div className="col-span-2">
						<dt className="text-muted-foreground uppercase tracking-wider">
							Maintenance log
						</dt>
						<dd className="text-muted-foreground italic">
							Maintenance entries appear here once SUP-BE-10 ships them on the device record.
						</dd>
					</div>
				</dl>
				<div className="flex justify-end">
					<Button variant="outline" size="sm" onClick={onClose}>
						<X className="mr-1 size-3" />
						Close
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

interface Props {
	patientId: string
	kind: "programs" | "devices"
}

export function ProgramsAndDevicesPanel({ patientId, kind }: Props) {
	const programsQ = useProgramsForPatientQuery(patientId)
	const devicesQ = useDevicesForPatientQuery(patientId)
	const [selectedProgram, setSelectedProgram] = useState<ProgramEnrollment | null>(null)
	const [selectedDevice, setSelectedDevice] = useState<AssignedDevice | null>(null)

	if (kind === "programs") {
		const data = programsQ.data
		return (
			<>
				<Card size="sm">
					<CardHeader>
						<CardTitle className="text-xs uppercase tracking-wider">
							Enrolled Programs
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						{programsQ.isLoading || !data ? (
							<Skeleton className="h-12 w-full" />
						) : data.enrollments.length === 0 ? (
							<p className="text-muted-foreground text-xs italic">No active programs.</p>
						) : (
							data.enrollments.map(p => (
								<button
									key={p.id}
									type="button"
									onClick={() => setSelectedProgram(p)}
									className="bg-muted/30 hover:bg-muted/60 flex items-start justify-between gap-2 rounded-md p-2 text-left transition-colors"
								>
									<div>
										<div className="text-sm font-medium">{p.programName}</div>
										<div className="text-muted-foreground text-[11px]">
											Since {formatDate(p.enrolledAt)} · {p.coordinatorName ?? "—"}
										</div>
									</div>
									<Badge variant="secondary">{p.status}</Badge>
								</button>
							))
						)}
						<p className="text-muted-foreground mt-1 text-[10px] italic">
							Read-only · managed by Supervisor (SUP-FE-16). Click a row for detail.
						</p>
					</CardContent>
				</Card>
				{selectedProgram ? (
					<ProgramRowDetail
						program={selectedProgram}
						onClose={() => setSelectedProgram(null)}
					/>
				) : null}
			</>
		)
	}

	const data = devicesQ.data
	return (
		<>
			<Card size="sm">
				<CardHeader>
					<CardTitle className="text-xs uppercase tracking-wider">Assigned Devices</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					{devicesQ.isLoading || !data ? (
						<Skeleton className="h-12 w-full" />
					) : data.devices.length === 0 ? (
						<p className="text-muted-foreground text-xs italic">No assigned devices.</p>
					) : (
						data.devices.map(d => (
							<button
								key={d.id}
								type="button"
								onClick={() => setSelectedDevice(d)}
								className="bg-muted/30 hover:bg-muted/60 flex items-start justify-between gap-2 rounded-md p-2 text-left transition-colors"
							>
								<div>
									<div className="text-sm font-medium">{d.deviceType}</div>
									<div className="text-muted-foreground text-[11px]">
										{d.model ?? "—"} · serial {d.serialNumber ?? "—"}
									</div>
									<div className="text-muted-foreground text-[10px]">
										Since {formatDate(d.assignedAt)}
									</div>
								</div>
								<Badge variant={d.status === "active" ? "secondary" : "outline"}>
									{d.status}
								</Badge>
							</button>
						))
					)}
					<p className="text-muted-foreground mt-1 text-[10px] italic">
						Read-only · managed by Supervisor (SUP-FE-17). Click a row for detail.
					</p>
				</CardContent>
			</Card>
			{selectedDevice ? (
				<DeviceRowDetail
					device={selectedDevice}
					onClose={() => setSelectedDevice(null)}
				/>
			) : null}
		</>
	)
}
