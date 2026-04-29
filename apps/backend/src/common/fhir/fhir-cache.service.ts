import { Inject, Injectable } from "@nestjs/common"
import { and, eq } from "drizzle-orm"

import { fhirCache } from "@repo/db/schema"
import type { FhirClient, FhirPatient, FhirPractitioner } from "@repo/fhir"
import { FhirTransientError } from "@repo/fhir"

import { db } from "@/common/database/database.client"
import { env } from "@/config/env.config"

import { FHIR_CLIENT } from "./fhir.tokens"

export interface CachedResult<T> {
	data: T
	stale: boolean
}

type FhirCacheRow = typeof fhirCache.$inferSelect

@Injectable()
export class FhirCacheService {
	constructor(@Inject(FHIR_CLIENT) private readonly client: FhirClient) {}

	async getPatient(tenantId: string, resourceId: string): Promise<CachedResult<FhirPatient>> {
		return this.resolve<FhirPatient>(tenantId, "Patient", resourceId, id => this.client.getPatient(id))
	}

	async getPractitioner(tenantId: string, resourceId: string): Promise<CachedResult<FhirPractitioner>> {
		return this.resolve<FhirPractitioner>(tenantId, "Practitioner", resourceId, id =>
			this.client.getPractitioner(id)
		)
	}

	private async resolve<T>(
		tenantId: string,
		resourceType: string,
		resourceId: string,
		fetchFn: (id: string) => Promise<T>
	): Promise<CachedResult<T>> {
		const ttlMs = env.FHIR_CACHE_TTL_HOURS * 60 * 60 * 1000
		const row = await this.queryCache(tenantId, resourceType, resourceId)
		const now = new Date()
		const isFresh = row && now.getTime() - new Date(row.syncedAt).getTime() < ttlMs

		if (isFresh) {
			return { data: row.raw as T, stale: false }
		}

		try {
			const fresh = await fetchFn(resourceId)
			await this.upsertCache(tenantId, resourceType, resourceId, fresh, now)
			return { data: fresh, stale: false }
		} catch (err) {
			if (err instanceof FhirTransientError && row) {
				return { data: row.raw as T, stale: true }
			}
			throw err
		}
	}

	private async queryCache(
		tenantId: string,
		resourceType: string,
		resourceId: string
	): Promise<FhirCacheRow | undefined> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const table = fhirCache as any
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rows = await (db as any)
			.select()
			.from(fhirCache)
			.where(
				and(
					eq(table.tenantId, tenantId),
					eq(table.resourceType, resourceType),
					eq(table.resourceId, resourceId)
				)
			)
			.limit(1)
		return (rows as FhirCacheRow[])[0]
	}

	private async upsertCache(
		tenantId: string,
		resourceType: string,
		resourceId: string,
		data: unknown,
		now: Date
	): Promise<void> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const table = fhirCache as any
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any)
			.insert(fhirCache)
			.values({
				tenantId,
				resourceType,
				resourceId,
				raw: data,
				syncedAt: now,
				createdAt: now,
				updatedAt: now,
			})
			.onConflictDoUpdate({
				target: [table.tenantId, table.resourceType, table.resourceId],
				set: {
					raw: data,
					syncedAt: now,
					updatedAt: now,
				},
			})
	}
}
