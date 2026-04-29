import "dotenv/config"

import { hashPassword } from "better-auth/crypto"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import {
	accounts,
	caseSequences,
	healthcareCases,
	patientUserLinks,
	patients,
	practitioners,
	schema,
	tenants,
	users,
} from "./schema/index.js"

const DEV_PASSWORD = "DevPass123!"
const TENANT_ID = "seed-tenant-hpcms"

const SEED_USERS = [
	{ id: "seed-u-sysadmin", name: "System Admin", email: "system@hpcms.local", role: "system_admin" as const, tenantId: null },
	{ id: "seed-u-admin", name: "Tenant Admin", email: "admin@hpcms.local", role: "tenant_admin" as const, tenantId: TENANT_ID },
	{ id: "seed-u-supervisor", name: "Ana Reyes", email: "supervisor@hpcms.local", role: "case_supervisor" as const, tenantId: TENANT_ID },
	{ id: "seed-u-agent", name: "Carlo Bautista", email: "agent@hpcms.local", role: "case_agent" as const, tenantId: TENANT_ID },
	{ id: "seed-u-clinician", name: "Dr. Juan Dela Cruz", email: "clinician@hpcms.local", role: "clinician" as const, tenantId: TENANT_ID },
	{ id: "seed-u-patient", name: "Maria Santos", email: "patient@hpcms.local", role: "patient" as const, tenantId: TENANT_ID },
]

async function seedDatabase() {
	const connectionString = process.env.DATABASE_URL
	if (!connectionString) throw new Error("DATABASE_URL environment variable is not set")

	const pool = new Pool({ connectionString })
	const db = drizzle({ client: pool, schema })
	const now = new Date()

	const hashed = await hashPassword(DEV_PASSWORD)

	await db
		.insert(tenants)
		.values({ id: TENANT_ID, code: "hpcms", name: "HPCMS Hospital", isActive: true, createdAt: now, updatedAt: now })
		.onConflictDoUpdate({ target: tenants.id, set: { name: "HPCMS Hospital", isActive: true, updatedAt: now } })

	for (const u of SEED_USERS) {
		await db
			.insert(users)
			.values({ id: u.id, name: u.name, email: u.email, emailVerified: true, role: u.role, tenantId: u.tenantId, createdAt: now, updatedAt: now })
			.onConflictDoUpdate({ target: users.id, set: { name: u.name, email: u.email, emailVerified: true, role: u.role, tenantId: u.tenantId, updatedAt: now } })

		await db
			.insert(accounts)
			.values({ id: `acc-${u.id}`, accountId: u.id, providerId: "credential", userId: u.id, password: hashed, createdAt: now, updatedAt: now })
			.onConflictDoUpdate({ target: [accounts.providerId, accounts.accountId], set: { password: hashed, updatedAt: now } })
	}

	await db
		.insert(practitioners)
		.values({ id: "seed-prac-001", tenantId: TENANT_ID, fullName: "Dr. Juan Dela Cruz", specialty: "Internal Medicine", licenseNo: "PRC-2024-12345", isActive: true, createdAt: now, updatedAt: now })
		.onConflictDoUpdate({ target: practitioners.id, set: { updatedAt: now } })

	await db
		.insert(patients)
		.values([
			{ id: "seed-pat-001", tenantId: TENANT_ID, mrn: "HPCMS-MRN-001", fullName: "Maria Santos", lastName: "Santos", sexAtBirth: "female", dateOfBirth: "1985-07-22", dataPrivacyActAcknowledged: true, dataSharingWithEmrConsent: true, createdAt: now, updatedAt: now },
			{ id: "seed-pat-002", tenantId: TENANT_ID, mrn: "HPCMS-MRN-002", fullName: "Pedro Cruz", lastName: "Cruz", sexAtBirth: "male", dateOfBirth: "1972-03-15", dataPrivacyActAcknowledged: true, dataSharingWithEmrConsent: false, createdAt: now, updatedAt: now },
		])
		.onConflictDoUpdate({ target: patients.id, set: { updatedAt: now } })

	await db
		.insert(patientUserLinks)
		.values({ id: "seed-link-001", patientId: "seed-pat-001", userId: "seed-u-patient", verifiedMethod: "mrn_dob_lastname", createdAt: now, updatedAt: now })
		.onConflictDoUpdate({ target: patientUserLinks.id, set: { updatedAt: now } })

	await db
		.insert(caseSequences)
		.values({ tenantId: TENANT_ID, lastValue: 1000, createdAt: now, updatedAt: now })
		.onConflictDoUpdate({ target: caseSequences.tenantId, set: { updatedAt: now } })

	await db
		.insert(healthcareCases)
		.values([
			{ id: "seed-case-001", tenantId: TENANT_ID, caseRef: "HPCMS-1001", caseType: "loa", status: "submitted", priority: "medium", sourceChannel: "portal", patientId: "seed-pat-001", practitionerId: "seed-prac-001", assignedUserId: null, submittedAt: now, createdAt: now, updatedAt: now },
			{ id: "seed-case-002", tenantId: TENANT_ID, caseRef: "HPCMS-1002", caseType: "loa", status: "in_review", priority: "high", sourceChannel: "portal", patientId: "seed-pat-002", practitionerId: "seed-prac-001", assignedUserId: "seed-u-agent", submittedAt: new Date(now.getTime() - 86_400_000), inReviewAt: now, createdAt: now, updatedAt: now },
			{ id: "seed-case-003", tenantId: TENANT_ID, caseRef: "HPCMS-1003", caseType: "loa", status: "approved", priority: "low", sourceChannel: "portal", patientId: "seed-pat-001", practitionerId: "seed-prac-001", assignedUserId: "seed-u-supervisor", submittedAt: new Date(now.getTime() - 172_800_000), inReviewAt: new Date(now.getTime() - 86_400_000), resolvedAt: now, outcome: "Approved for LOA", createdAt: now, updatedAt: now },
		])
		.onConflictDoUpdate({ target: healthcareCases.id, set: { updatedAt: now } })

	console.log(`\nSeeded HPCMS dev database:`)
	console.log(`  Tenant      : HPCMS Hospital`)
	console.log(`  Password    : ${DEV_PASSWORD} (all users)`)
	console.log(`  Users (${SEED_USERS.length})  :`)
	for (const u of SEED_USERS) {
		console.log(`    ${u.email.padEnd(30)} [${u.role}]`)
	}
	console.log(`  Patients    : 2 (Maria Santos MRN-001, Pedro Cruz MRN-002)`)
	console.log(`  Practitioners: 1 (Dr. Juan Dela Cruz)`)
	console.log(`  Cases       : 3 (submitted, in_review, approved)\n`)

	await pool.end()
}

void seedDatabase().catch(error => {
	console.error("Database seeding failed.")
	console.error(error)
	process.exitCode = 1
})
