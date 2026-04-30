"use client"

import Link from "next/link"

import { Skeleton } from "@/core/components/ui/skeleton"
import { usePatientGetQuery } from "@/features/agent-patients/api/patients.hooks"

export function PatientProfileHeader({ patientId }: { patientId: string }) {
	const { data, isLoading } = usePatientGetQuery(patientId)

	if (isLoading || !data) {
		return <Skeleton className="h-20 w-full" />
	}

	return (
		<header className="flex items-start justify-between gap-4 border-b pb-4">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold">{data.fullName}</h1>
				<dl className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
					<div>
						<dt className="sr-only">MRN</dt>
						<dd>
							MRN <span className="text-foreground font-medium">{data.mrn}</span>
						</dd>
					</div>
					<div>
						<dt className="sr-only">DOB</dt>
						<dd>DOB {data.dateOfBirth}</dd>
					</div>
					<div>
						<dt className="sr-only">Sex</dt>
						<dd>{data.sexAtBirth ?? "Unknown"}</dd>
					</div>
					<div>
						<dt className="sr-only">FHIR sync</dt>
						<dd>
							{data.fhirResourceId
								? `FHIR · ${data.fhirSyncedAt ? new Date(data.fhirSyncedAt).toLocaleDateString() : "synced"}`
								: "Not linked to FHIR"}
						</dd>
					</div>
				</dl>
			</div>
			<nav className="flex items-center gap-2 text-xs">
				<Link
					href={`/agent/patients/${data.id}`}
					className="text-muted-foreground hover:text-foreground rounded-md px-2 py-1"
				>
					Overview
				</Link>
				<Link
					href={`/agent/patients/${data.id}/timeline`}
					className="text-muted-foreground hover:text-foreground rounded-md px-2 py-1"
				>
					Timeline
				</Link>
			</nav>
		</header>
	)
}
