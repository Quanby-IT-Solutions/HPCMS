import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

const nullableDateOrString = z
	.union([z.date(), z.string()])
	.nullable()
	.transform(v => (v ? (typeof v === "string" ? new Date(v) : v) : null))

export const AssignedDeviceSchema = z.object({
	id: z.string(),
	deviceType: z.string(),
	model: z.string().nullable(),
	serialNumber: z.string().nullable(),
	status: z.enum(["active", "returned", "lost", "maintenance"]),
	assignedAt: dateOrString,
	returnedAt: nullableDateOrString,
	notes: z.string().nullable(),
})
export type AssignedDevice = z.infer<typeof AssignedDeviceSchema>

export const DevicesForPatientInputSchema = z.object({ patientId: z.string() })
export const DevicesForPatientOutputSchema = z.object({
	devices: z.array(AssignedDeviceSchema),
})
