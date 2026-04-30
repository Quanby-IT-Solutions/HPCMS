"use client"

import { toast } from "sonner"

import { Badge } from "@/core/components/ui/badge"
import { usePatientGetQuery } from "@/features/agent-patients/api/patients.hooks"
import { useSendOutboundMutation } from "@/features/agent-inbox/api/outbound.hooks"
import { ChannelBadge } from "@/features/agent-ux/components/channel-badge"
import { MessageComposer } from "@/features/agent-ux/components/message-composer"

interface PastCommunication {
	id: string
	channel: "email" | "phone" | "portal_chat" | "social_media"
	direction: "inbound" | "outbound"
	subject: string
	preview: string
	at: Date
}

interface Props {
	caseRef: string
	patientId: string
}

const MOCK_COMMS_BUILDER: () => PastCommunication[] = () => [
	{
		id: "c-1",
		channel: "email",
		direction: "inbound",
		subject: "LOA follow-up: HMO requesting documents",
		preview: "Hi, the HMO replied saying they need additional supporting documents…",
		at: new Date(Date.now() - 30 * 60 * 1000),
	},
	{
		id: "c-2",
		channel: "phone",
		direction: "outbound",
		subject: "Outbound call to HMO",
		preview: "Confirmed receipt; pending review with confirmation #PH-12-9988.",
		at: new Date(Date.now() - 6 * 60 * 60 * 1000),
	},
	{
		id: "c-3",
		channel: "portal_chat",
		direction: "outbound",
		subject: "Update sent via portal",
		preview: "Hi Maria, just wanted to share that we've forwarded your supporting…",
		at: new Date(Date.now() - 26 * 60 * 60 * 1000),
	},
]

export function CaseCommunicationsTab({ caseRef, patientId }: Props) {
	const send = useSendOutboundMutation()
	const comms = MOCK_COMMS_BUILDER()
	const patient = usePatientGetQuery(patientId).data
	// Pre-send consent gate. SUP-BE-12 ensureConsent will replace this once it lands.
	const consentWarning =
		patient && patient.marketingCommsConsent === false
			? "Patient has not granted outbound-comms consent (marketingCommsConsent=false). Resolve consent before sending."
			: null

	return (
		<div className="flex flex-col gap-4">
			<section className="flex flex-col gap-2">
				<h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
					Past communications
				</h3>
				<ul className="flex flex-col gap-2">
					{comms.map(c => (
						<li
							key={c.id}
							className="flex items-start justify-between gap-3 rounded-md border p-3"
						>
							<div className="flex min-w-0 flex-col gap-1">
								<div className="flex items-center gap-2">
									<ChannelBadge channel={c.channel} />
									<Badge variant="outline" className="capitalize">
										{c.direction}
									</Badge>
								</div>
								<p className="text-sm font-medium">{c.subject}</p>
								<p className="text-muted-foreground line-clamp-2 text-xs">{c.preview}</p>
							</div>
							<span className="text-muted-foreground text-[10px] tabular-nums">
								{c.at.toLocaleString()}
							</span>
						</li>
					))}
				</ul>
			</section>

			<section className="flex flex-col gap-2">
				<h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
					Compose outbound
				</h3>
				<MessageComposer
					templates={[
						{
							key: "loa_status_update",
							label: "LOA status update",
							subject: `Update on case ${caseRef}`,
							body: "Hi, we wanted to give you a quick update on your LOA request…",
						},
					]}
					isPending={send.isPending}
					consentWarning={consentWarning}
					onSend={async value => {
						try {
							await send.mutateAsync({
								channel: value.channel,
								caseRef,
								to: [value.to],
								subject: value.subject,
								bodyHtml: `<p>${value.body}</p>`,
								bodyText: value.body,
								templateKey: value.templateKey,
								attachments: [],
							})
							toast.success(`Sent via ${value.channel}`)
						} catch (err) {
							toast.error("Could not send", { description: (err as Error).message })
						}
					}}
				/>
				<p className="text-muted-foreground text-[10px] italic">
					Sent messages append to this thread + the patient 360 timeline. Patient ID:{" "}
					<code>{patientId}</code>
				</p>
			</section>
		</div>
	)
}
