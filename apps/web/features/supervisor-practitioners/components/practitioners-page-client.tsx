"use client"

import { useState } from "react"

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
import { usePractitionerListQuery } from "@/features/supervisor-practitioners/api/practitioners.hooks"

export function PractitionersPageClient() {
	const [q, setQ] = useState("")
	const { data: practitioners, isLoading } = usePractitionerListQuery({ query: q })

	return (
		<div className="flex flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">Practitioners</h1>
				<p className="text-muted-foreground text-sm">Search and view practitioner directory.</p>
			</header>
			<Input
				value={q}
				onChange={e => setQ(e.target.value)}
				placeholder="Search by name or specialty…"
				className="max-w-sm"
			/>
			{isLoading ? (
				<div className="flex flex-col gap-2">
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className="h-12 w-full" />
					))}
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Specialty</TableHead>
							<TableHead>PRC License</TableHead>
							<TableHead>Department</TableHead>
							<TableHead>Facility</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{(practitioners ?? []).map(p => {
							const dept = (p.fhirData as { department?: string } | null)?.department ?? "—"
							const facility = p.tenantId ?? "—"
							return (
								<TableRow key={p.id}>
									<TableCell className="font-medium">{p.fullName}</TableCell>
									<TableCell className="text-sm">{p.specialty ?? "—"}</TableCell>
									<TableCell className="font-mono text-xs">{p.licenseNo ?? "—"}</TableCell>
									<TableCell className="text-sm">{dept}</TableCell>
									<TableCell className="text-sm font-mono text-xs">{facility}</TableCell>
									<TableCell>
										<Badge variant={p.isActive ? "default" : "secondary"}>
											{p.isActive ? "Active" : "Inactive"}
										</Badge>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			)}
		</div>
	)
}
