import { oc } from "@orpc/contract"

import { SignDownloadInputSchema, SignDownloadOutputSchema } from "./attachments.schema.js"

export const attachmentsContract = {
	signDownload: oc
		.route({
			method: "GET",
			path: "/attachments/sign-download",
			summary: "Get signed download URL for a case attachment",
			tags: ["Attachments"],
		})
		.input(SignDownloadInputSchema)
		.output(SignDownloadOutputSchema),
}
