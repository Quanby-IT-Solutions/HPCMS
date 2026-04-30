import { oc } from "@orpc/contract"
import { z } from "zod"

import {
	ChatbotEscalateInputSchema,
	ChatbotEscalateOutputSchema,
	ChatbotSendMessageInputSchema,
	ChatbotSendMessageOutputSchema,
	ChatbotStartSessionOutputSchema,
} from "./chatbot.schema.js"

export const chatbotContract = {
	startSession: oc
		.route({
			method: "POST",
			path: "/chatbot/sessions",
			summary: "Start a new patient chatbot session",
			tags: ["Chatbot"],
		})
		.input(z.object({}))
		.output(ChatbotStartSessionOutputSchema),

	sendMessage: oc
		.route({
			method: "POST",
			path: "/chatbot/sessions/{sessionId}/messages",
			summary: "Send a chatbot message; receive bot replies",
			tags: ["Chatbot"],
		})
		.input(ChatbotSendMessageInputSchema)
		.output(ChatbotSendMessageOutputSchema),

	escalate: oc
		.route({
			method: "POST",
			path: "/chatbot/sessions/{sessionId}/escalate",
			summary: "Escalate the chatbot session to a live agent (returns chat thread)",
			tags: ["Chatbot"],
		})
		.input(ChatbotEscalateInputSchema)
		.output(ChatbotEscalateOutputSchema),
}
