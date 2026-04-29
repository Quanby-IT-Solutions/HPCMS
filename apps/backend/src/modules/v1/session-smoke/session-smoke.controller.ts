import { Controller, Get, Version } from "@nestjs/common"
import { Session } from "@thallesp/nestjs-better-auth"

import { type AuthSession } from "@repo/auth"

// Plain NestJS controller — no dedicated oRPC contract needed for a single diagnostic
// endpoint that returns session shape. Adding a full oRPC contract entry would be
// disproportionate scope for this smoke check.

@Controller("session")
export class SessionSmokeController {
	@Get("me")
	@Version("1")
	getMe(
		@Session()
		session: AuthSession
	) {
		if (!session) return null
		const user = session.user
		return {
			id: user.id,
			email: user.email,
			role: user.role ?? null,
			tenantId: user.tenantId ?? null,
			emailVerified: user.emailVerified,
		}
	}
}
