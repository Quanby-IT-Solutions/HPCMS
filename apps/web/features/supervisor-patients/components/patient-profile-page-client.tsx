"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { Badge } from "@/core/components/ui/badge"
import { Skeleton } from "@/core/components/ui/skeleton"
import { authClient } from "@/services/better-auth/auth-client"
import { useSupervisorCaseListQuery } from "@/features/supervisor-cases/api/supervisor-cases.hooks"
import { useConsentListQuery } from "@/features/supervisor-patients/api/supervisor-consent.hooks"
import { usePatientGetQuery } from "@/features/supervisor-patients/api/supervisor-patients.hooks"
import { ConsentManagementPanel } from "@/features/supervisor-patients/components/consent-management-panel"
import { AssignedDevicesPanel } from "@/features/supervisor-devices/components/assigned-devices-panel"
import { EnrolledProgramsPanel } from "@/features/supervisor-programs/components/enrolled-programs-panel"
import { CrossFacilityPatientContextPanel } from "@/features/supervisor-patients/components/cross-facility-patient-context-panel"
import { EditDemographicsModal } from "@/features/supervisor-patients/components/edit-demographics-modal"
import { MrnLinkingPanel } from "@/features/supervisor-patients/components/mrn-linking-panel"
import { PatientProfileShell } from "@/features/supervisor-workspace/components/patient-profile-shell"
import { RightRailPanel } from "@/features/supervisor-workspace/components/right-rail-panel"
import { PatientAuditHistoryPanel } from "@/features/tenant-admin/components/patient-audit-history-panel"
import { ConsentHistoryPanel } from "@/features/tenant-admin/components/consent-history-panel"

interface Props {
	patientId: string
}

export function PatientProfilePageClient({ patientId }: Props) {
	const searchParams = useSearchParams()
	const { data: patient, isLoading } = usePatientGetQuery(patientId)
	const { data: casesData } = useSupervisorCaseListQuery({ patientId })
	const { data: consentData } = useConsentListQuery(patientId)
	const { data: session } = authClient.useSession()
	const userRole = (session?.user as { role?: string })?.role ?? ""
	const isTenantAdmin = ["tenant_admin", "system_admin"].includes(userRole)
	const [activeTab, setActiveTab] = useState<"overview" | "communications" | "cases" | "programs" | "devices" | "audit" | "consent">("overview")

	if (isLoading || !patient) {
		return (
			<div className="flex flex-col gap-3 p-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-64" />
				<Skeleton className="h-48 w-full" />
			</div>
		)
	}

	const pat = patient as unknown as Record<string, unknown>

	const rightRail = (
		<>
			<MrnLinkingPanel
				patientId={patientId}
				currentMrn={pat.mrn as string | null}
			/>
			<ConsentManagementPanel patientId={patientId} />
			<EnrolledProgramsPanel patientId={patientId} />
			<AssignedDevicesPanel patientId={patientId} />
			<CrossFacilityPatientContextPanel patientId={patientId} />
			<RightRailPanel title="Quick Actions" storageKey={`actions-${patientId}`}>
				<div className="flex flex-col gap-1.5">
					<EditDemographicsModal patient={{ id: patientId, fullName: pat.fullName as string, dateOfBirth: pat.dateOfBirth as string, sex: pat.sex as string, ethnicity: pat.ethnicity as string | undefined, email: pat.email as string | undefined, phone: pat.phone as string | undefined }} />
				</div>
			</RightRailPanel>
		</>
	)

	return (
		<PatientProfileShell
			patientName={pat.fullName as string}
			mrn={pat.mrn as string | null}
			age={pat.dateOfBirth ? Math.floor((Date.now() - new Date(pat.dateOfBirth as string).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : undefined}
			sex={pat.sex as string | null}
			ethnicity={pat.ethnicity as string | null}
			emrUrl={pat.fhirResourceId ? `#emr/${pat.fhirResourceId}` : undefined}
			consentRestriction={consentData?.categories?.some(c => c.status === "withdrawn")}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			rightRail={rightRail}
			hiddenTabs={isTenantAdmin ? [] : ["audit", "consent"]}
		>
			{searchParams.get("merged") === "true" && (
				<div className="rounded bg-green-50 border border-green-200 p-2 text-xs text-green-800 mb-2">
					Records merged successfully.
				</div>
			)}
			{activeTab === "overview" ? (
				<div className="flex flex-col gap-4">
					<div className="rounded-md border p-4">
						<div className="flex items-center justify-between mb-3">
							<h3 className="font-semibold text-sm">Demographics</h3>
						</div>
						<div className="grid grid-cols-2 gap-y-2 text-sm">
							<span className="text-muted-foreground">Full name</span><span>{pat.fullName as string}</span>
							<span className="text-muted-foreground">Date of birth</span><span>{pat.dateOfBirth as string}</span>
							<span className="text-muted-foreground">Sex</span><span>{pat.sex as string ?? "—"}</span>
							<span className="text-muted-foreground">Ethnicity</span><span>{(pat.ethnicity as string) ?? "—"}</span>
						</div>
					</div>
					<div className="rounded-md border p-4">
						<h3 className="font-semibold text-sm mb-3">Contact</h3>
						<div className="grid grid-cols-2 gap-y-2 text-sm">
							<span className="text-muted-foreground">Email</span><span>{(pat.email as string) ?? "—"}</span>
							<span className="text-muted-foreground">Phone</span><span>{(pat.phone as string) ?? "—"}</span>
						</div>
					</div>
					<div className="rounded-md border p-4">
						<h3 className="font-semibold text-sm mb-3">HMO Coverage</h3>
						<div className="grid grid-cols-2 gap-y-2 text-sm">
							<span className="text-muted-foreground">Provider</span><span>{(pat.hmoProvider as string) ?? "—"}</span>
							<span className="text-muted-foreground">Card #</span><span className="font-mono text-xs">{(pat.hmoCardNumber as string) ?? "—"}</span>
						</div>
					</div>
					<div className="rounded-md border p-4">
						<h3 className="font-semibold text-sm mb-2">Recent Activity</h3>
						<div className="flex flex-col gap-2 text-sm">
							<div className="flex items-center gap-2">
								<span className="text-muted-foreground">Active cases</span>
								<span className="font-semibold">
									{casesData?.items?.filter(c => !["closed", "rejected"].includes(c.status)).length ?? 0}
								</span>
							</div>
							{(casesData?.items ?? []).slice(0, 3).map(c => (
								<div key={c.id} className="flex items-center justify-between text-xs rounded-md bg-muted/30 px-2 py-1.5">
									<span className="font-mono">{c.caseRef}</span>
									<span className="text-muted-foreground capitalize">{c.status.replace("_", " ")}</span>
								</div>
							))}
							{(casesData?.items ?? []).length === 0 && (
								<p className="text-muted-foreground text-xs">No cases found.</p>
							)}
						</div>
					</div>
				</div>
			) : activeTab === "communications" ? (
				<div className="flex flex-col gap-3">
					{consentData?.categories?.some(c => c.category === "communications" && c.status === "withdrawn") && (
						<div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm font-medium text-red-800">
							Communications consent withdrawn — outbound messaging is blocked for this patient.
						</div>
					)}
					<div className="bg-muted/20 rounded-md p-6 text-center text-sm text-muted-foreground">
						Communications content coming soon.
					</div>
				</div>
			) : activeTab === "audit" ? (
				<PatientAuditHistoryPanel patientId={patientId} />
			) : activeTab === "consent" ? (
				<ConsentHistoryPanel patientId={patientId} />
			) : (
				<div className="bg-muted/20 rounded-md p-6 text-center text-sm text-muted-foreground">
					{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content coming soon.
				</div>
			)}
		</PatientProfileShell>
	)
}
