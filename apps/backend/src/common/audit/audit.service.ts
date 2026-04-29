import { Injectable, Logger } from "@nestjs/common"

import { auditLogs } from "@repo/db/schema"

import { db } from "@/common/database/database.client"

export interface AuditRecordInput {
	actorUserId?: string | null
	tenantId: string
	actionKey: string
	targetType: string
	targetId: string
	before?: unknown
	after?: unknown
	requestMeta?: {
		requestId?: string
		ipAddress?: string
		userAgent?: string
	}
}

@Injectable()
export class AuditService {
	private readonly logger = new Logger(AuditService.name)

	async record(input: AuditRecordInput): Promise<void> {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			await (db as any).insert(auditLogs).values({
				tenantId: input.tenantId,
				actorUserId: input.actorUserId ?? null,
				actionKey: input.actionKey,
				targetType: input.targetType,
				targetId: input.targetId,
				before: input.before ?? null,
				after: input.after ?? null,
				requestId: input.requestMeta?.requestId ?? null,
				ipAddress: input.requestMeta?.ipAddress ?? null,
				userAgent: input.requestMeta?.userAgent ?? null,
			})
		} catch (err) {
			// Best-effort: log failure but never propagate to caller
			this.logger.error(
				`AuditService.record failed [action=${input.actionKey} tenant=${input.tenantId}]`,
				err,
			)
		}
	}
}
