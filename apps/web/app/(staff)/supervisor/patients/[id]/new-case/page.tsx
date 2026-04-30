import { NewCaseForm } from "@/features/supervisor-cases/components/new-case-form"

interface Props {
	params: Promise<{ id: string }>
}

export default async function SupervisorNewCasePage({ params }: Props) {
	const { id } = await params
	return <NewCaseForm patientId={id} />
}
