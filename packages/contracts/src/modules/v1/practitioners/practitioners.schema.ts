import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

const nullableDateOrString = z
	.union([z.date(), z.string()])
	.nullable()
	.transform(v => (v ? (typeof v === "string" ? new Date(v) : v) : null))

export const PractitionerSchema = z.object({
	id: z.string(),
	tenantId: z.string().nullable(),
	fullName: z.string(),
	specialty: z.string().nullable(),
	licenseNo: z.string().nullable(),
	isActive: z.boolean(),
	fhirResourceId: z.string().nullable(),
	fhirSyncedAt: nullableDateOrString,
	createdAt: dateOrString,
	updatedAt: dateOrString,
	fhirData: z.unknown().nullable().optional(),
	fhirStale: z.boolean().optional(),
})

export type Practitioner = z.infer<typeof PractitionerSchema>

export const PractitionerIdSchema = z.object({
	id: z.string(),
})

export const PractitionerListInputSchema = z.object({
	specialty: z.string().optional(),
	query: z.string().optional(),
})
