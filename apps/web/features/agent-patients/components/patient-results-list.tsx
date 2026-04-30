"use client"

import Link from "next/link"

import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { usePatientSearchQuery } from "@/features/agent-patients/api/patients.hooks"

const FACILITY_BY_TENANT: Record<string, string> = {
	"tenant-1": "SLMC Quezon City",
	"tenant-2": "SLMC Global City",
}

// Mock last-case dates — backend lookup ships with CA-BE-02.
const MOCK_LAST_CASE: Record<string, string> = {
	"patient-maria-santos": "2026-04-27",
	"patient-ramon-cruz": "2026-04-22",
	"patient-anna-tan": "2025-11-08",
}

export function PatientResultsList({ query }: { query: string }) {
	const { data, isLoading } = usePatientSearchQuery(query)

	if (query.trim().length < 2) {
		return (
			<p className="text-muted-foreground text-xs italic">
				Enter at least 2 characters to search.
			</p>
		)
	}

	if (isLoading) {
		return (
			<div className="flex flex-col gap-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className="h-14 w-full" />
				))}
			</div>
		)
	}

	const patients = data ?? []

	if (patients.length === 0) {
		return <p className="text-muted-foreground text-sm">No patients matched “{query}”.</p>
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>DOB</TableHead>
					<TableHead>MRN</TableHead>
					<TableHead>Facility</TableHead>
					<TableHead>Last case</TableHead>
					<TableHead />
				</TableRow>
			</TableHeader>
			<TableBody>
				{patients.map(p => {
					const facility = FACILITY_BY_TENANT[p.tenantId] ?? p.tenantId
					const lastCase = MOCK_LAST_CASE[p.id] ?? "—"
					return (
						<TableRow key={p.id}>
							<TableCell className="text-sm font-medium">{p.fullName}</TableCell>
							<TableCell className="text-xs tabular-nums">{p.dateOfBirth}</TableCell>
							<TableCell className="font-mono text-xs">{p.mrn}</TableCell>
							<TableCell className="text-xs">{facility}</TableCell>
							<TableCell className="text-xs tabular-nums">{lastCase}</TableCell>
							<TableCell>
								<div className="flex items-center justify-end gap-2">
									<Link
										href={`/agent/patients/${p.id}`}
										className="text-primary text-xs font-medium hover:underline"
									>
										Open
									</Link>
									<Link
										href={`/agent/cases?createForPatient=${p.id}`}
										className="border-border hover:bg-muted inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium transition-colors"
									>
										Create case
									</Link>
								</div>
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}
