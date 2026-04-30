import { DeviceDetailPage } from "@/features/supervisor-devices/components/device-detail-page"

interface Props {
	params: Promise<{ id: string }>
}

export default async function SupervisorDeviceDetailPage({ params }: Props) {
	const { id } = await params
	return <DeviceDetailPage deviceId={id} />
}
