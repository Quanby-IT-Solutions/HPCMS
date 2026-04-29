import { z } from "zod"

import { FhirAddressSchema, FhirContactPointSchema, FhirHumanNameSchema, FhirIdentifierSchema } from "./patient.js"

export const FhirCodeableConceptSchema = z.object({
	coding: z
		.array(
			z.object({
				system: z.string().optional(),
				code: z.string().optional(),
				display: z.string().optional(),
			})
		)
		.optional(),
	text: z.string().optional(),
})

export const FhirPractitionerQualificationSchema = z.object({
	identifier: z.array(FhirIdentifierSchema).optional(),
	code: FhirCodeableConceptSchema,
	issuer: z
		.object({
			reference: z.string().optional(),
			display: z.string().optional(),
		})
		.optional(),
})

export const FhirPractitionerSchema = z.object({
	resourceType: z.literal("Practitioner"),
	id: z.string(),
	identifier: z.array(FhirIdentifierSchema).optional(),
	name: z.array(FhirHumanNameSchema).optional(),
	telecom: z.array(FhirContactPointSchema).optional(),
	address: z.array(FhirAddressSchema).optional(),
	gender: z.enum(["male", "female", "other", "unknown"]).optional(),
	birthDate: z.string().optional(),
	qualification: z.array(FhirPractitionerQualificationSchema).optional(),
	specialty: z.array(FhirCodeableConceptSchema).optional(),
})

export type FhirPractitioner = z.infer<typeof FhirPractitionerSchema>
