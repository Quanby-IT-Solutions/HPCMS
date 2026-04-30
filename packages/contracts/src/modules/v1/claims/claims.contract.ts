import { oc } from "@orpc/contract"
import { z } from "zod"

import {
	AgingReportOutputSchema,
	ClaimHeaderSchema,
	ClaimIdInputSchema,
	ClaimLineSchema,
	ClaimMutationOutputSchema,
	ClaimsKpiSchema,
	ClaimsListInputSchema,
	ClaimsListOutputSchema,
	DrgRowSchema,
	DrgValidateInputSchema,
	DrgValidateOutputSchema,
	PayerSchema,
	ReorderDrgInputSchema,
	UpdateClaimStatusInputSchema,
	UpsertClaimHeaderInputSchema,
	UpsertClaimLineInputSchema,
	UpsertDrgRowInputSchema,
	XmlExportInputSchema,
	XmlExportOutputSchema,
} from "./claims.schema.js"

export const claimsContract = {
	headers: {
		list: oc
			.route({
				method: "GET",
				path: "/claims/headers",
				summary: "List claims with filters",
				tags: ["Claims"],
			})
			.input(ClaimsListInputSchema)
			.output(ClaimsListOutputSchema),

		get: oc
			.route({
				method: "GET",
				path: "/claims/headers/{claimId}",
				summary: "Get a single claim header",
				tags: ["Claims"],
			})
			.input(ClaimIdInputSchema)
			.output(ClaimHeaderSchema),

		upsert: oc
			.route({
				method: "POST",
				path: "/claims/headers",
				summary: "Create or update a claim header",
				tags: ["Claims"],
			})
			.input(UpsertClaimHeaderInputSchema)
			.output(ClaimMutationOutputSchema),
	},

	lines: {
		list: oc
			.route({
				method: "GET",
				path: "/claims/headers/{claimId}/lines",
				summary: "List line items for a claim",
				tags: ["Claims"],
			})
			.input(ClaimIdInputSchema)
			.output(z.object({ lines: z.array(ClaimLineSchema) })),

		upsert: oc
			.route({
				method: "POST",
				path: "/claims/headers/{claimId}/lines",
				summary: "Create or update a line item",
				tags: ["Claims"],
			})
			.input(UpsertClaimLineInputSchema)
			.output(ClaimMutationOutputSchema),

		delete: oc
			.route({
				method: "DELETE",
				path: "/claims/lines/{id}",
				summary: "Delete a line item",
				tags: ["Claims"],
			})
			.input(z.object({ id: z.string() }))
			.output(z.object({ id: z.string() })),
	},

	status: {
		update: oc
			.route({
				method: "POST",
				path: "/claims/headers/{claimId}/status",
				summary: "Transition a claim through its status workflow",
				tags: ["Claims"],
			})
			.input(UpdateClaimStatusInputSchema)
			.output(ClaimMutationOutputSchema),
	},

	dashboard: {
		kpis: oc
			.route({
				method: "GET",
				path: "/claims/dashboard/kpis",
				summary: "Top-level KPIs for the claims dashboard",
				tags: ["Claims"],
			})
			.output(ClaimsKpiSchema),
	},

	aging: {
		report: oc
			.route({
				method: "GET",
				path: "/claims/aging",
				summary: "Aging report grouped into 0-30/31-60/61-90/90+",
				tags: ["Claims"],
			})
			.output(AgingReportOutputSchema),
	},

	drg: {
		list: oc
			.route({
				method: "GET",
				path: "/claims/drg/{claimId}",
				summary: "Get DRG diagnoses + procedures for a claim",
				tags: ["Claims"],
			})
			.input(ClaimIdInputSchema)
			.output(
				z.object({
					diagnoses: z.array(DrgRowSchema),
					procedures: z.array(DrgRowSchema),
				})
			),

		upsert: oc
			.route({
				method: "POST",
				path: "/claims/drg",
				summary: "Create or update a DRG row",
				tags: ["Claims"],
			})
			.input(UpsertDrgRowInputSchema)
			.output(z.object({ id: z.string() })),

		reorder: oc
			.route({
				method: "POST",
				path: "/claims/drg/reorder",
				summary: "Reorder DRG rows within a kind",
				tags: ["Claims"],
			})
			.input(ReorderDrgInputSchema)
			.output(z.object({ ok: z.literal(true) })),

		validate: oc
			.route({
				method: "POST",
				path: "/claims/drg/validate",
				summary: "Validate DRG rows against PhilHealth rules",
				tags: ["Claims"],
			})
			.input(DrgValidateInputSchema)
			.output(DrgValidateOutputSchema),
	},

	xml: {
		cf5Generate: oc
			.route({
				method: "POST",
				path: "/claims/xml/cf5",
				summary: "Generate the PhilHealth CF5 XML for a claim",
				tags: ["Claims"],
			})
			.input(XmlExportInputSchema)
			.output(XmlExportOutputSchema),

		esoaGenerate: oc
			.route({
				method: "POST",
				path: "/claims/xml/esoa",
				summary: "Generate the eSOA XML for a claim",
				tags: ["Claims"],
			})
			.input(XmlExportInputSchema)
			.output(XmlExportOutputSchema),

		preview: oc
			.route({
				method: "GET",
				path: "/claims/xml/{claimId}",
				summary: "Preview the most recently generated XML for a claim",
				tags: ["Claims"],
			})
			.input(ClaimIdInputSchema)
			.output(XmlExportOutputSchema),
	},

	payers: {
		list: oc
			.route({
				method: "GET",
				path: "/claims/payers",
				summary: "List payers (and their coverages)",
				tags: ["Claims"],
			})
			.output(z.object({ payers: z.array(PayerSchema) })),
	},
}
