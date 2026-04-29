import { z } from "zod"

export const FhirCodingSchema = z.object({
	system: z.string().optional(),
	code: z.string().optional(),
	display: z.string().optional(),
})

export const FhirIdentifierSchema = z.object({
	use: z.string().optional(),
	system: z.string().optional(),
	value: z.string(),
})

export const FhirHumanNameSchema = z.object({
	use: z.string().optional(),
	text: z.string().optional(),
	family: z.string().optional(),
	given: z.array(z.string()).optional(),
	prefix: z.array(z.string()).optional(),
	suffix: z.array(z.string()).optional(),
})

export const FhirContactPointSchema = z.object({
	system: z.enum(["phone", "fax", "email", "pager", "url", "sms", "other"]).optional(),
	value: z.string().optional(),
	use: z.string().optional(),
})

export const FhirAddressSchema = z.object({
	use: z.string().optional(),
	type: z.string().optional(),
	text: z.string().optional(),
	line: z.array(z.string()).optional(),
	city: z.string().optional(),
	district: z.string().optional(),
	state: z.string().optional(),
	postalCode: z.string().optional(),
	country: z.string().optional(),
})

export const FhirPatientSchema = z.object({
	resourceType: z.literal("Patient"),
	id: z.string(),
	identifier: z.array(FhirIdentifierSchema).optional(),
	name: z.array(FhirHumanNameSchema).optional(),
	birthDate: z.string().optional(),
	gender: z.enum(["male", "female", "other", "unknown"]).optional(),
	telecom: z.array(FhirContactPointSchema).optional(),
	address: z.array(FhirAddressSchema).optional(),
})

export type FhirPatient = z.infer<typeof FhirPatientSchema>
