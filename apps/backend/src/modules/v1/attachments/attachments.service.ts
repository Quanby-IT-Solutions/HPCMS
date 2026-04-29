import { Injectable, NotFoundException } from "@nestjs/common"
import { and, eq } from "drizzle-orm"

import { caseAttachments, healthcareCases, patientUserLinks } from "@repo/db/schema"

import { db, tenantDb } from "@/common/database/database.client"
import { StorageService } from "@/common/storage/storage.service"
import { type V1Inputs } from "@/config/contract-types"

type SignDownloadInput = V1Inputs["attachments"]["signDownload"]

const DOWNLOAD_TTL_SECONDS = 5 * 60

@Injectable()
export class AttachmentsService {
	constructor(private readonly storage: StorageService) {}

	async signDownload(input: SignDownloadInput, userId: string) {
		const { tenantId } = tenantDb()

		// Resolve case by ref within tenant
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const caseRows = (await (db as any)
			.select()
			.from(healthcareCases)
			.where(
				and(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					eq((healthcareCases as any).tenantId, tenantId),
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					eq((healthcareCases as any).caseRef, input.caseRef),
				),
			)
			.limit(1)) as Array<typeof healthcareCases.$inferSelect>

		const caseRow = caseRows[0]
		if (!caseRow) throw new NotFoundException("Case not found")

		// For patient users: verify they own this case
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const linkedLinks = (await (db as any)
			.select({ patientId: patientUserLinks.patientId })
			.from(patientUserLinks)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((patientUserLinks as any).userId, userId))
			.limit(1)) as Array<{ patientId: string }>

		const linkedPatientId = linkedLinks[0]?.patientId
		if (linkedPatientId && caseRow.patientId !== linkedPatientId) {
			throw new NotFoundException("Case not found")
		}

		// Resolve attachment by id, scoped to case and tenant
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const attRows = (await (db as any)
			.select()
			.from(caseAttachments)
			.where(
				and(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					eq((caseAttachments as any).id, input.attachmentId),
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					eq((caseAttachments as any).caseId, caseRow.id),
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					eq((caseAttachments as any).tenantId, tenantId),
				),
			)
			.limit(1)) as Array<typeof caseAttachments.$inferSelect>

		const att = attRows[0]
		if (!att) throw new NotFoundException("Attachment not found")

		const url = await this.storage.presignDownload(tenantId, att.storageKey)
		const expiresAt = new Date(Date.now() + DOWNLOAD_TTL_SECONDS * 1000)

		return { url, expiresAt }
	}
}
