import { type CanActivate, type ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common"
import type { AuthSessionUser } from "@repo/auth"

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
	canActivate(ctx: ExecutionContext): boolean {
		const request = ctx
			.switchToHttp()
			.getRequest<{ user?: { user?: AuthSessionUser | null } | null }>()

		const user = request.user?.user
		if (!user) return true // unauthenticated — let auth guards handle it

		if (!user.emailVerified) throw new ForbiddenException("Email not verified")
		return true
	}
}
