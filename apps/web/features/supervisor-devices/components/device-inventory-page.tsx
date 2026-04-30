"use client"

import Link from "next/link"
import { useState } from "react"

import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { useDeviceInventoryQuery } from "@/features/supervisor-devices/api/supervisor-devices.hooks"

const STATUS_STYLES: Record<string, string> = {
	assigned: "bg-blue-100 text-blue-700",
	in_use: "bg-green-100 text-green-700",
	returned: "bg-slate-100 text-slate-600",
	decommissioned: "bg-red-100 text-red-700",
	under_maintenance: "bg-yellow-100 text-yellow-700",
}

export function DeviceInventoryPage() {
	const [statusFilter, setStatusFilter] = useState("")
	const { data, isLoading } = useDeviceInventoryQuery(statusFilter ? { status: statusFilter } : {})

	return (
		<div className="flex flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">Device Inventory</h1>
				<p className="text-muted-foreground text-sm">Facility-wide medical device tracking.</p>
			</header>
			<div className="flex gap-2">
				<Select value={statusFilter} onValueChange={v => setStatusFilter(v ?? "")}>
					<SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
					<SelectContent>
						<SelectItem value="">All</SelectItem>
						<SelectItem value="assigned">Assigned</SelectItem>
						<SelectItem value="in_use">In use</SelectItem>
						<SelectItem value="returned">Returned</SelectItem>
						<SelectItem value="under_maintenance">Under maintenance</SelectItem>
						<SelectItem value="decommissioned">Decommissioned</SelectItem>
					</SelectContent>
				</Select>
			</div>
			{isLoading ? (
				<div className="flex flex-col gap-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Serial #</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Patient</TableHead>
							<TableHead>Last Service</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{(data?.rows ?? []).map(d => (
							<TableRow key={d.deviceId}>
								<TableCell>
									<Link href={SUPERVISOR_ROUTES.deviceDetail(d.deviceId)} className="font-mono text-xs hover:underline">
										{d.serialNumber}
									</Link>
								</TableCell>
								<TableCell className="text-sm">{d.deviceType}</TableCell>
								<TableCell>
									<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[d.status]}`}>
										{d.status.replace(/_/g, " ")}
									</span>
								</TableCell>
								<TableCell className="text-sm">{d.patientName ?? "—"}</TableCell>
								<TableCell className="text-xs tabular-nums">
									{d.lastServiceDate ? new Date(d.lastServiceDate).toLocaleDateString() : "—"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	)
}
