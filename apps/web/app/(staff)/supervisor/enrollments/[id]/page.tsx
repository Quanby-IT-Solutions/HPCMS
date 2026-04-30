import { EnrollmentDetailPage } from "@/features/supervisor-programs/components/enrollment-detail-page"

interface Props {
	params: Promise<{ id: string }>
}

export default async function SupervisorEnrollmentDetailPage({ params }: Props) {
	const { id } = await params
	return <EnrollmentDetailPage enrollmentId={id} />
}
