import { oc } from "@orpc/contract"

import {
	AddNoteInputSchema,
	AllergiesOutputSchema,
	CarePlansOutputSchema,
	ClinicianCaseSummaryInputSchema,
	ClinicianCaseSummaryOutputSchema,
	ClinicianMutationOutputSchema,
	DiagnosticsOutputSchema,
	FlagCaseInputSchema,
	ImmunizationsOutputSchema,
	LaunchValidateInputSchema,
	LaunchValidateOutputSchema,
	MedicationsOutputSchema,
	ObservationsOutputSchema,
	PatientIdInputSchema,
} from "./clinician.schema.js"

export const clinicianContract = {
	launch: {
		validate: oc
			.route({
				method: "POST",
				path: "/clinician/launch/validate",
				summary: "Exchange SMART launch authorization code for a PCMS clinician session",
				tags: ["Clinician"],
			})
			.input(LaunchValidateInputSchema)
			.output(LaunchValidateOutputSchema),
	},

	summary: {
		get: oc
			.route({
				method: "GET",
				path: "/clinician/summary/{patientId}",
				summary: "Get aggregated PCMS case summary for a launched patient",
				tags: ["Clinician"],
			})
			.input(ClinicianCaseSummaryInputSchema)
			.output(ClinicianCaseSummaryOutputSchema),
	},

	notes: {
		create: oc
			.route({
				method: "POST",
				path: "/clinician/notes",
				summary: "Add a clinical note to a case from the sidebar",
				tags: ["Clinician"],
			})
			.input(AddNoteInputSchema)
			.output(ClinicianMutationOutputSchema),

		flag: oc
			.route({
				method: "POST",
				path: "/clinician/notes/flag",
				summary: "Flag a case for coordinator attention",
				tags: ["Clinician"],
			})
			.input(FlagCaseInputSchema)
			.output(ClinicianMutationOutputSchema),
	},

	enrichment: {
		allergies: oc
			.route({
				method: "GET",
				path: "/clinician/enrichment/{patientId}/allergies",
				summary: "FHIR-enriched AllergyIntolerance for a patient",
				tags: ["Clinician"],
			})
			.input(PatientIdInputSchema)
			.output(AllergiesOutputSchema),

		medications: oc
			.route({
				method: "GET",
				path: "/clinician/enrichment/{patientId}/medications",
				summary: "FHIR-enriched Medication + MedicationRequest",
				tags: ["Clinician"],
			})
			.input(PatientIdInputSchema)
			.output(MedicationsOutputSchema),

		immunizations: oc
			.route({
				method: "GET",
				path: "/clinician/enrichment/{patientId}/immunizations",
				summary: "FHIR-enriched Immunization records",
				tags: ["Clinician"],
			})
			.input(PatientIdInputSchema)
			.output(ImmunizationsOutputSchema),

		observations: oc
			.route({
				method: "GET",
				path: "/clinician/enrichment/{patientId}/observations",
				summary: "FHIR-enriched Observation (vitals + key labs)",
				tags: ["Clinician"],
			})
			.input(PatientIdInputSchema)
			.output(ObservationsOutputSchema),

		carePlans: oc
			.route({
				method: "GET",
				path: "/clinician/enrichment/{patientId}/care-plans",
				summary: "FHIR-enriched CarePlan + Goal",
				tags: ["Clinician"],
			})
			.input(PatientIdInputSchema)
			.output(CarePlansOutputSchema),

		diagnostics: oc
			.route({
				method: "GET",
				path: "/clinician/enrichment/{patientId}/diagnostics",
				summary: "FHIR-enriched DiagnosticReport",
				tags: ["Clinician"],
			})
			.input(PatientIdInputSchema)
			.output(DiagnosticsOutputSchema),
	},
}
