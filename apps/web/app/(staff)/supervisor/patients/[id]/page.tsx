import { PatientProfilePageClient } from "@/features/supervisor-patients/components/patient-profile-page-client"

interface Props {
	params: Promise<{ id: string }>
}

export default async function SupervisorPatientProfilePage({ params }: Props) {
	const { id } = await params
	return <PatientProfilePageClient patientId={id} />
}
