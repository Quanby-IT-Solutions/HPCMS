import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import type { AuthSessionUser } from "@repo/auth"

import { ROLES_KEY } from "@/shared/decorators/roles.decorator"

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(ctx: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<string[] | undefined>(ROLES_KEY, [
			ctx.getHandler(),
			ctx.getClass(),
		])

		if (!requiredRoles?.length) return true

		const request = ctx.switchToHttp().getRequest<{
			user?: { user?: AuthSessionUser | null } | null
		}>()
		const role = request.user?.user?.role

		return !!role && requiredRoles.includes(role)
	}
}
