import { NotificationDetailPage } from "@/features/portal-notifications/components/notification-detail-page"

interface Props {
	params: Promise<{ id: string }>
}

export default async function NotificationDetail({ params }: Props) {
	const { id } = await params
	return <NotificationDetailPage id={id} />
}
