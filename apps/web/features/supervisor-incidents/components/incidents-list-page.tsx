"use client"

import Link from "next/link"

import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { useIncidentListQuery } from "@/features/supervisor-incidents/api/supervisor-incidents.hooks"

const SEVERITY_STYLES: Record<string, string> = {
	low: "bg-blue-100 text-blue-700",
	medium: "bg-yellow-100 text-yellow-700",
	high: "bg-orange-100 text-orange-700",
	critical: "bg-red-100 text-red-700",
}

const STATUS_STYLES: Record<string, string> = {
	detected: "bg-yellow-100 text-yellow-700",
	investigating: "bg-orange-100 text-orange-700",
	mitigating: "bg-purple-100 text-purple-700",
	resolved: "bg-green-100 text-green-700",
	closed: "bg-slate-100 text-slate-600",
}

export function IncidentsListPage() {
	const { data, isLoading } = useIncidentListQuery()
	const rows = data?.rows ?? []

	const kpis = {
		total: rows.length,
		critical: rows.filter(r => r.severity === "critical").length,
		open: rows.filter(r => !["resolved", "closed"].includes(r.status)).length,
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<header>
					<h1 className="text-2xl font-bold">Major Incidents</h1>
					<p className="text-muted-foreground text-sm">Track and manage cross-case incidents.</p>
				</header>
				<Link href={SUPERVISOR_ROUTES.incidentNew}>
					<Button size="sm">New Incident</Button>
				</Link>
			</div>

			<div className="grid grid-cols-3 gap-3">
				{[
					{ label: "Total", value: kpis.total },
					{ label: "Critical", value: kpis.critical },
					{ label: "Open", value: kpis.open },
				].map(k => (
					<div key={k.label} className="rounded-md border p-3">
						<p className="text-muted-foreground text-xs">{k.label}</p>
						<p className="text-2xl font-bold mt-0.5">{k.value}</p>
					</div>
				))}
			</div>

			{isLoading ? (
				<div className="flex flex-col gap-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Severity</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Cases</TableHead>
							<TableHead>Created</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map(r => (
							<TableRow key={r.incidentId}>
								<TableCell>
									<Link href={SUPERVISOR_ROUTES.incidentDetail(r.incidentId)} className="font-medium hover:underline">
										{r.title}
									</Link>
								</TableCell>
								<TableCell>
									<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${SEVERITY_STYLES[r.severity]}`}>
										{r.severity}
									</span>
								</TableCell>
								<TableCell>
									<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[r.status]}`}>
										{r.status}
									</span>
								</TableCell>
								<TableCell className="text-sm">{r.caseRefs.length}</TableCell>
								<TableCell className="text-xs tabular-nums">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	)
}
