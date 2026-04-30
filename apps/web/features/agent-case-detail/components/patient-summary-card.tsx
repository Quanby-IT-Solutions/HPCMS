"use client"

import Link from "next/link"

import { ExternalLink } from "@/core/components/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Skeleton } from "@/core/components/ui/skeleton"
import { usePatientGetQuery } from "@/features/agent-patients/api/patients.hooks"

export function PatientSummaryCard({ patientId }: { patientId: string }) {
	const { data, isLoading } = usePatientGetQuery(patientId)

	return (
		<Card size="sm">
			<CardHeader>
				<CardTitle className="text-xs uppercase tracking-wider">Patient</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading || !data ? (
					<Skeleton className="h-12 w-full" />
				) : (
					<Link
						href={`/agent/patients/${data.id}`}
						className="hover:bg-muted/40 -m-2 flex items-start justify-between gap-3 rounded-md p-2 transition-colors"
					>
						<div className="flex flex-col gap-0.5">
							<span className="text-sm font-medium">{data.fullName}</span>
							<span className="text-muted-foreground text-[11px]">
								MRN <code className="font-mono">{data.mrn}</code> · DOB{" "}
								{data.dateOfBirth} · {data.sexAtBirth ?? "—"}
							</span>
							<span className="text-muted-foreground text-[10px]">
								{data.fhirResourceId
									? `FHIR linked${data.fhirSyncedAt ? ` · synced ${new Date(data.fhirSyncedAt).toLocaleDateString()}` : ""}`
									: "Not linked to FHIR"}
							</span>
						</div>
						<ExternalLink className="text-muted-foreground size-4 shrink-0" />
					</Link>
				)}
			</CardContent>
		</Card>
	)
}
