import { Injectable } from "@nestjs/common"
import { and, count, eq, inArray, isNull, sql } from "drizzle-orm"

import { notifications } from "@repo/db/schema"

import { db, tenantDb } from "@/common/database/database.client"
import { type V1Inputs } from "@/config/contract-types"

type ListInput = V1Inputs["notifications"]["list"]
type MarkReadInput = V1Inputs["notifications"]["markRead"]

@Injectable()
export class NotificationsReadService {
	async list(input: ListInput, userId: string) {
		const ctx = tenantDb()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const unreadOnly = (input as any).unreadOnly as boolean | undefined
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const page = (input as any).page as number
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const limit = (input as any).limit as number
		const offset = (page - 1) * limit

		const baseWhere = and(
			eq(notifications.tenantId, ctx.tenantId),
			eq(notifications.userId, userId),
			unreadOnly ? isNull(notifications.readAt) : undefined,
		)

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const [items, totals] = await Promise.all([
			(db as any)
				.select()
				.from(notifications)
				.where(baseWhere)
				.orderBy(sql`${notifications.createdAt} DESC`)
				.limit(limit)
				.offset(offset),
			(db as any)
				.select({
					total: count(),
					unreadCount: sql<number>`count(*) filter (where ${notifications.readAt} is null)`,
				})
				.from(notifications)
				.where(
					and(
						eq(notifications.tenantId, ctx.tenantId),
						eq(notifications.userId, userId),
					)
				),
		]) as [Array<typeof notifications.$inferSelect>, Array<{ total: number; unreadCount: number }>]

		const { total, unreadCount } = totals[0] ?? { total: 0, unreadCount: 0 }

		return { items, unreadCount: Number(unreadCount), total: Number(total), page, limit }
	}

	async markRead(input: MarkReadInput, userId: string) {
		const ctx = tenantDb()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const ids = (input as any).ids as string[]
		const now = new Date()

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = (await (db as any)
			.update(notifications)
			.set({ readAt: now, updatedAt: now })
			.where(
				and(
					eq(notifications.tenantId, ctx.tenantId),
					eq(notifications.userId, userId),
					inArray(notifications.id, ids),
					isNull(notifications.readAt),
				)
			)
			.returning({ id: notifications.id })) as Array<{ id: string }>

		return { updated: result.length }
	}

	async markAllRead(userId: string) {
		const ctx = tenantDb()
		const now = new Date()

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = (await (db as any)
			.update(notifications)
			.set({ readAt: now, updatedAt: now })
			.where(
				and(
					eq(notifications.tenantId, ctx.tenantId),
					eq(notifications.userId, userId),
					isNull(notifications.readAt),
				)
			)
			.returning({ id: notifications.id })) as Array<{ id: string }>

		return { updated: result.length }
	}
}
