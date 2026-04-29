import { createParamDecorator, type ExecutionContext } from "@nestjs/common"

export const TENANT_REQUEST_KEY = "__tenantId" as const

export const CurrentTenant = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<Record<string, unknown>>()
	return (request[TENANT_REQUEST_KEY] as string | undefined) ?? null
})
