"use client"

import { useQueryClient } from "@tanstack/react-query"

import { RotateCcw } from "@/core/components/icons"
import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs"
import { useClinicianCaseSummaryQuery } from "@/features/clinician-sidebar/api/sidebar.hooks"
import { CaseSummaryTab } from "@/features/clinician-sidebar/components/case-summary-tab"
import { ClinicalContextTab } from "@/features/clinician-sidebar/components/clinical-context-tab"
import { ClinicianHeader } from "@/features/clinician-sidebar/components/clinician-header"
import { orpc } from "@/services/orpc/client"

function SidebarLoadingSkeleton() {
	return (
		<div className="flex flex-col gap-3 px-3 py-3">
			<Skeleton className="h-12 w-full" />
			<Skeleton className="h-24 w-full" />
			<Skeleton className="h-32 w-full" />
		</div>
	)
}

export function SidebarPageClient({ patientId }: { patientId: string }) {
	const queryClient = useQueryClient()
	const { data, isLoading, isFetching, error } = useClinicianCaseSummaryQuery(patientId)

	if (isLoading || !data) {
		return <SidebarLoadingSkeleton />
	}

	if (error) {
		return (
			<div className="flex flex-col gap-2 p-4">
				<p className="text-destructive text-sm font-medium">Failed to load case summary.</p>
				<p className="text-muted-foreground text-xs">{(error as Error).message}</p>
			</div>
		)
	}

	function handleRefreshAll() {
		queryClient.invalidateQueries({ queryKey: orpc.clinician.summary.get.key() })
		queryClient.invalidateQueries({ queryKey: orpc.clinician.enrichment.allergies.key() })
		queryClient.invalidateQueries({ queryKey: orpc.clinician.enrichment.medications.key() })
		queryClient.invalidateQueries({ queryKey: orpc.clinician.enrichment.immunizations.key() })
		queryClient.invalidateQueries({ queryKey: orpc.clinician.enrichment.observations.key() })
		queryClient.invalidateQueries({ queryKey: orpc.clinician.enrichment.carePlans.key() })
		queryClient.invalidateQueries({ queryKey: orpc.clinician.enrichment.diagnostics.key() })
	}

	return (
		<div className="flex flex-col">
			<ClinicianHeader patient={data.patient} />

			<Tabs defaultValue="summary" className="flex-1 px-3 py-3">
				<div className="flex items-center justify-between">
					<TabsList variant="line">
						<TabsTrigger value="summary">Cases</TabsTrigger>
						<TabsTrigger value="clinical">Clinical</TabsTrigger>
						<TabsTrigger value="notes">Notes</TabsTrigger>
					</TabsList>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						onClick={handleRefreshAll}
						disabled={isFetching}
						aria-label="Refresh sidebar"
					>
						<RotateCcw className={isFetching ? "size-4 animate-spin" : "size-4"} />
					</Button>
				</div>

				<TabsContent value="summary" className="mt-3">
					<CaseSummaryTab summary={data} />
				</TabsContent>
				<TabsContent value="clinical" className="mt-3">
					<ClinicalContextTab patientId={patientId} />
				</TabsContent>
				<TabsContent value="notes" className="mt-3">
					<div className="rounded-md border border-dashed p-4">
						<p className="text-muted-foreground text-xs italic">
							Notes you add or flags you raise from the Cases tab appear on the Case Detail
							view in PCMS for the assigned agent.
						</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
