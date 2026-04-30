"use client"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { ClinicianCard } from "@/features/clinician-sidebar/components/clinician-card"
import { ClinicianHeader } from "@/features/clinician-sidebar/components/clinician-header"
import { DenseInfoRow } from "@/features/clinician-sidebar/components/dense-info-row"
import { PopOutLink } from "@/features/clinician-sidebar/components/pop-out-link"

const samplePatient = {
	fullName: "Maria Santos",
	mrn: "PCMS-00421",
	age: 54,
	sex: "F" as const,
	hasAllergies: true,
}

const SYNC_TIMES = {
	loaCase: new Date(Date.now() - 1000 * 60 * 4),
	allergies: new Date(Date.now() - 1000 * 60 * 60 * 2),
}

function SidebarShell({ width }: { width: number }) {
	return (
		<div
			className="bg-card flex flex-col gap-3 overflow-hidden rounded-lg border shadow-sm"
			style={{ width: `${width}px` }}
		>
			<ClinicianHeader patient={samplePatient} />
			<div className="flex flex-col gap-3 px-3 pb-3">
				<ClinicianCard
					title="Active LOA Case"
					lastSyncedAt={SYNC_TIMES.loaCase}
					onRefresh={() => {}}
					headerAction={<Badge variant="secondary">In review</Badge>}
				>
					<dl className="divide-border divide-y">
						<DenseInfoRow label="Case ref" value="LOA-2026-00128" />
						<DenseInfoRow
							label="Assigned"
							value="J. Reyes"
							sub="Case Agent · responded 2h ago"
						/>
						<DenseInfoRow label="Opened" value="Apr 27, 2026" />
						<DenseInfoRow
							label="Latest update"
							value="Awaiting clinician sign-off"
							sub="Internal note from supervisor"
						/>
					</dl>
					<div className="mt-3 flex items-center justify-between">
						<PopOutLink to="/staff/cases/LOA-2026-00128" caseRef="LOA-2026-00128">
							View full case
						</PopOutLink>
						<Button variant="outline" size="sm">
							Add note
						</Button>
					</div>
				</ClinicianCard>

				<ClinicianCard
					title="Allergies"
					lastSyncedAt={SYNC_TIMES.allergies}
					onRefresh={() => {}}
				>
					<dl className="divide-border divide-y">
						<DenseInfoRow label="Penicillin" value="Severe" sub="Anaphylaxis · 2019" />
						<DenseInfoRow label="Latex" value="Moderate" sub="Contact dermatitis" />
					</dl>
				</ClinicianCard>

				<ClinicianCard title="Empty section example" lastSyncedAt={null}>
					<p className="text-muted-foreground text-xs italic">Not available in EMR.</p>
				</ClinicianCard>
			</div>
		</div>
	)
}

export default function ClinicianDesignShowcasePage() {
	return (
		<main className="bg-muted/30 flex min-h-screen w-full max-w-none flex-col gap-6 p-6">
			<header>
				<h1 className="text-lg font-semibold">Clinician sidebar primitives</h1>
				<p className="text-muted-foreground text-xs">
					CL-FE-02 design showcase. Renders at the two target widths (360px and 480px).
				</p>
			</header>

			<section className="flex flex-wrap items-start gap-6">
				<div className="flex flex-col gap-2">
					<p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
						360px
					</p>
					<SidebarShell width={360} />
				</div>
				<div className="flex flex-col gap-2">
					<p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
						480px
					</p>
					<SidebarShell width={480} />
				</div>
			</section>
		</main>
	)
}
