import { randomUUID } from "node:crypto"

import { Injectable, Logger } from "@nestjs/common"
import { eq } from "drizzle-orm"

import { notifications, users } from "@repo/db/schema"

import { db } from "@/common/database/database.client"
import { EmailService } from "@/common/email/email.service"

export type NotificationKind = "loa_submitted" | "loa_approved" | "loa_rejected" | "mrn_lockout"

type TemplateName = "loa-submitted" | "loa-approved" | "loa-rejected"

export interface NotifyInput {
	userId: string
	tenantId: string
	kind: NotificationKind
	title: string
	body: string
	targetUrl?: string
	email?: {
		template: TemplateName
		vars: Record<string, unknown>
	}
}

@Injectable()
export class NotificationsService {
	private readonly logger = new Logger(NotificationsService.name)

	constructor(private readonly emailService: EmailService) {}

	async notify(input: NotifyInput): Promise<void> {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			await (db as any).insert(notifications).values({
				id: randomUUID(),
				userId: input.userId,
				tenantId: input.tenantId,
				kind: input.kind,
				title: input.title,
				body: input.body,
				targetUrl: input.targetUrl ?? null,
			})
		} catch (err) {
			this.logger.error(
				`NotificationsService: failed to insert notification [kind=${input.kind} userId=${input.userId}]`,
				err,
			)
			return
		}

		if (input.email) {
			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const rows = (await (db as any)
					.select({ email: users.email, name: users.name })
					.from(users)
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					.where(eq((users as any).id, input.userId))
					.limit(1)) as Array<{ email: string; name: string }>
				const user = rows[0]
				if (user) {
					await this.emailService.send(input.email.template, user.email, {
						name: user.name,
						...input.email.vars,
					})
				}
			} catch (err) {
				this.logger.error(
					`NotificationsService: failed to send email [kind=${input.kind} userId=${input.userId}]`,
					err,
				)
			}
		}
	}
}
