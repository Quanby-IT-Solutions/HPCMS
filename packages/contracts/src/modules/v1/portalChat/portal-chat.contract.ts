import { oc } from "@orpc/contract"
import { z } from "zod"

import {
	PortalChatListThreadsOutputSchema,
	PortalChatSendMessageInputSchema,
	PortalChatSendMessageOutputSchema,
	PortalChatThreadDetailSchema,
	PortalChatThreadIdInputSchema,
} from "./portal-chat.schema.js"

export const portalChatContract = {
	listThreads: oc
		.route({
			method: "GET",
			path: "/portal-chat",
			summary: "List patient portal chat threads",
			tags: ["PortalChat"],
		})
		.input(z.object({}))
		.output(PortalChatListThreadsOutputSchema),

	getThread: oc
		.route({
			method: "GET",
			path: "/portal-chat/{threadId}",
			summary: "Get a portal chat thread with messages",
			tags: ["PortalChat"],
		})
		.input(PortalChatThreadIdInputSchema)
		.output(PortalChatThreadDetailSchema),

	sendMessage: oc
		.route({
			method: "POST",
			path: "/portal-chat/{threadId}/messages",
			summary: "Send a portal chat message",
			tags: ["PortalChat"],
		})
		.input(PortalChatSendMessageInputSchema)
		.output(PortalChatSendMessageOutputSchema),
}
