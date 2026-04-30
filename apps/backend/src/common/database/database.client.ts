import { ForbiddenException } from "@nestjs/common"
import { and, eq, type SQL } from "drizzle-orm"
import { drizzle } from "drizzle-orm/node-postgres"

import {
	auditLogs,
	caseAttachments,
	caseEvents,
	caseSequences,
	fhirCache,
	healthcareCases,
	notifications,
	patients,
	practitioners,
	schema,
} from "@repo/db/schema"

import { env } from "@/config/env.config"

export const db = drizzle(env.DATABASE_URL, { schema })

// Curated registry of tables that are scoped to a single tenant (all have a tenantId column).
export const TENANT_TABLES = {
	patients,
	practitioners,
	healthcareCases,
	caseSequences,
	caseEvents,
	caseAttachments,
	notifications,
	auditLogs,
	fhirCache,
} as const

type TenantTableValue = (typeof TENANT_TABLES)[keyof typeof TENANT_TABLES]

export type TenantContext = {
	readonly tenantId: string
	readonly tables: typeof TENANT_TABLES
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	select(table: TenantTableValue, additionalWhere?: SQL): any
}

// Set by TenancyModule.onModuleInit() before any requests arrive.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _cls: { get: (key: string) => any } | null = null

export function _registerCls(cls: { get: (key: string) => unknown }): void {
	_cls = cls
}

/** Returns the current tenant ID without throwing — null when no tenant is in context (e.g. system_admin without x-tenant-id header). */
export function tryTenantId(): string | null {
	if (!_cls) return null
	return (_cls.get("tenantId") as string | undefined) ?? null
}

export function tenantDb(): TenantContext {
	if (!_cls) {
		throw new Error("CLS not initialized — import TenancyModule in AppModule before using tenantDb().")
	}
	const tenantId = _cls.get("tenantId") as string | undefined
	if (!tenantId) {
		throw new ForbiddenException("No tenant in context. Request must pass through TenancyGuard first.")
	}
	return {
		tenantId,
		tables: TENANT_TABLES,
		select(table: TenantTableValue, additionalWhere?: SQL) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const tenantFilter = eq((table as any).tenantId, tenantId)
			const where = additionalWhere ? and(tenantFilter, additionalWhere) : tenantFilter
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return (db as any).select().from(table).where(where)
		},
	}
}
