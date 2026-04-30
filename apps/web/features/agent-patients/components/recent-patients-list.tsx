"use client"

import Link from "next/link"

import { Skeleton } from "@/core/components/ui/skeleton"
import { usePatientRecentsQuery } from "@/features/agent-patients/api/patients.hooks"

export function RecentPatientsList() {
	const { data, isLoading } = usePatientRecentsQuery()

	if (isLoading || !data) {
		return (
			<div className="flex flex-col gap-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className="h-12 w-full" />
				))}
			</div>
		)
	}

	if (data.patients.length === 0) {
		return (
			<p className="text-muted-foreground text-xs italic">No recent patients yet.</p>
		)
	}

	return (
		<ul className="flex flex-col gap-1">
			{data.patients.map(p => (
				<li key={p.id}>
					<Link
						href={`/agent/patients/${p.id}`}
						className="hover:bg-muted/50 flex items-center justify-between rounded-md border p-3 text-sm transition-colors"
					>
						<div>
							<div className="font-medium">{p.fullName}</div>
							<div className="text-muted-foreground text-xs">
								MRN {p.mrn}
								{p.lastInteractionAt
									? ` · last ${p.lastInteractionChannel ?? "interaction"} ${new Date(p.lastInteractionAt).toLocaleDateString()}`
									: ""}
							</div>
						</div>
						<div className="text-muted-foreground text-xs">
							{p.openCaseCount} open
						</div>
					</Link>
				</li>
			))}
		</ul>
	)
}
