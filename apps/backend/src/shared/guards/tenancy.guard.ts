import { type CanActivate, type ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { eq } from "drizzle-orm"

import { getAuth, type AuthSessionUser } from "@repo/auth"
import { tenants } from "@repo/db/schema"

import { db } from "@/common/database/database.client"
import { TenancyService } from "@/common/tenancy/tenancy.service"
import { ALLOW_CROSS_TENANT_KEY } from "@/shared/decorators/allow-cross-tenant.decorator"
import { TENANT_REQUEST_KEY } from "@/shared/decorators/current-tenant.decorator"

type SessionLike = { user?: AuthSessionUser | null } | null | undefined

@Injectable()
export class TenancyGuard implements CanActivate {
	// Cache to avoid a DB round-trip on every request for the same tenantId.
	// Only valid (existing) tenants are cached; unknown IDs always re-check the DB.
	private readonly tenantCache = new Map<string, true>()

	constructor(
		private readonly tenancyService: TenancyService,
		private readonly reflector: Reflector,
	) {}

	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const request = ctx.switchToHttp().getRequest<Record<string, unknown>>()

		// Resolve session. @thallesp/nestjs-better-auth may pre-populate request.user via
		// middleware; if not, fall back to a direct call so the guard is self-sufficient.
		let session = request.user as SessionLike
		if (session === undefined) {
			const webHeaders = new Headers()
			const nodeHeaders = request.headers as Record<string, string | string[] | undefined>
			for (const [k, v] of Object.entries(nodeHeaders)) {
				if (v === undefined) continue
				webHeaders.set(k, Array.isArray(v) ? v.join(", ") : v)
			}
			const result = await getAuth().api.getSession({ headers: webHeaders })
			session = result as SessionLike
			request.user = session
		}

		if (!session?.user) return true // unauthenticated — skip

		const user = session.user
		// Store userId in CLS for all authenticated requests so services can resolve the actor
		this.tenancyService.setUserId(user.id)
		const role = user.role ?? null

		const allowCrossTenant = this.reflector.getAllAndOverride<boolean>(ALLOW_CROSS_TENANT_KEY, [
			ctx.getHandler(),
			ctx.getClass(),
		])

		if (allowCrossTenant) return true

		if (role === "system_admin") {
			const nodeHeaders = request.headers as Record<string, string | string[] | undefined>
			const rawHeader = nodeHeaders["x-tenant-id"]
			const tenantId = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader

			if (tenantId) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const rows = (await (db as any)
					.select({ id: (tenants as any).id })
					.from(tenants)
					.where(eq((tenants as any).id, tenantId))
					.limit(1)) as Array<{ id: string } | undefined>
				const tenant = rows[0]

				if (!tenant) throw new ForbiddenException("Unknown tenant")

				this.tenancyService.setTenantId(tenant.id)
				request[TENANT_REQUEST_KEY] = tenant.id
			}
			// No header → no tenant in CLS; tenantDb() will throw if a tenant-scoped call is made
			return true
		}

		// Non-admin: tenantId must be assigned in the session and must exist in the DB
		const tenantId = user.tenantId
		if (!tenantId) throw new ForbiddenException("User has no tenant assigned")

		if (!this.tenantCache.has(tenantId)) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const rows = (await (db as any)
				.select({ id: (tenants as any).id })
				.from(tenants)
				.where(eq((tenants as any).id, tenantId))
				.limit(1)) as Array<{ id: string }>
			if (rows.length === 0) throw new ForbiddenException("Unknown tenant")
			this.tenantCache.set(tenantId, true)
		}

		this.tenancyService.setTenantId(tenantId)
		request[TENANT_REQUEST_KEY] = tenantId
		return true
	}
}
