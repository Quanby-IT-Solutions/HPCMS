import { oc } from "@orpc/contract"
import { z } from "zod"

import {
	PatientIdSchema,
	PatientSchema,
	PatientSearchInputSchema,
	VerifyMrnInputSchema,
	VerifyMrnOutputSchema,
} from "./patients.schema.js"

export const patientsContract = {
	me: oc
		.route({
			method: "GET",
			path: "/patients/me",
			summary: "Get linked patient record for current user",
			tags: ["Patients"],
		})
		.output(PatientSchema.nullable()),

	verifyMrn: oc
		.route({
			method: "POST",
			path: "/patients/verify-mrn",
			summary: "Verify MRN and link patient record",
			tags: ["Patients"],
		})
		.input(VerifyMrnInputSchema)
		.output(VerifyMrnOutputSchema),

	search: oc
		.route({
			method: "GET",
			path: "/patients/search",
			summary: "Search patients by name or MRN prefix (staff only)",
			tags: ["Patients"],
		})
		.input(PatientSearchInputSchema)
		.output(z.array(PatientSchema)),

	get: oc
		.route({
			method: "GET",
			path: "/patients/{id}",
			summary: "Get patient by ID (staff only)",
			tags: ["Patients"],
		})
		.input(PatientIdSchema)
		.output(PatientSchema),
}
