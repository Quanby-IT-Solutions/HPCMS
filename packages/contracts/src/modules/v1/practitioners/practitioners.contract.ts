import { oc } from "@orpc/contract"
import { z } from "zod"

import {
	PractitionerIdSchema,
	PractitionerListInputSchema,
	PractitionerSchema,
} from "./practitioners.schema.js"

export const practitionersContract = {
	list: oc
		.route({
			method: "GET",
			path: "/practitioners",
			summary: "List practitioners (staff only)",
			tags: ["Practitioners"],
		})
		.input(PractitionerListInputSchema)
		.output(z.array(PractitionerSchema)),

	get: oc
		.route({
			method: "GET",
			path: "/practitioners/{id}",
			summary: "Get practitioner by ID with FHIR data (staff only)",
			tags: ["Practitioners"],
		})
		.input(PractitionerIdSchema)
		.output(PractitionerSchema),
}
