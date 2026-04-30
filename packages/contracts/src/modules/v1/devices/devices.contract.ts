import { oc } from "@orpc/contract"

import {
	DevicesForPatientInputSchema,
	DevicesForPatientOutputSchema,
} from "./devices.schema.js"

export const devicesContract = {
	listForPatient: oc
		.route({
			method: "GET",
			path: "/devices/for-patient/{patientId}",
			summary: "Read-only assigned medical devices for a patient",
			tags: ["Devices"],
		})
		.input(DevicesForPatientInputSchema)
		.output(DevicesForPatientOutputSchema),
}
