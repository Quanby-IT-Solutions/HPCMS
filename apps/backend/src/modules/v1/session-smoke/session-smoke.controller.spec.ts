import { Test, type TestingModule } from "@nestjs/testing"

import { SessionSmokeController } from "./session-smoke.controller"

jest.mock("@thallesp/nestjs-better-auth", () => ({
	Session: () => () => undefined,
}))

const now = new Date()

const makeSession = (overrides: Record<string, unknown> = {}) => ({
	session: {
		id: "session-id",
		token: "mock-token",
		userId: "user-id",
		expiresAt: now,
		createdAt: now,
		updatedAt: now,
		ipAddress: null,
		userAgent: null,
	},
	user: {
		id: "user-id",
		email: "test@example.com",
		name: "Test User",
		emailVerified: true,
		image: null,
		createdAt: now,
		updatedAt: now,
		role: "patient",
		tenantId: "tenant-qc",
		mrnVerifyFailedCount: 0,
		mrnVerifyLockedUntil: null,
		...overrides,
	},
})

describe("SessionSmokeController", () => {
	let controller: SessionSmokeController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SessionSmokeController],
		}).compile()

		controller = module.get<SessionSmokeController>(SessionSmokeController)
	})

	it("should be defined", () => {
		expect(controller).toBeDefined()
	})

	it("returns id, email, role, tenantId, emailVerified from session", () => {
		const session = makeSession()
		const result = controller.getMe(session as any)

		expect(result).toEqual({
			id: "user-id",
			email: "test@example.com",
			role: "patient",
			tenantId: "tenant-qc",
			emailVerified: true,
		})
	})

	it("returns null for role when not set", () => {
		const session = makeSession({ role: undefined })
		const result = controller.getMe(session as any)!

		expect(result.role).toBeNull()
	})

	it("returns null for tenantId when not set", () => {
		const session = makeSession({ tenantId: null })
		const result = controller.getMe(session as any)!

		expect(result.tenantId).toBeNull()
	})

	it("includes all five expected fields and no extras", () => {
		const session = makeSession({ role: "staff", tenantId: "tenant-bgc" })
		const result = controller.getMe(session as any)!

		expect(Object.keys(result).sort()).toEqual(
			["id", "email", "emailVerified", "role", "tenantId"].sort()
		)
		expect(result.role).toBe("staff")
		expect(result.tenantId).toBe("tenant-bgc")
	})
})
