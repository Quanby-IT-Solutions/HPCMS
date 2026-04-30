import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

const nullableDateOrString = z
	.union([z.date(), z.string()])
	.nullable()
	.transform(v => (v ? (typeof v === "string" ? new Date(v) : v) : null))

export const ProgramEnrollmentSchema = z.object({
	id: z.string(),
	programName: z.string(),
	status: z.enum(["enrolled", "completed", "withdrawn", "pending"]),
	enrolledAt: dateOrString,
	endedAt: nullableDateOrString,
	coordinatorName: z.string().nullable(),
	notes: z.string().nullable(),
})
export type ProgramEnrollment = z.infer<typeof ProgramEnrollmentSchema>

export const ProgramsForPatientInputSchema = z.object({ patientId: z.string() })
export const ProgramsForPatientOutputSchema = z.object({
	enrollments: z.array(ProgramEnrollmentSchema),
})
