"use client"

import { useState } from "react"

import { CaseDetailShell } from "@/features/supervisor-workspace/components/case-detail-shell"
import { PatientProfileShell } from "@/features/supervisor-workspace/components/patient-profile-shell"
import { RightRailPanel } from "@/features/supervisor-workspace/components/right-rail-panel"

export default function SupervisorDesignShowcasePage() {
	const [patientTab, setPatientTab] = useState<"overview" | "communications" | "cases" | "programs" | "devices" | "audit" | "consent">("overview")
	const [caseTab, setCaseTab] = useState<"overview" | "communications" | "notes" | "linked" | "claims">("overview")

	return (
		<div className="flex flex-col gap-8">
			<header>
				<h1 className="text-2xl font-bold">Design Showcase — Supervisor Workspace</h1>
				<p className="text-muted-foreground text-sm mt-1">Shell components + RightRailPanel variants</p>
			</header>

			<section>
				<h2 className="mb-3 text-lg font-semibold">PatientProfileShell</h2>
				<div className="overflow-hidden rounded-md border">
					<PatientProfileShell
						patientName="Maria Santos"
						mrn="MRN-20260001"
						age={42}
						sex="Female"
						ethnicity="Filipino"
						emrUrl="#"
						activeTab={patientTab}
						onTabChange={setPatientTab}
						rightRail={
							<>
								<RightRailPanel title="MRN & FHIR Sync" storageKey="showcase-mrn">
									<p className="text-muted-foreground text-sm">MRN: 20260001 · Synced 2h ago</p>
								</RightRailPanel>
								<RightRailPanel title="Consent" storageKey="showcase-consent">
									<p className="text-muted-foreground text-sm">3 categories granted</p>
								</RightRailPanel>
								<RightRailPanel title="Programs" storageKey="showcase-programs" isLoading={false}>
									<p className="text-muted-foreground text-sm">Enrolled in 1 program</p>
								</RightRailPanel>
							</>
						}
					>
						<div className="bg-muted/20 rounded-md p-6 text-center text-sm text-muted-foreground">
							Tab content for: <strong>{patientTab}</strong>
						</div>
					</PatientProfileShell>
				</div>
			</section>

			<section>
				<h2 className="mb-3 text-lg font-semibold">CaseDetailShell</h2>
				<div className="overflow-hidden rounded-md border">
					<CaseDetailShell
						caseRef="LOA-2026-00128"
						status="in_review"
						priority="high"
						slaMinutesRemaining={45}
						activeTab={caseTab}
						onTabChange={setCaseTab}
						rightRail={
							<>
								<RightRailPanel title="Assignment" storageKey="showcase-assign">
									<p className="text-muted-foreground text-sm">Assigned to: J. Reyes</p>
								</RightRailPanel>
								<RightRailPanel title="Escalation History" storageKey="showcase-esc">
									<p className="text-muted-foreground text-sm">No escalations</p>
								</RightRailPanel>
							</>
						}
					>
						<div className="bg-muted/20 rounded-md p-6 text-center text-sm text-muted-foreground">
							Tab content for: <strong>{caseTab}</strong>
						</div>
					</CaseDetailShell>
				</div>
			</section>

			<section>
				<h2 className="mb-3 text-lg font-semibold">RightRailPanel — variants</h2>
				<div className="grid gap-3 sm:grid-cols-2">
					<RightRailPanel title="Collapsed by default" storageKey="showcase-collapsed">
						<p className="text-sm">Panel body</p>
					</RightRailPanel>
					<RightRailPanel title="Loading state" storageKey="showcase-loading" isLoading>
						<p className="text-sm">Never shown</p>
					</RightRailPanel>
				</div>
			</section>
		</div>
	)
}
