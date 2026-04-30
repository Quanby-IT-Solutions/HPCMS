import { oc } from "@orpc/contract"

import { CodeLookupInputSchema, CodeLookupOutputSchema } from "./codes.schema.js"

export const codesContract = {
	lookup: oc
		.route({
			method: "GET",
			path: "/codes/lookup",
			summary: "Lookup ICD-10 / PHIC-CPT / LOINC / NDC codes by query",
			tags: ["Codes"],
		})
		.input(CodeLookupInputSchema)
		.output(CodeLookupOutputSchema),
}
