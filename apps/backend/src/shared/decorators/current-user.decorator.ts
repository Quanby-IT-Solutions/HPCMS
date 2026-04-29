import { createParamDecorator, type ExecutionContext } from "@nestjs/common"
import type { AuthSessionUser } from "@repo/auth"

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthSessionUser | null => {
	const request = ctx.switchToHttp().getRequest<{ user?: { user?: AuthSessionUser | null } | null }>()
	return request.user?.user ?? null
})
