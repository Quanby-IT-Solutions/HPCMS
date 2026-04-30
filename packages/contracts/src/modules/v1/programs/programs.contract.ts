import { oc } from "@orpc/contract"

import {
	ProgramsForPatientInputSchema,
	ProgramsForPatientOutputSchema,
} from "./programs.schema.js"

export const programsContract = {
	listForPatient: oc
		.route({
			method: "GET",
			path: "/programs/for-patient/{patientId}",
			summary: "Read-only enrolled programs for a patient",
			tags: ["Programs"],
		})
		.input(ProgramsForPatientInputSchema)
		.output(ProgramsForPatientOutputSchema),
}
