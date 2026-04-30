"use client"

import Link from "next/link"
import { useState } from "react"

import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
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
import { useEnrollmentListQuery } from "@/features/supervisor-programs/api/supervisor-programs.hooks"

const STATUS_STYLES: Record<string, string> = {
	active: "bg-green-100 text-green-700",
	suspended: "bg-yellow-100 text-yellow-700",
	completed: "bg-blue-100 text-blue-700",
	withdrawn: "bg-slate-100 text-slate-600",
}

export function EnrollmentsListPage() {
	const [statusFilter, setStatusFilter] = useState("")
	const [programFilter, setProgramFilter] = useState("")
	const [dateFrom, setDateFrom] = useState("")
	const [dateTo, setDateTo] = useState("")
	const [coordinatorFilter, setCoordinatorFilter] = useState("")
	const { data, isLoading } = useEnrollmentListQuery({
		status: statusFilter || undefined,
		program: programFilter || undefined,
		dateFrom: dateFrom || undefined,
		dateTo: dateTo || undefined,
		coordinatorUserId: coordinatorFilter || undefined,
	})

	function exportCsv() {
		const rows = data?.rows ?? []
		const csv = ["enrollmentId,patient,program,status,startDate"].concat(
			rows.map(r => `${r.enrollmentId},${r.patientName},${r.programName},${r.status},${r.startDate ? new Date(r.startDate).toLocaleDateString() : ""}`)
		).join("\n")
		const blob = new Blob([csv], { type: "text/csv" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = `enrollments-${Date.now()}.csv`
		a.click()
		URL.revokeObjectURL(url)
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<header>
					<h1 className="text-2xl font-bold">Program Enrollments</h1>
					<p className="text-muted-foreground text-sm">Manage patient program enrollments.</p>
				</header>
				<Button variant="outline" size="sm" onClick={exportCsv}>Export CSV</Button>
			</div>
			<div className="flex gap-2 flex-wrap">
				<Select value={statusFilter} onValueChange={v => setStatusFilter(v ?? "")}>
					<SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
					<SelectContent>
						<SelectItem value="">All</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="suspended">Suspended</SelectItem>
						<SelectItem value="completed">Completed</SelectItem>
						<SelectItem value="withdrawn">Withdrawn</SelectItem>
					</SelectContent>
				</Select>
				<Input
					value={programFilter}
					onChange={e => setProgramFilter(e.target.value)}
					placeholder="Program name…"
					className="h-7 text-xs w-36"
				/>
				<Input
					type="date"
					value={dateFrom}
					onChange={e => setDateFrom(e.target.value)}
					className="h-7 text-xs w-36"
				/>
				<Input
					type="date"
					value={dateTo}
					onChange={e => setDateTo(e.target.value)}
					className="h-7 text-xs w-36"
				/>
				<Input
					value={coordinatorFilter}
					onChange={e => setCoordinatorFilter(e.target.value)}
					placeholder="Coordinator…"
					className="h-7 text-xs w-36"
				/>
			</div>
			{isLoading ? (
				<div className="flex flex-col gap-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Patient</TableHead>
							<TableHead>Program</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Enrolled</TableHead>
							<TableHead>Coordinator</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{(data?.rows ?? []).map(r => (
							<TableRow key={r.enrollmentId}>
								<TableCell className="font-medium">{r.patientName}</TableCell>
								<TableCell className="text-sm">{r.programName}</TableCell>
								<TableCell>
									<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[r.status]}`}>
										{r.status}
									</span>
								</TableCell>
								<TableCell className="text-xs tabular-nums">
									{r.startDate ? new Date(r.startDate).toLocaleDateString() : "—"}
								</TableCell>
								<TableCell className="text-sm">{r.coordinatorName ?? "—"}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	)
}
