"use client"

import type {
	AllergyRow,
	CarePlanRow,
	DiagnosticRow,
	ImmunizationRow,
	MedicationRow,
	ObservationRow,
} from "@repo/contracts"

import { Skeleton } from "@/core/components/ui/skeleton"
import {
	useAllergiesQuery,
	useCarePlansQuery,
	useDiagnosticsQuery,
	useImmunizationsQuery,
	useMedicationsQuery,
	useObservationsQuery,
	useRefreshSection,
} from "@/features/clinician-sidebar/api/clinical-context.hooks"
import { ClinicianCard } from "@/features/clinician-sidebar/components/clinician-card"
import { DenseInfoRow } from "@/features/clinician-sidebar/components/dense-info-row"

function formatDate(value: Date | string | null | undefined): string | undefined {
	if (!value) return undefined
	const date = value instanceof Date ? value : new Date(value)
	if (Number.isNaN(date.getTime())) return undefined
	return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

function SectionSkeleton() {
	return (
		<div className="flex flex-col gap-2">
			<Skeleton className="h-3 w-3/4" />
			<Skeleton className="h-3 w-1/2" />
			<Skeleton className="h-3 w-2/3" />
		</div>
	)
}

function EmptyPlaceholder() {
	return <p className="text-muted-foreground text-xs italic">Not available in EMR.</p>
}

function AllergiesSection({ patientId }: { patientId: string }) {
	const { data, isLoading, isFetching } = useAllergiesQuery(patientId)
	const refresh = useRefreshSection()

	return (
		<ClinicianCard
			title="Allergies"
			lastSyncedAt={data?.lastSyncedAt ?? null}
			onRefresh={() => refresh("allergies")}
			isRefreshing={isFetching}
		>
			{isLoading ? (
				<SectionSkeleton />
			) : !data || data.items.length === 0 ? (
				<EmptyPlaceholder />
			) : (
				<dl className="divide-border divide-y">
					{data.items.map((row: AllergyRow) => (
						<DenseInfoRow
							key={row.id}
							label={row.substance}
							value={row.severity[0]?.toUpperCase() + row.severity.slice(1)}
							sub={
								row.reaction
									? `${row.reaction}${row.verifiedAt ? ` · ${formatDate(row.verifiedAt)}` : ""}`
									: formatDate(row.verifiedAt)
							}
						/>
					))}
				</dl>
			)}
		</ClinicianCard>
	)
}

function MedicationsSection({ patientId }: { patientId: string }) {
	const { data, isLoading, isFetching } = useMedicationsQuery(patientId)
	const refresh = useRefreshSection()

	return (
		<ClinicianCard
			title="Medications"
			lastSyncedAt={data?.lastSyncedAt ?? null}
			onRefresh={() => refresh("medications")}
			isRefreshing={isFetching}
		>
			{isLoading ? (
				<SectionSkeleton />
			) : !data || data.items.length === 0 ? (
				<EmptyPlaceholder />
			) : (
				<dl className="divide-border divide-y">
					{data.items.map((row: MedicationRow) => (
						<DenseInfoRow
							key={row.id}
							label={row.name}
							value={row.dose ?? row.status}
							sub={
								[row.frequency, row.prescribedBy].filter(Boolean).join(" · ") ||
								formatDate(row.startedAt)
							}
						/>
					))}
				</dl>
			)}
		</ClinicianCard>
	)
}

function ImmunizationsSection({ patientId }: { patientId: string }) {
	const { data, isLoading, isFetching } = useImmunizationsQuery(patientId)
	const refresh = useRefreshSection()

	return (
		<ClinicianCard
			title="Immunizations"
			lastSyncedAt={data?.lastSyncedAt ?? null}
			onRefresh={() => refresh("immunizations")}
			isRefreshing={isFetching}
		>
			{isLoading ? (
				<SectionSkeleton />
			) : !data || data.items.length === 0 ? (
				<EmptyPlaceholder />
			) : (
				<dl className="divide-border divide-y">
					{data.items.map((row: ImmunizationRow) => (
						<DenseInfoRow
							key={row.id}
							label={row.vaccine}
							value={formatDate(row.administeredAt) ?? "Unknown date"}
							sub={[row.site, row.lotNumber].filter(Boolean).join(" · ") || undefined}
						/>
					))}
				</dl>
			)}
		</ClinicianCard>
	)
}

function ObservationsSection({ patientId }: { patientId: string }) {
	const { data, isLoading, isFetching } = useObservationsQuery(patientId)
	const refresh = useRefreshSection()

	return (
		<ClinicianCard
			title="Observations"
			lastSyncedAt={data?.lastSyncedAt ?? null}
			onRefresh={() => refresh("observations")}
			isRefreshing={isFetching}
		>
			{isLoading ? (
				<SectionSkeleton />
			) : !data || data.items.length === 0 ? (
				<EmptyPlaceholder />
			) : (
				<dl className="divide-border divide-y">
					{data.items.map((row: ObservationRow) => (
						<DenseInfoRow
							key={row.id}
							label={row.display}
							value={row.unit ? `${row.value} ${row.unit}` : row.value}
							sub={
								[row.category, formatDate(row.recordedAt)].filter(Boolean).join(" · ") ||
								undefined
							}
						/>
					))}
				</dl>
			)}
		</ClinicianCard>
	)
}

function CarePlansSection({ patientId }: { patientId: string }) {
	const { data, isLoading, isFetching } = useCarePlansQuery(patientId)
	const refresh = useRefreshSection()

	return (
		<ClinicianCard
			title="Care Plans"
			lastSyncedAt={data?.lastSyncedAt ?? null}
			onRefresh={() => refresh("carePlans")}
			isRefreshing={isFetching}
		>
			{isLoading ? (
				<SectionSkeleton />
			) : !data || data.items.length === 0 ? (
				<EmptyPlaceholder />
			) : (
				<div className="flex flex-col gap-3">
					{data.items.map((row: CarePlanRow) => (
						<div key={row.id} className="flex flex-col gap-1">
							<div className="flex items-baseline justify-between gap-2">
								<span className="text-foreground text-xs font-medium">{row.title}</span>
								<span className="text-muted-foreground text-[10px] capitalize">
									{row.status}
								</span>
							</div>
							{row.goals.length > 0 ? (
								<ul className="text-muted-foreground list-disc pl-4 text-[11px]">
									{row.goals.map((goal, idx) => (
										<li key={idx}>{goal}</li>
									))}
								</ul>
							) : null}
						</div>
					))}
				</div>
			)}
		</ClinicianCard>
	)
}

function DiagnosticsSection({ patientId }: { patientId: string }) {
	const { data, isLoading, isFetching } = useDiagnosticsQuery(patientId)
	const refresh = useRefreshSection()

	return (
		<ClinicianCard
			title="Diagnostics"
			lastSyncedAt={data?.lastSyncedAt ?? null}
			onRefresh={() => refresh("diagnostics")}
			isRefreshing={isFetching}
		>
			{isLoading ? (
				<SectionSkeleton />
			) : !data || data.items.length === 0 ? (
				<EmptyPlaceholder />
			) : (
				<dl className="divide-border divide-y">
					{data.items.map((row: DiagnosticRow) => (
						<DenseInfoRow
							key={row.id}
							label={row.name}
							value={row.status}
							sub={
								row.conclusion ??
								(formatDate(row.effectiveAt) ? `Effective ${formatDate(row.effectiveAt)}` : undefined)
							}
						/>
					))}
				</dl>
			)}
		</ClinicianCard>
	)
}

export function ClinicalContextTab({ patientId }: { patientId: string }) {
	return (
		<div className="flex flex-col gap-2">
			<AllergiesSection patientId={patientId} />
			<MedicationsSection patientId={patientId} />
			<ImmunizationsSection patientId={patientId} />
			<ObservationsSection patientId={patientId} />
			<CarePlansSection patientId={patientId} />
			<DiagnosticsSection patientId={patientId} />
		</div>
	)
}
