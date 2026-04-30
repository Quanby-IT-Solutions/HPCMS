import { oc } from "@orpc/contract"
import { z } from "zod"

import {
	PatientIdSchema,
	PatientRecentInputSchema,
	PatientRecentOutputSchema,
	PatientSchema,
	PatientSearchInputSchema,
	PatientTimelineInputSchema,
	PatientTimelineOutputSchema,
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

	recent: oc
		.route({
			method: "GET",
			path: "/patients/recent",
			summary: "Recent patients touched by the current agent",
			tags: ["Patients"],
		})
		.input(PatientRecentInputSchema)
		.output(PatientRecentOutputSchema),

	timeline: {
		list: oc
			.route({
				method: "GET",
				path: "/patients/{patientId}/timeline",
				summary: "Patient 360 chronological timeline across channels + cases + FHIR",
				tags: ["Patients"],
			})
			.input(PatientTimelineInputSchema)
			.output(PatientTimelineOutputSchema),
	},
}
