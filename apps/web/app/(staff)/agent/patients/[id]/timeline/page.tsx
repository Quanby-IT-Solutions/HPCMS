import { PatientProfileHeader } from "@/features/agent-patients/components/patient-profile-header"
import { PatientTimeline } from "@/features/agent-patients/components/patient-timeline"

interface Props {
	params: Promise<{ id: string }>
}

export default async function AgentPatientTimelinePage({ params }: Props) {
	const { id } = await params
	return (
		<div className="flex flex-col gap-6">
			<PatientProfileHeader patientId={id} />
			<section>
				<h2 className="mb-3 text-lg font-semibold">Patient 360 Timeline</h2>
				<PatientTimeline patientId={id} />
			</section>
		</div>
	)
}
