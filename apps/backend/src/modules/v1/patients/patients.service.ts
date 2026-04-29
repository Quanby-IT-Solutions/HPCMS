import { randomUUID } from "node:crypto"

import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import { and, eq, ilike, or } from "drizzle-orm"

import { patientUserLinks, patients, tenants, users } from "@repo/db/schema"

import { db, tenantDb } from "@/common/database/database.client"
import { NotificationsService } from "@/common/notifications/notifications.service"
import { env } from "@/config/env.config"
import { type V1Inputs } from "@/config/contract-types"

type VerifyMrnInput = V1Inputs["patient"]["verifyMrn"] & { userId: string }
type PatientGetInput = V1Inputs["patient"]["get"]
type PatientSearchInput = V1Inputs["patient"]["search"]

@Injectable()
export class PatientsService {
	private readonly logger = new Logger(PatientsService.name)

	constructor(private readonly notifications: NotificationsService) {}

	async me(userId: string) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const links = (await (db as any)
			.select({ patientId: patientUserLinks.patientId })
			.from(patientUserLinks)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((patientUserLinks as any).userId, userId))
			.limit(1)) as Array<{ patientId: string }>

		const link = links[0]
		if (!link) return null

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rows = (await (db as any)
			.select()
			.from(patients)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((patients as any).id, link.patientId))
			.limit(1)) as Array<typeof patients.$inferSelect>

		return rows[0] ?? null
	}

	async verifyMrn(input: VerifyMrnInput) {
		const { userId, mrn, dateOfBirth, lastName, switchTenantTo } = input
		const maxAttempts = env.MRN_VERIFY_MAX_ATTEMPTS
		const lockoutMs = env.MRN_VERIFY_LOCKOUT_MINUTES * 60 * 1000

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userRows = (await (db as any)
			.select()
			.from(users)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((users as any).id, userId))
			.limit(1)) as Array<typeof users.$inferSelect>
		const user = userRows[0]
		if (!user) throw new NotFoundException("User not found")

		// Check lockout
		if (user.mrnVerifyLockedUntil && user.mrnVerifyLockedUntil > new Date()) {
			return {
				outcome: "locked" as const,
				lockedUntilMs: user.mrnVerifyLockedUntil.getTime(),
			}
		}

		const currentTenantId = user.tenantId

		// Handle tenant-switch confirmation flow
		if (switchTenantTo) {
			const patient = await this.findPatientByMrn(switchTenantTo, mrn)
			if (!patient || !this.matchesDobAndLastName(patient, dateOfBirth, lastName)) {
				return this.incrementFailCount(userId, user.mrnVerifyFailedCount, maxAttempts, lockoutMs, currentTenantId)
			}
			await this.linkPatient(userId, switchTenantTo, patient.id)
			return { outcome: "linked" as const, patient }
		}

		// Search in current tenant first
		if (currentTenantId) {
			const patient = await this.findPatientByMrn(currentTenantId, mrn)
			if (patient) {
				if (this.matchesDobAndLastName(patient, dateOfBirth, lastName)) {
					await this.linkPatient(userId, currentTenantId, patient.id)
					return { outcome: "linked" as const, patient }
				}
				return this.incrementFailCount(userId, user.mrnVerifyFailedCount, maxAttempts, lockoutMs, currentTenantId)
			}
		}

		// Search other active tenants for facility-mismatch detection
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const allTenants = (await (db as any)
			.select({ id: tenants.id })
			.from(tenants)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((tenants as any).isActive, true))) as Array<{ id: string }>

		for (const t of allTenants) {
			if (t.id === currentTenantId) continue
			const patient = await this.findPatientByMrn(t.id, mrn)
			if (patient) {
				return { outcome: "facilityMismatch" as const, otherTenantId: t.id }
			}
		}

		// Not found anywhere
		return this.incrementFailCount(userId, user.mrnVerifyFailedCount, maxAttempts, lockoutMs, currentTenantId)
	}

	async findById(input: PatientGetInput) {
		const tenantCtx = tenantDb()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rows = (await tenantCtx
			.select(patients, eq((patients as any).id, input.id))
			.limit(1)) as Array<typeof patients.$inferSelect>

		const patient = rows[0]
		if (!patient) throw new NotFoundException(`Patient ${input.id} not found`)
		return patient
	}

	async search(input: PatientSearchInput) {
		const tenantCtx = tenantDb()
		const { query, limit } = input
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rows = (await tenantCtx
			.select(
				patients,
				or(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					ilike((patients as any).fullName, `%${query}%`),
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					ilike((patients as any).mrn, `${query}%`)
				)
			)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.limit(limit as any)) as Array<typeof patients.$inferSelect>
		return rows
	}

	private async findPatientByMrn(tenantId: string, mrn: string) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rows = (await (db as any)
			.select()
			.from(patients)
			.where(
				and(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					eq((patients as any).tenantId, tenantId),
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					eq((patients as any).mrn, mrn)
				)
			)
			.limit(1)) as Array<typeof patients.$inferSelect>
		return rows[0] ?? null
	}

	private matchesDobAndLastName(
		patient: typeof patients.$inferSelect,
		dateOfBirth: string,
		lastName: string
	): boolean {
		const dobMatch = patient.dateOfBirth === dateOfBirth
		const lastNameMatch = patient.lastName.toLowerCase() === lastName.toLowerCase()
		return dobMatch && lastNameMatch
	}

	private async linkPatient(userId: string, newTenantId: string, patientId: string) {
		// Update user's tenantId if it differs
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any)
			.update(users)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.set({ tenantId: newTenantId, mrnVerifyFailedCount: 0, mrnVerifyLockedUntil: null })
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((users as any).id, userId))

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any)
			.insert(patientUserLinks)
			.values({
				id: randomUUID(),
				patientId,
				userId,
				linkedAt: new Date(),
				verifiedMethod: "mrn_dob_lastname",
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.onConflictDoNothing()
	}

	private async incrementFailCount(
		userId: string,
		currentCount: number,
		maxAttempts: number,
		lockoutMs: number,
		tenantId: string | null
	) {
		const newCount = currentCount + 1
		const shouldLock = newCount >= maxAttempts
		const lockedUntil = shouldLock ? new Date(Date.now() + lockoutMs) : null

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any)
			.update(users)
			.set({
				mrnVerifyFailedCount: newCount,
				mrnVerifyLockedUntil: lockedUntil,
			})
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((users as any).id, userId))

		if (shouldLock && tenantId) {
			void this.notifySystemAdmins(tenantId, userId, lockedUntil!)
		}

		if (shouldLock && lockedUntil) {
			return { outcome: "locked" as const, lockedUntilMs: lockedUntil.getTime() }
		}

		return { outcome: "mismatch" as const, attemptsRemaining: maxAttempts - newCount }
	}

	private async notifySystemAdmins(tenantId: string, lockedUserId: string, lockedUntil: Date) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const admins = (await (db as any)
				.select({ id: users.id })
				.from(users)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.where(eq((users as any).role, "system_admin"))) as Array<{ id: string }>

			await Promise.all(
				admins.map(admin =>
					this.notifications.notify({
						userId: admin.id,
						tenantId,
						kind: "mrn_lockout",
						title: "MRN Verification Locked",
						body: `User ${lockedUserId} has been locked out after ${env.MRN_VERIFY_MAX_ATTEMPTS} failed MRN verification attempts. Locked until ${lockedUntil.toISOString()}.`,
					})
				)
			)
		} catch (err) {
			this.logger.error(`Failed to notify system admins of MRN lockout [userId=${lockedUserId}]`, err)
		}
	}
}
