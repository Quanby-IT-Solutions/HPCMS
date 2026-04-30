import { MergeConfirmationPage } from "@/features/supervisor-patients/components/merge-confirmation-page"

interface Props {
	params: Promise<{ id: string }>
	searchParams: Promise<{ with?: string }>
}

export default async function SupervisorPatientMergePage({ params, searchParams }: Props) {
	const { id } = await params
	const { with: supersededId } = await searchParams
	return <MergeConfirmationPage survivorId={id} supersededId={supersededId ?? ""} />
}
