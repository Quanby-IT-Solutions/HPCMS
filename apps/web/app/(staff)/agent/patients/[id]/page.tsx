import Link from "next/link"

import { PatientProfileHeader } from "@/features/agent-patients/components/patient-profile-header"
import { ProgramsAndDevicesPanel } from "@/features/agent-patients/components/programs-and-devices-panel"

interface Props {
	params: Promise<{ id: string }>
}

export default async function AgentPatientProfilePage({ params }: Props) {
	const { id } = await params
	return (
		<div className="flex flex-col gap-6">
			<PatientProfileHeader patientId={id} />

			<section className="flex flex-wrap items-center gap-2">
				<Link
					href={`/agent/inbox/log-call?patient=${id}`}
					className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
				>
					Log call
				</Link>
				<Link
					href={`/agent/inbox/log-social?patient=${id}`}
					className="border-border hover:bg-muted inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium"
				>
					Capture social inquiry
				</Link>
				<Link
					href={`/agent/cases?createForPatient=${id}`}
					className="border-border hover:bg-muted inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium"
				>
					Create case
				</Link>
				<Link
					href={`/agent/patients/${id}/timeline`}
					className="border-border hover:bg-muted inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium"
				>
					Open timeline
				</Link>
			</section>

			<section className="grid gap-4 lg:grid-cols-2">
				<ProgramsAndDevicesPanel patientId={id} kind="programs" />
				<ProgramsAndDevicesPanel patientId={id} kind="devices" />
			</section>
		</div>
	)
}
