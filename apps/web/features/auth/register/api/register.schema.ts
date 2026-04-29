import { z } from "zod"

export const TENANT_IDS = ["QC", "BGC"] as const
export type TenantId = (typeof TENANT_IDS)[number]

export const RegisterSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.email("Please enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	tenantId: z.enum(TENANT_IDS, { error: "Please select a facility" }),
})

export type Register = z.infer<typeof RegisterSchema>
