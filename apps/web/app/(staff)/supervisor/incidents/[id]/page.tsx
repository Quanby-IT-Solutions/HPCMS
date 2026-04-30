import { IncidentDetailPage } from "@/features/supervisor-incidents/components/incident-detail-page"

interface Props {
	params: Promise<{ id: string }>
}

export default async function SupervisorIncidentDetailPage({ params }: Props) {
	const { id } = await params
	return <IncidentDetailPage incidentId={id} />
}
