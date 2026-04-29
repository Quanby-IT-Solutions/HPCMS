import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import { and, eq, ilike, isNull, or } from "drizzle-orm"
import type { SQL } from "drizzle-orm"

import { practitioners } from "@repo/db/schema"

import { db, tenantDb } from "@/common/database/database.client"
import { FhirCacheService } from "@/common/fhir/fhir-cache.service"
import { type V1Inputs } from "@/config/contract-types"

type PractitionerListInput = V1Inputs["practitioner"]["list"]
type PractitionerGetInput = V1Inputs["practitioner"]["get"]

type PractitionerRow = typeof practitioners.$inferSelect

@Injectable()
export class PractitionersService {
	private readonly logger = new Logger(PractitionersService.name)

	constructor(private readonly fhirCacheService: FhirCacheService) {}

	async list(input: PractitionerListInput) {
		const tenantCtx = tenantDb()
		const { specialty, query } = input

		// Show practitioners for current tenant or global ones (tenantId IS NULL)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const tenantFilter = or(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			eq((practitioners as any).tenantId, tenantCtx.tenantId),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			isNull((practitioners as any).tenantId)
		) as SQL

		const extraFilters: SQL[] = []

		if (specialty) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			extraFilters.push(eq((practitioners as any).specialty, specialty))
		}

		if (query) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			extraFilters.push(ilike((practitioners as any).fullName, `%${query}%`))
		}

		const where =
			extraFilters.length > 0 ? and(tenantFilter, ...extraFilters) : tenantFilter

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rows = (await (db as any)
			.select()
			.from(practitioners)
			.where(where)) as PractitionerRow[]

		return rows.map(p => ({ ...p, fhirData: null, fhirStale: false }))
	}

	async findById(input: PractitionerGetInput) {
		const tenantCtx = tenantDb()

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rows = (await (db as any)
			.select()
			.from(practitioners)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((practitioners as any).id, input.id))
			.limit(1)) as PractitionerRow[]

		const practitioner = rows[0]
		if (!practitioner) throw new NotFoundException(`Practitioner ${input.id} not found`)

		// Enforce tenant isolation: must belong to current tenant or be global
		if (practitioner.tenantId && practitioner.tenantId !== tenantCtx.tenantId) {
			throw new NotFoundException(`Practitioner ${input.id} not found`)
		}

		if (practitioner.fhirResourceId) {
			try {
				const cached = await this.fhirCacheService.getPractitioner(
					tenantCtx.tenantId,
					practitioner.fhirResourceId
				)
				return { ...practitioner, fhirData: cached.data, fhirStale: cached.stale }
			} catch (err) {
				this.logger.warn(
					`FHIR enrichment failed for practitioner ${practitioner.id}: ${String(err)}`
				)
			}
		}

		return { ...practitioner, fhirData: null, fhirStale: false }
	}
}
