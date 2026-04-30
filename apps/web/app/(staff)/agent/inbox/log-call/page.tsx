import { PhoneCallLogForm } from "@/features/agent-inbox/components/phone-call-log-form"

interface Props {
	searchParams: Promise<{ patient?: string }>
}

export default async function LogCallPage({ searchParams }: Props) {
	const { patient } = await searchParams
	return (
		<div className="flex flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">Log phone call</h1>
				<p className="text-muted-foreground text-sm">
					Captures a call into the inbox feed and the patient timeline.
				</p>
			</header>
			<PhoneCallLogForm defaultPatientId={patient ?? null} />
		</div>
	)
}
