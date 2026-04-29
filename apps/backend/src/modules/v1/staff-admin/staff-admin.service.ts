import { randomUUID } from "node:crypto"

import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common"
import { and, count, eq, gte, ilike, lte, or, sql } from "drizzle-orm"

import { auditLogs, users, verifications } from "@repo/db/schema"

import { db, tenantDb } from "@/common/database/database.client"
import { EmailService } from "@/common/email/email.service"
import { env } from "@/config/env.config"
import { type V1Inputs } from "@/config/contract-types"

type ListUsersInput = V1Inputs["staffAdmin"]["users"]["list"]
type InviteUserInput = V1Inputs["staffAdmin"]["users"]["invite"]
type SetRoleInput = V1Inputs["staffAdmin"]["users"]["setRole"]
type ListAuditInput = V1Inputs["staffAdmin"]["audit"]["list"]

@Injectable()
export class StaffAdminService {
	constructor(private readonly emailService: EmailService) {}

	private async resolveActor(actorUserId: string) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rows = (await (db as any)
			.select({ id: users.id, role: users.role, tenantId: users.tenantId })
			.from(users)
			.where(eq(users.id, actorUserId))
			.limit(1)) as Array<{ id: string; role: string; tenantId: string | null }>
		const actor = rows[0]
		if (!actor) throw new ForbiddenException("Actor not found")
		return actor
	}

	async listUsers(input: ListUsersInput) {
		const ctx = tenantDb()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const page = (input as any).page as number
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const limit = (input as any).limit as number
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const role = (input as any).role as string | undefined
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const query = (input as any).query as string | undefined
		const offset = (page - 1) * limit

		const conditions = [eq(users.tenantId, ctx.tenantId)]
		if (role) conditions.push(eq(users.role, role as typeof users.role._.data))
		if (query) {
			conditions.push(
				or(ilike(users.name, `%${query}%`), ilike(users.email, `%${query}%`))!,
			)
		}

		const where = and(...conditions)

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const [items, totals] = await Promise.all([
			(db as any)
				.select({
					id: users.id,
					name: users.name,
					email: users.email,
					emailVerified: users.emailVerified,
					role: users.role,
					tenantId: users.tenantId,
					createdAt: users.createdAt,
					updatedAt: users.updatedAt,
				})
				.from(users)
				.where(where)
				.orderBy(sql`${users.createdAt} DESC`)
				.limit(limit)
				.offset(offset),
			(db as any).select({ total: count() }).from(users).where(where),
		]) as [Array<typeof users.$inferSelect>, Array<{ total: number }>]

		return { items, total: Number(totals[0]?.total ?? 0), page, limit }
	}

	async inviteUser(input: InviteUserInput, actorUserId: string) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const email = (input as any).email as string
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const role = (input as any).role as string
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const explicitTenantId = (input as any).tenantId as string | undefined

		const actor = await this.resolveActor(actorUserId)

		if (role === "system_admin" && actor.role !== "system_admin") {
			throw new ForbiddenException("Only system_admin can grant system_admin role")
		}

		const effectiveTenantId =
			actor.role === "system_admin" && explicitTenantId
				? explicitTenantId
				: (actor.tenantId ?? "")

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const existing = (await (db as any)
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, email))
			.limit(1)) as Array<{ id: string }>

		if (existing.length > 0) throw new ConflictException("User with this email already exists")

		const userId = randomUUID()
		const now = new Date()

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any).insert(users).values({
			id: userId,
			name: email.split("@")[0] ?? email,
			email,
			emailVerified: false,
			role: role as typeof users.role._.data,
			tenantId: effectiveTenantId,
			createdAt: now,
			updatedAt: now,
		})

		const token = randomUUID()
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any).insert(verifications).values({
			identifier: email,
			value: token,
			expiresAt,
			createdAt: now,
			updatedAt: now,
		})

		const verifyUrl = `${env.WEB_APP_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`
		await this.emailService.send("verification", email, { name: email, url: verifyUrl })

		return { userId, email }
	}

	async setRole(input: SetRoleInput, actorUserId: string) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userId = (input as any).userId as string
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const role = (input as any).role as string

		const actor = await this.resolveActor(actorUserId)

		if (role === "system_admin" && actor.role !== "system_admin") {
			throw new ForbiddenException("Only system_admin can grant system_admin role")
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rows = (await (db as any)
			.select({ id: users.id, tenantId: users.tenantId })
			.from(users)
			.where(eq(users.id, userId))
			.limit(1)) as Array<{ id: string; tenantId: string | null }>

		const target = rows[0]
		if (!target) throw new NotFoundException("User not found")

		if (actor.role === "tenant_admin" && target.tenantId !== actor.tenantId) {
			throw new ForbiddenException("Cannot modify users outside your tenant")
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any)
			.update(users)
			.set({ role: role as typeof users.role._.data, updatedAt: new Date() })
			.where(eq(users.id, userId))

		return { success: true }
	}

	async listAuditLogs(input: ListAuditInput) {
		const ctx = tenantDb()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const page = (input as any).page as number
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const limit = (input as any).limit as number
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const targetType = (input as any).targetType as string | undefined
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const actorUserId = (input as any).actorUserId as string | undefined
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const actionKey = (input as any).actionKey as string | undefined
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dateFrom = (input as any).dateFrom as string | undefined
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dateTo = (input as any).dateTo as string | undefined
		const offset = (page - 1) * limit

		const conditions = [eq(auditLogs.tenantId, ctx.tenantId)]
		if (targetType) conditions.push(eq(auditLogs.targetType, targetType))
		if (actorUserId) conditions.push(eq(auditLogs.actorUserId, actorUserId))
		if (actionKey) conditions.push(eq(auditLogs.actionKey, actionKey))
		if (dateFrom) conditions.push(gte(auditLogs.createdAt, new Date(dateFrom)))
		if (dateTo) conditions.push(lte(auditLogs.createdAt, new Date(dateTo)))

		const where = and(...conditions)

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const [items, totals] = await Promise.all([
			(db as any)
				.select()
				.from(auditLogs)
				.where(where)
				.orderBy(sql`${auditLogs.createdAt} DESC`)
				.limit(limit)
				.offset(offset),
			(db as any).select({ total: count() }).from(auditLogs).where(where),
		]) as [Array<typeof auditLogs.$inferSelect>, Array<{ total: number }>]

		return { items, total: Number(totals[0]?.total ?? 0), page, limit }
	}
}
