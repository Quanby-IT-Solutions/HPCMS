import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import type { Observable } from "rxjs"
import { tap } from "rxjs/operators"

import type { AuthSessionUser } from "@repo/auth"

import { AuditService } from "@/common/audit/audit.service"
import { TenancyService } from "@/common/tenancy/tenancy.service"
import { AUDITED_KEY, type AuditedMetadata } from "@/shared/decorators/audited.decorator"

function resolvePath(obj: unknown, path: string): string | undefined {
	const parts = path.split(".")
	let current: unknown = obj
	// skip index 0 (the prefix "input" or "result")
	for (let i = 1; i < parts.length; i++) {
		if (current === null || typeof current !== "object") return undefined
		current = (current as Record<string, unknown>)[parts[i]!]
	}
	if (typeof current === "string") return current
	if (typeof current === "number") return String(current)
	return undefined
}

type RequestLike = {
	user?: { user?: AuthSessionUser | null } | null
	body?: unknown
	ip?: string
	headers?: Record<string, string | string[] | undefined>
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
	constructor(
		private readonly reflector: Reflector,
		private readonly auditService: AuditService,
		private readonly tenancyService: TenancyService,
	) {}

	intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
		const meta = this.reflector.get<AuditedMetadata | undefined>(AUDITED_KEY, ctx.getHandler())

		if (!meta) return next.handle()

		const request = ctx.switchToHttp().getRequest<RequestLike>()
		const actor = request.user?.user ?? null

		return next.handle().pipe(
			tap(result => {
				// Only audit mutating handlers (result defined = handler succeeded)
				const tenantId = this.tenancyService.getTenantId()
				if (!tenantId) return

				const input = request.body
				const targetId = meta.targetIdFrom.startsWith("input.")
					? resolvePath(input, meta.targetIdFrom)
					: resolvePath(result, meta.targetIdFrom)

				if (!targetId) return

				const userAgent = request.headers?.["user-agent"]

				void this.auditService.record({
					actorUserId: actor?.id ?? null,
					tenantId,
					actionKey: meta.actionKey,
					targetType: meta.targetType,
					targetId,
					requestMeta: {
						ipAddress: request.ip,
						userAgent: Array.isArray(userAgent) ? userAgent[0] : userAgent,
					},
				})
			}),
		)
	}
}
