"use client"

import Link from "next/link"
import { useState } from "react"

import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
import { Badge } from "@/core/components/ui/badge"
import { Input } from "@/core/components/ui/input"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { useSupervisorCaseListQuery } from "@/features/supervisor-cases/api/supervisor-cases.hooks"

const PRIORITY_STYLES: Record<string, string> = {
	low: "bg-slate-100 text-slate-600",
	medium: "bg-blue-100 text-blue-700",
	high: "bg-orange-100 text-orange-700",
	urgent: "bg-red-100 text-red-700",
}

export default function SupervisorCasesPage() {
	const [q, setQ] = useState("")
	const { data, isLoading } = useSupervisorCaseListQuery()
	const cases = (data as { cases?: Array<Record<string, unknown>> } | undefined)?.cases ?? []

	return (
		<div className="flex flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">Case Queue</h1>
				<p className="text-muted-foreground text-sm">Supervisor view — all cases across teams.</p>
			</header>
			<Input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter by case ref or patient…" className="max-w-sm" />
			{isLoading ? (
				<div className="flex flex-col gap-2">
					{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Case Ref</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Priority</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Patient</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{cases.filter(c => !q || (c.ref as string).includes(q) || (c.patientName as string)?.toLowerCase().includes(q.toLowerCase())).map(c => (
							<TableRow key={c.ref as string}>
								<TableCell>
									<Link href={SUPERVISOR_ROUTES.caseDetail(c.ref as string)} className="font-mono text-xs hover:underline">
										{c.ref as string}
									</Link>
								</TableCell>
								<TableCell className="text-sm">{c.caseType as string}</TableCell>
								<TableCell>
									<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${PRIORITY_STYLES[c.priority as string] ?? "bg-slate-100"}`}>
										{c.priority as string}
									</span>
								</TableCell>
								<TableCell className="text-sm">{(c.status as string).replace(/_/g, " ")}</TableCell>
								<TableCell className="text-sm">{(c.patientName as string) ?? "—"}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	)
}
