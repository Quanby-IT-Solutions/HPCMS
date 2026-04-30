import { oc } from "@orpc/contract"

import { SendOutboundInputSchema, SendOutboundOutputSchema } from "./outbound.schema.js"

export const outboundContract = {
	send: oc
		.route({
			method: "POST",
			path: "/outbound/send",
			summary: "Send an outbound message on behalf of a case",
			tags: ["Outbound"],
		})
		.input(SendOutboundInputSchema)
		.output(SendOutboundOutputSchema),
}
