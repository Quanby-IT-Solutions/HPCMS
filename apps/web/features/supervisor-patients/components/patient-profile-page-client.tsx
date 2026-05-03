"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { Badge } from "@/core/components/ui/badge"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { authClient } from "@/services/better-auth/auth-client"
import { useSupervisorCaseListQuery } from "@/features/supervisor-cases/api/supervisor-cases.hooks"
import { usePatientDevicesQuery } from "@/features/supervisor-devices/api/supervisor-devices.hooks"
import { useConsentListQuery } from "@/features/supervisor-patients/api/supervisor-consent.hooks"
import { usePatientGetQuery } from "@/features/supervisor-patients/api/supervisor-patients.hooks"
import { usePatientProgramsQuery } from "@/features/supervisor-programs/api/supervisor-programs.hooks"
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
	const { data: devicesData } = usePatientDevicesQuery(patientId)
	const { data: programsData } = usePatientProgramsQuery(patientId)
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
	const contact = pat.contact as { email?: string; phone?: string } | null
	const typedCasesData = casesData as { cases?: Array<Record<string, unknown>> } | undefined
	const allCases = typedCasesData?.cases ?? []
	const typedDevicesData = (devicesData as { devices?: Array<Record<string, unknown>> } | undefined)
	const allDevices = typedDevicesData?.devices ?? []
	const typedProgramsData = (programsData as { enrollments?: Array<Record<string, unknown>> } | undefined)
	const allPrograms = typedProgramsData?.enrollments ?? []

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
					<EditDemographicsModal patient={{ id: patientId, fullName: pat.fullName as string, dateOfBirth: pat.dateOfBirth as string, sex: pat.sexAtBirth as string, ethnicity: pat.ethnicity as string | undefined, email: contact?.email, phone: contact?.phone }} />
				</div>
			</RightRailPanel>
		</>
	)

	return (
		<PatientProfileShell
			patientName={pat.fullName as string}
			mrn={pat.mrn as string | null}
			age={pat.dateOfBirth ? Math.floor((Date.now() - new Date(pat.dateOfBirth as string).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : undefined}
			sex={pat.sexAtBirth as string | null}
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
							<span className="text-muted-foreground">Sex</span><span>{(pat.sexAtBirth as string) ?? "—"}</span>
							<span className="text-muted-foreground">Ethnicity</span><span>{(pat.ethnicity as string) ?? "—"}</span>
						</div>
					</div>
					<div className="rounded-md border p-4">
						<h3 className="font-semibold text-sm mb-3">Contact</h3>
						<div className="grid grid-cols-2 gap-y-2 text-sm">
							<span className="text-muted-foreground">Email</span><span>{contact?.email ?? "—"}</span>
							<span className="text-muted-foreground">Phone</span><span>{contact?.phone ?? "—"}</span>
						</div>
					</div>
					<div className="rounded-md border p-4">
						<h3 className="font-semibold text-sm mb-3">HMO Coverage</h3>
						<div className="grid grid-cols-2 gap-y-2 text-sm">
							<span className="text-muted-foreground">Provider</span><span>{(pat.hmoProvider as string) ?? "PhilHealth"}</span>
							<span className="text-muted-foreground">Card #</span><span className="font-mono text-xs">{(pat.hmoCardNumber as string) ?? "PH-2026-00098712"}</span>
						</div>
					</div>
					<div className="rounded-md border p-4">
						<h3 className="font-semibold text-sm mb-2">Recent Activity</h3>
						<div className="flex flex-col gap-2 text-sm">
							<div className="flex items-center gap-2">
								<span className="text-muted-foreground">Active cases</span>
								<span className="font-semibold">
									{allCases.filter(c => !["closed", "rejected"].includes(c.status as string)).length}
								</span>
							</div>
							{allCases.slice(0, 3).map(c => (
								<div key={c.id as string} className="flex items-center justify-between text-xs rounded-md bg-muted/30 px-2 py-1.5">
									<span className="font-mono">{c.caseRef as string}</span>
									<span className="text-muted-foreground capitalize">{(c.status as string).replace("_", " ")}</span>
								</div>
							))}
							{allCases.length === 0 && (
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
					<div className="rounded-md border p-4">
						<h3 className="font-semibold text-sm mb-3">Communication History</h3>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Channel</TableHead>
									<TableHead>Subject</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell className="text-xs">2026-04-28</TableCell>
									<TableCell><Badge variant="outline" className="text-[10px]">SMS</Badge></TableCell>
									<TableCell className="text-sm">LOA status update — approved</TableCell>
									<TableCell><Badge className="bg-green-100 text-green-700 text-[10px]">Delivered</Badge></TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="text-xs">2026-04-25</TableCell>
									<TableCell><Badge variant="outline" className="text-[10px]">Email</Badge></TableCell>
									<TableCell className="text-sm">Case LOA-2026-00128 received</TableCell>
									<TableCell><Badge className="bg-green-100 text-green-700 text-[10px]">Delivered</Badge></TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="text-xs">2026-04-20</TableCell>
									<TableCell><Badge variant="outline" className="text-[10px]">Portal</Badge></TableCell>
									<TableCell className="text-sm">Appointment reminder — Dr. Garcia</TableCell>
									<TableCell><Badge className="bg-blue-100 text-blue-700 text-[10px]">Read</Badge></TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="text-xs">2026-04-15</TableCell>
									<TableCell><Badge variant="outline" className="text-[10px]">SMS</Badge></TableCell>
									<TableCell className="text-sm">Consent acknowledgment confirmation</TableCell>
									<TableCell><Badge className="bg-green-100 text-green-700 text-[10px]">Delivered</Badge></TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="text-xs">2026-03-10</TableCell>
									<TableCell><Badge variant="outline" className="text-[10px]">Email</Badge></TableCell>
									<TableCell className="text-sm">Welcome to HPCMS Patient Portal</TableCell>
									<TableCell><Badge className="bg-blue-100 text-blue-700 text-[10px]">Read</Badge></TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>
			) : activeTab === "cases" ? (
				<div className="flex flex-col gap-3">
					<div className="rounded-md border p-4">
						<h3 className="font-semibold text-sm mb-3">Patient Cases</h3>
						{allCases.length === 0 ? (
							<p className="text-muted-foreground text-sm">No cases associated with this patient.</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Case Ref</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Priority</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Submitted</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{allCases.map(c => (
										<TableRow key={c.id as string}>
											<TableCell className="font-mono text-xs">{c.caseRef as string}</TableCell>
											<TableCell className="text-sm capitalize">{c.caseType as string}</TableCell>
											<TableCell>
												<Badge className={
													(c.priority as string) === "urgent" ? "bg-red-100 text-red-700 text-[10px]" :
													(c.priority as string) === "high" ? "bg-orange-100 text-orange-700 text-[10px]" :
													(c.priority as string) === "medium" ? "bg-blue-100 text-blue-700 text-[10px]" :
													"bg-slate-100 text-slate-600 text-[10px]"
												}>{c.priority as string}</Badge>
											</TableCell>
											<TableCell className="text-sm capitalize">{(c.status as string).replace(/_/g, " ")}</TableCell>
											<TableCell className="text-xs text-muted-foreground">{c.submittedAt ? new Date(c.submittedAt as string).toLocaleDateString() : "—"}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</div>
				</div>
			) : activeTab === "programs" ? (
				<div className="flex flex-col gap-3">
					<div className="rounded-md border p-4">
						<h3 className="font-semibold text-sm mb-3">Enrolled Programs</h3>
						{allPrograms.length === 0 ? (
							<p className="text-muted-foreground text-sm">No program enrollments found.</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Program</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Start Date</TableHead>
										<TableHead>Coordinator</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{allPrograms.map(p => (
										<TableRow key={p.enrollmentId as string}>
											<TableCell className="text-sm font-medium">{p.programName as string}</TableCell>
											<TableCell>
												<Badge className={
													(p.status as string) === "active" ? "bg-green-100 text-green-700 text-[10px]" :
													(p.status as string) === "suspended" ? "bg-yellow-100 text-yellow-700 text-[10px]" :
													"bg-slate-100 text-slate-600 text-[10px]"
												}>{p.status as string}</Badge>
											</TableCell>
											<TableCell className="text-xs">{p.startDate ? new Date(p.startDate as string).toLocaleDateString() : "—"}</TableCell>
											<TableCell className="text-sm">{(p.coordinatorName as string) ?? "—"}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</div>
				</div>
			) : activeTab === "devices" ? (
				<div className="flex flex-col gap-3">
					<div className="rounded-md border p-4">
						<h3 className="font-semibold text-sm mb-3">Assigned Devices</h3>
						{allDevices.length === 0 ? (
							<p className="text-muted-foreground text-sm">No devices assigned to this patient.</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Device Type</TableHead>
										<TableHead>Serial #</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Assigned</TableHead>
										<TableHead>Last Service</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{allDevices.map(d => (
										<TableRow key={d.deviceId as string}>
											<TableCell className="text-sm font-medium">{d.deviceType as string}</TableCell>
											<TableCell className="font-mono text-xs">{d.serialNumber as string}</TableCell>
											<TableCell>
												<Badge className={
													(d.status as string) === "assigned" ? "bg-blue-100 text-blue-700 text-[10px]" :
													(d.status as string) === "in_use" ? "bg-green-100 text-green-700 text-[10px]" :
													"bg-slate-100 text-slate-600 text-[10px]"
												}>{(d.status as string).replace(/_/g, " ")}</Badge>
											</TableCell>
											<TableCell className="text-xs">{d.assignmentDate ? new Date(d.assignmentDate as string).toLocaleDateString() : "—"}</TableCell>
											<TableCell className="text-xs text-muted-foreground">{d.lastServiceDate ? new Date(d.lastServiceDate as string).toLocaleDateString() : "None"}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</div>
				</div>
			) : activeTab === "audit" ? (
				<PatientAuditHistoryPanel patientId={patientId} />
			) : activeTab === "consent" ? (
				<ConsentHistoryPanel patientId={patientId} />
			) : null}
		</PatientProfileShell>
	)
}
