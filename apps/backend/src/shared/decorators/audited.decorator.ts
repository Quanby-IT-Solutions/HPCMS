import { SetMetadata } from "@nestjs/common"

export const AUDITED_KEY = "audited"

export interface AuditedOptions {
	targetType: string
	/** Dot-path resolving the target ID — prefix with "input." or "result." */
	targetIdFrom: `input.${string}` | `result.${string}`
}

export interface AuditedMetadata extends AuditedOptions {
	actionKey: string
}

export function Audited(actionKey: string, options: AuditedOptions): MethodDecorator {
	return SetMetadata<string, AuditedMetadata>(AUDITED_KEY, { actionKey, ...options })
}
