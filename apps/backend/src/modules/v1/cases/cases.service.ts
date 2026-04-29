import { randomUUID } from "node:crypto"

import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common"
import { and, asc, desc, eq, gte, inArray, lte, sql } from "drizzle-orm"

import { caseAttachments, caseEvents, caseSequences, healthcareCases, patientUserLinks } from "@repo/db/schema"

import { db, tenantDb } from "@/common/database/database.client"
import { NotificationsService } from "@/common/notifications/notifications.service"
import { StorageService } from "@/common/storage/storage.service"
import { type V1Inputs } from "@/config/contract-types"

type RequestUploadsInput = V1Inputs["cases"]["loa"]["requestUploads"]
type SubmitInput = V1Inputs["cases"]["loa"]["submit"]
type MyRequestsInput = V1Inputs["cases"]["myRequests"]
type GetCaseInput = V1Inputs["cases"]["get"]
type WithdrawInput = V1Inputs["cases"]["withdraw"]
type CaseListInput = V1Inputs["cases"]["list"]
type ClaimInput = V1Inputs["cases"]["claim"]
type AssignInput = V1Inputs["cases"]["assign"]
type ApproveInput = V1Inputs["cases"]["approve"]
type RejectInput = V1Inputs["cases"]["reject"]
type CloseInput = V1Inputs["cases"]["close"]
type AddEventInput = V1Inputs["cases"]["addEvent"]

const ALLOWED_CONTENT_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"])
const MAX_FILE_SIZE = 10 * 1024 * 1024

const OPEN_STATUSES = ["submitted", "in_review"] as const

@Injectable()
export class CasesService {
	private readonly logger = new Logger(CasesService.name)

	constructor(
		private readonly storage: StorageService,
		private readonly notifications: NotificationsService,
	) {}

	async requestUploads(input: RequestUploadsInput, userId: string) {
		const { tenantId } = tenantDb()

		for (const file of input.files) {
			if (!ALLOWED_CONTENT_TYPES.has(file.contentType)) {
				throw new BadRequestException(`Unsupported content type: ${file.contentType}`)
			}
			if (file.sizeBytes > MAX_FILE_SIZE) {
				throw new BadRequestException(`File exceeds 10 MB limit: ${file.filename}`)
			}
		}

		const uploads = await Promise.all(
			input.files.map(async file => {
				const result = await this.storage.presignUpload({
					tenantId,
					caseId: "draft",
					kind: file.kind,
					filename: file.filename,
					contentType: file.contentType,
					sizeLimit: file.sizeBytes,
				})
				return {
					kind: file.kind,
					filename: file.filename,
					key: result.key,
					url: result.url,
					expiresAt: result.expiresAt,
				}
			}),
		)

		return { uploads }
	}

	async submit(input: SubmitInput, userId: string) {
		const { tenantId } = tenantDb()

		// Verify all keys belong to this tenant's draft namespace
		for (const att of input.attachments) {
			if (!att.key.startsWith(`t/${tenantId}/c/draft/`)) {
				throw new BadRequestException(`Attachment key not in tenant draft namespace: ${att.key}`)
			}
		}

		// HEAD-check all keys before starting the transaction
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const linkedLinks = (await (db as any)
			.select({ patientId: patientUserLinks.patientId })
			.from(patientUserLinks)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((patientUserLinks as any).userId, userId))
			.limit(1)) as Array<{ patientId: string }>

		const patientId = linkedLinks[0]?.patientId
		if (!patientId) throw new ForbiddenException("No linked patient — verify MRN first")

		type HeadInfo = { key: string; filename: string; kind: string; contentType: string; sizeBytes: number }
		const headResults: HeadInfo[] = []

		for (const att of input.attachments) {
			const head = await this.storage.head(att.key)
			if (!head.exists) throw new BadRequestException(`Attachment not found in storage: ${att.key}`)
			headResults.push({
				key: att.key,
				filename: att.filename,
				kind: att.kind,
				contentType: head.contentType ?? "application/octet-stream",
				sizeBytes: head.sizeBytes ?? 0,
			})
		}

		const now = new Date()

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = await (db as any).transaction(async (tx: any) => {
			// Atomic case sequence allocation
			const seqRows = (await tx
				.insert(caseSequences)
				.values({ tenantId, lastValue: 1001, createdAt: now, updatedAt: now })
				.onConflictDoUpdate({
					target: caseSequences.tenantId,
					set: {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						lastValue: sql`${(caseSequences as any).lastValue} + 1`,
						updatedAt: now,
					},
				})
				.returning()) as Array<typeof caseSequences.$inferSelect>

			const seq = seqRows[0]!
			const caseRef = `HC-${seq.lastValue}`
			const caseId = randomUUID()

			await tx.insert(healthcareCases).values({
				id: caseId,
				tenantId,
				caseRef,
				caseType: "LOA_REQUEST",
				status: "submitted",
				priority: "medium",
				sourceChannel: "web",
				patientId,
				submittedAt: now,
				payload: input.payload,
				createdAt: now,
				updatedAt: now,
			})

			for (const h of headResults) {
				await tx.insert(caseAttachments).values({
					id: randomUUID(),
					tenantId,
					caseId,
					kind: h.kind,
					storageKey: h.key,
					originalFilename: h.filename,
					contentType: h.contentType,
					sizeBytes: h.sizeBytes,
					uploadedByUserId: userId,
					uploadedAt: now,
					createdAt: now,
					updatedAt: now,
				})
			}

			await tx.insert(caseEvents).values({
				id: randomUUID(),
				tenantId,
				caseId,
				eventType: "submitted",
				actorUserId: userId,
				payload: null,
				visibility: "patient",
				createdAt: now,
				updatedAt: now,
			})

			return { caseRef, caseId }
		})

		void this.notifications
			.notify({
				userId,
				tenantId,
				kind: "loa_submitted",
				title: "LOA Request Submitted",
				body: `Your LOA request ${result.caseRef} has been submitted and is under review.`,
				email: {
					template: "loa-submitted",
					vars: { caseRef: result.caseRef },
				},
			})
			.catch(err => this.logger.error("Failed to send loa_submitted notification", err))

		return result
	}

	async myRequests(input: MyRequestsInput, userId: string) {
		const { tenantId } = tenantDb()

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const linkedLinks = (await (db as any)
			.select({ patientId: patientUserLinks.patientId })
			.from(patientUserLinks)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((patientUserLinks as any).userId, userId))
			.limit(1)) as Array<{ patientId: string }>

		const patientId = linkedLinks[0]?.patientId
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const page = (input as any).page as number
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const limit = (input as any).limit as number
		if (!patientId) return { items: [], total: 0, page, limit }

		const where = and(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			eq((healthcareCases as any).tenantId, tenantId),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			eq((healthcareCases as any).patientId, patientId),
		)

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const countRows = (await (db as any)
			.select({ count: sql<number>`count(*)::int` })
			.from(healthcareCases)
			.where(where)) as Array<{ count: number }>
		const total = countRows[0]?.count ?? 0

		const offset = (page - 1) * limit
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const items = (await (db as any)
			.select()
			.from(healthcareCases)
			.where(where)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.orderBy(desc((healthcareCases as any).submittedAt))
			.limit(limit)
			.offset(offset)) as Array<typeof healthcareCases.$inferSelect>

		return { items, total, page, limit }
	}

	async get(input: GetCaseInput, userId: string) {
		const { tenantId } = tenantDb()
		const caseRow = await this.findCaseByRef(tenantId, input.ref)
		if (!caseRow) throw new NotFoundException("Case not found")

		// Determine audience: check if user has a linked patient record
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const linkedLinks = (await (db as any)
			.select({ patientId: patientUserLinks.patientId })
			.from(patientUserLinks)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((patientUserLinks as any).userId, userId))
			.limit(1)) as Array<{ patientId: string }>

		const linkedPatientId = linkedLinks[0]?.patientId

		if (linkedPatientId) {
			// Patient user — may only see their own case; return 404 to avoid existence leak
			if (caseRow.patientId !== linkedPatientId) throw new NotFoundException("Case not found")
			return this.buildCaseDetail(caseRow, "patient")
		}

		// Staff user — sees all tenant cases
		return this.buildCaseDetail(caseRow, "staff")
	}

	async withdraw(input: WithdrawInput, userId: string) {
		const { tenantId } = tenantDb()

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const linkedLinks = (await (db as any)
			.select({ patientId: patientUserLinks.patientId })
			.from(patientUserLinks)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((patientUserLinks as any).userId, userId))
			.limit(1)) as Array<{ patientId: string }>

		const patientId = linkedLinks[0]?.patientId
		if (!patientId) throw new ForbiddenException("No linked patient")

		const caseRow = await this.findCaseByRef(tenantId, input.ref)
		if (!caseRow) throw new NotFoundException("Case not found")
		if (caseRow.patientId !== patientId) throw new NotFoundException("Case not found")

		if (!OPEN_STATUSES.includes(caseRow.status as (typeof OPEN_STATUSES)[number])) {
			throw new ConflictException(`Cannot withdraw case with status '${caseRow.status}'`)
		}

		const now = new Date()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any)
			.update(healthcareCases)
			.set({ status: "withdrawn", outcome: "withdrawn", updatedAt: now })
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((healthcareCases as any).id, caseRow.id))

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any).insert(caseEvents).values({
			id: randomUUID(),
			tenantId,
			caseId: caseRow.id,
			eventType: "withdrawn",
			actorUserId: userId,
			payload: null,
			visibility: "patient",
			createdAt: now,
			updatedAt: now,
		})

		return { success: true, caseId: caseRow.id }
	}

	async list(input: CaseListInput, userId: string) {
		const { tenantId } = tenantDb()

		// Base conditions: open statuses within tenant
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const conditions: ReturnType<typeof eq>[] = [
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			eq((healthcareCases as any).tenantId, tenantId) as any,
			inArray(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(healthcareCases as any).status,
				[...OPEN_STATUSES] as string[],
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			) as any,
		]

		if (input.tab === "mine") {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			conditions.push(eq((healthcareCases as any).assignedUserId, userId) as any)
		}

		if (input.type) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			conditions.push(eq((healthcareCases as any).caseType, input.type) as any)
		}
		if (input.status) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			conditions.push(eq((healthcareCases as any).status, input.status) as any)
		}
		if (input.priority) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			conditions.push(eq((healthcareCases as any).priority, input.priority) as any)
		}
		if (input.sourceChannel) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			conditions.push(eq((healthcareCases as any).sourceChannel, input.sourceChannel) as any)
		}
		if (input.dateFrom) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			conditions.push(gte((healthcareCases as any).submittedAt, new Date(input.dateFrom)) as any)
		}
		if (input.dateTo) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			conditions.push(lte((healthcareCases as any).submittedAt, new Date(input.dateTo)) as any)
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const where = and(...(conditions as any[]))

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const countRows = (await (db as any)
			.select({ count: sql<number>`count(*)::int` })
			.from(healthcareCases)
			.where(where)) as Array<{ count: number }>
		const total = countRows[0]?.count ?? 0

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let orderBy: any
		if (input.sort === "newest_first") {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			orderBy = desc((healthcareCases as any).submittedAt)
		} else if (input.sort === "priority_desc") {
			orderBy = sql`CASE ${(healthcareCases as any).priority} WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 END ASC`
		} else {
			// oldest_first (default)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			orderBy = asc((healthcareCases as any).submittedAt)
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const page = (input as any).page as number
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const limit = (input as any).limit as number
		const offset = (page - 1) * limit
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const items = (await (db as any)
			.select()
			.from(healthcareCases)
			.where(where)
			.orderBy(orderBy)
			.limit(limit)
			.offset(offset)) as Array<typeof healthcareCases.$inferSelect>

		return { items, total, page, limit }
	}

	async claim(input: ClaimInput, userId: string) {
		const { tenantId } = tenantDb()
		const caseRow = await this.findCaseByRef(tenantId, input.ref)
		if (!caseRow) throw new NotFoundException("Case not found")

		if (caseRow.status !== "submitted" && caseRow.status !== "in_review") {
			throw new ConflictException(`Cannot claim case with status '${caseRow.status}'`)
		}

		const now = new Date()
		const updateFields: Record<string, unknown> = {
			assignedUserId: userId,
			updatedAt: now,
		}

		if (caseRow.status === "submitted") {
			updateFields.status = "in_review"
			updateFields.inReviewAt = now
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any)
			.update(healthcareCases)
			.set(updateFields)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((healthcareCases as any).id, caseRow.id))

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any).insert(caseEvents).values({
			id: randomUUID(),
			tenantId,
			caseId: caseRow.id,
			eventType: "claimed",
			actorUserId: userId,
			payload: null,
			visibility: "internal",
			createdAt: now,
			updatedAt: now,
		})

		return { success: true, caseId: caseRow.id }
	}

	async assign(input: AssignInput, actorUserId: string) {
		const { tenantId } = tenantDb()
		const caseRow = await this.findCaseByRef(tenantId, input.ref)
		if (!caseRow) throw new NotFoundException("Case not found")

		const now = new Date()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any)
			.update(healthcareCases)
			.set({ assignedUserId: input.assigneeUserId, updatedAt: now })
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((healthcareCases as any).id, caseRow.id))

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any).insert(caseEvents).values({
			id: randomUUID(),
			tenantId,
			caseId: caseRow.id,
			eventType: "assigned",
			actorUserId,
			payload: { assigneeUserId: input.assigneeUserId },
			visibility: "internal",
			createdAt: now,
			updatedAt: now,
		})

		return { success: true, caseId: caseRow.id }
	}

	async approve(input: ApproveInput, actorUserId: string) {
		const { tenantId } = tenantDb()
		const caseRow = await this.findCaseByRef(tenantId, input.ref)
		if (!caseRow) throw new NotFoundException("Case not found")

		if (caseRow.status !== "in_review") {
			throw new ConflictException(`Cannot approve case with status '${caseRow.status}'`)
		}

		const now = new Date()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any)
			.update(healthcareCases)
			.set({ status: "approved", outcome: "approved", resolvedAt: now, updatedAt: now })
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((healthcareCases as any).id, caseRow.id))

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any).insert(caseEvents).values({
			id: randomUUID(),
			tenantId,
			caseId: caseRow.id,
			eventType: "approved",
			actorUserId,
			payload: null,
			visibility: "patient",
			createdAt: now,
			updatedAt: now,
		})

		void this.notifyPatient(caseRow.patientId, tenantId, "loa_approved", {
			title: "LOA Request Approved",
			body: `Your LOA request ${caseRow.caseRef} has been approved.`,
			template: "loa-approved",
			vars: { caseRef: caseRow.caseRef },
		})

		return { success: true, caseId: caseRow.id }
	}

	async reject(input: RejectInput, actorUserId: string) {
		const { tenantId } = tenantDb()
		const caseRow = await this.findCaseByRef(tenantId, input.ref)
		if (!caseRow) throw new NotFoundException("Case not found")

		if (caseRow.status !== "in_review") {
			throw new ConflictException(`Cannot reject case with status '${caseRow.status}'`)
		}

		const now = new Date()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any)
			.update(healthcareCases)
			.set({
				status: "rejected",
				outcome: "rejected",
				rejectionReason: input.reason,
				resolvedAt: now,
				updatedAt: now,
			})
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((healthcareCases as any).id, caseRow.id))

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any).insert(caseEvents).values({
			id: randomUUID(),
			tenantId,
			caseId: caseRow.id,
			eventType: "rejected",
			actorUserId,
			payload: { reason: input.reason },
			visibility: "patient",
			createdAt: now,
			updatedAt: now,
		})

		void this.notifyPatient(caseRow.patientId, tenantId, "loa_rejected", {
			title: "LOA Request Rejected",
			body: `Your LOA request ${caseRow.caseRef} has been rejected. Reason: ${input.reason}`,
			template: "loa-rejected",
			vars: { caseRef: caseRow.caseRef, reason: input.reason },
		})

		return { success: true, caseId: caseRow.id }
	}

	async close(input: CloseInput, actorUserId: string) {
		const { tenantId } = tenantDb()
		const caseRow = await this.findCaseByRef(tenantId, input.ref)
		if (!caseRow) throw new NotFoundException("Case not found")

		if (caseRow.status !== "approved" && caseRow.status !== "rejected") {
			throw new ConflictException(`Cannot close case with status '${caseRow.status}'`)
		}

		const now = new Date()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any)
			.update(healthcareCases)
			.set({ status: "closed", closedAt: now, updatedAt: now })
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq((healthcareCases as any).id, caseRow.id))

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any).insert(caseEvents).values({
			id: randomUUID(),
			tenantId,
			caseId: caseRow.id,
			eventType: "closed",
			actorUserId,
			payload: null,
			visibility: "internal",
			createdAt: now,
			updatedAt: now,
		})

		return { success: true, caseId: caseRow.id }
	}

	async addEvent(input: AddEventInput, actorUserId: string) {
		const { tenantId } = tenantDb()
		const caseRow = await this.findCaseByRef(tenantId, input.ref)
		if (!caseRow) throw new NotFoundException("Case not found")

		const now = new Date()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db as any).insert(caseEvents).values({
			id: randomUUID(),
			tenantId,
			caseId: caseRow.id,
			eventType: input.eventType,
			actorUserId,
			payload: input.payload ?? null,
			visibility: input.visibility,
			createdAt: now,
			updatedAt: now,
		})

		return { success: true, caseId: caseRow.id }
	}

	private async findCaseByRef(tenantId: string, ref: string) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rows = (await (db as any)
			.select()
			.from(healthcareCases)
			.where(
				and(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					eq((healthcareCases as any).tenantId, tenantId),
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					eq((healthcareCases as any).caseRef, ref),
				),
			)
			.limit(1)) as Array<typeof healthcareCases.$inferSelect>

		return rows[0] ?? null
	}

	private async buildCaseDetail(
		caseRow: typeof healthcareCases.$inferSelect,
		audience: "patient" | "staff",
	) {
		const eventsWhere =
			audience === "patient"
				? and(
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						eq((caseEvents as any).caseId, caseRow.id),
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						eq((caseEvents as any).visibility, "patient"),
					)
				: // eslint-disable-next-line @typescript-eslint/no-explicit-any
					eq((caseEvents as any).caseId, caseRow.id)

		const [events, attachments] = await Promise.all([
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(db as any)
				.select()
				.from(caseEvents)
				.where(eventsWhere)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.orderBy(asc((caseEvents as any).createdAt)) as Promise<Array<typeof caseEvents.$inferSelect>>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(db as any)
				.select()
				.from(caseAttachments)
				.where(
					and(
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						eq((caseAttachments as any).caseId, caseRow.id),
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						eq((caseAttachments as any).tenantId, caseRow.tenantId),
					),
				) as Promise<Array<typeof caseAttachments.$inferSelect>>,
		])

		return { ...caseRow, events, attachments }
	}

	private async notifyPatient(
		patientId: string,
		tenantId: string,
		kind: "loa_approved" | "loa_rejected",
		opts: {
			title: string
			body: string
			template: "loa-approved" | "loa-rejected"
			vars: Record<string, unknown>
		},
	) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const links = (await (db as any)
				.select({ userId: patientUserLinks.userId })
				.from(patientUserLinks)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.where(eq((patientUserLinks as any).patientId, patientId))
				.limit(1)) as Array<{ userId: string }>

			const patientUserId = links[0]?.userId
			if (!patientUserId) return

			await this.notifications.notify({
				userId: patientUserId,
				tenantId,
				kind,
				title: opts.title,
				body: opts.body,
				email: { template: opts.template, vars: opts.vars },
			})
		} catch (err) {
			this.logger.error(`Failed to notify patient [kind=${kind} patientId=${patientId}]`, err)
		}
	}
}
