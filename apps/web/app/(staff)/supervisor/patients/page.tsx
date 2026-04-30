"use client"

import Link from "next/link"
import { useState } from "react"

import { Button } from "@/core/components/ui/button"
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
import { usePatientSearchQuery } from "@/features/supervisor-patients/api/supervisor-patients.hooks"
import { SUPERVISOR_ROUTES } from "../supervisor-routes"

export default function SupervisorPatientsPage() {
	const [q, setQ] = useState("")
	const { data, isLoading } = usePatientSearchQuery(q)
	const patients = (data as { patients?: Array<Record<string, unknown>> } | undefined)?.patients ?? []

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<header>
					<h1 className="text-2xl font-bold">Patients</h1>
					<p className="text-muted-foreground text-sm">Search and manage patient records.</p>
				</header>
				<Link href={SUPERVISOR_ROUTES.patientNew}>
					<Button size="sm">New Patient</Button>
				</Link>
			</div>
			<Input
				value={q}
				onChange={e => setQ(e.target.value)}
				placeholder="Search by name or MRN…"
				className="max-w-sm"
			/>
			{isLoading ? (
				<div className="flex flex-col gap-2">
					{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
				</div>
			) : q.length > 1 ? (
				patients.length === 0 ? (
					<p className="text-muted-foreground text-sm">No patients found.</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>MRN</TableHead>
								<TableHead>Date of Birth</TableHead>
								<TableHead>Sex</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{patients.map(p => (
								<TableRow key={p.id as string} className="cursor-pointer">
									<TableCell>
										<Link href={SUPERVISOR_ROUTES.patientProfile(p.id as string)} className="font-medium hover:underline">
											{p.fullName as string}
										</Link>
									</TableCell>
									<TableCell className="font-mono text-xs">{(p.mrn as string) ?? "—"}</TableCell>
									<TableCell className="text-sm">{(p.dateOfBirth as string) ?? "—"}</TableCell>
									<TableCell className="text-sm">{(p.sex as string) ?? "—"}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)
			) : (
				<p className="text-muted-foreground text-sm italic">Enter at least 2 characters to search.</p>
			)}
		</div>
	)
}
