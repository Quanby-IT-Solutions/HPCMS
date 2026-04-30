import { oc } from "@orpc/contract"

import {
	ChannelMutationOutputSchema,
	ChatListInputSchema,
	ChatListOutputSchema,
	ChatSendInputSchema,
	ChatSendOutputSchema,
	PhoneCallLogInputSchema,
	SocialCaptureInputSchema,
} from "./channels.schema.js"

export const channelsContract = {
	phone: {
		log: oc
			.route({
				method: "POST",
				path: "/channels/phone/log",
				summary: "Log a phone call into the inbox + patient timeline",
				tags: ["Channels"],
			})
			.input(PhoneCallLogInputSchema)
			.output(ChannelMutationOutputSchema),
	},

	social: {
		capture: oc
			.route({
				method: "POST",
				path: "/channels/social/capture",
				summary: "Capture an inbound social-media inquiry",
				tags: ["Channels"],
			})
			.input(SocialCaptureInputSchema)
			.output(ChannelMutationOutputSchema),
	},

	chat: {
		list: oc
			.route({
				method: "GET",
				path: "/channels/chat/{caseRef}",
				summary: "List portal chat messages for a case",
				tags: ["Channels"],
			})
			.input(ChatListInputSchema)
			.output(ChatListOutputSchema),

		send: oc
			.route({
				method: "POST",
				path: "/channels/chat/{caseRef}",
				summary: "Send a portal chat message",
				tags: ["Channels"],
			})
			.input(ChatSendInputSchema)
			.output(ChatSendOutputSchema),
	},
}
