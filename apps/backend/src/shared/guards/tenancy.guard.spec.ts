import { ForbiddenException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Test, type TestingModule } from "@nestjs/testing"

// All jest.mock() calls must appear before imports of the modules they affect.
// jest hoists these calls to the top of the file automatically.

const mockGetSession = jest.fn()
jest.mock("@repo/auth", () => ({
	getAuth: () => ({ api: { getSession: mockGetSession } }),
}))

const mockDbLimit = jest.fn()
jest.mock("@/common/database/database.client", () => ({
	db: {
		select: () => ({
			from: () => ({
				where: () => ({ limit: mockDbLimit }),
			}),
		}),
	},
}))

jest.mock("drizzle-orm", () => ({
	eq: jest.fn((_col, _val) => ({})),
}))

jest.mock("@repo/db/schema", () => ({
	tenants: { id: {} },
}))

import { TenancyService } from "@/common/tenancy/tenancy.service"

import { TenancyGuard } from "./tenancy.guard"

type MockSession = {
	user: {
		role: string | null
		tenantId: string | null
		emailVerified: boolean
	}
} | null

const makeCtx = (session: MockSession, headers: Record<string, string> = {}) => {
	const request = { user: session, headers }
	return {
		switchToHttp: () => ({ getRequest: () => request }),
		getHandler: () => ({}),
		getClass: () => ({}),
	} as any
}

describe("TenancyGuard", () => {
	let guard: TenancyGuard
	let tenancyService: jest.Mocked<Pick<TenancyService, "setTenantId" | "getTenantId" | "setUserId">>

	beforeEach(async () => {
		jest.clearAllMocks()

		tenancyService = {
			setTenantId: jest.fn(),
			getTenantId: jest.fn(),
			setUserId: jest.fn(),
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TenancyGuard,
				{ provide: TenancyService, useValue: tenancyService },
				Reflector,
			],
		}).compile()

		guard = module.get(TenancyGuard)
	})

	describe("unauthenticated requests", () => {
		it("returns true when no session on request", async () => {
			const ctx = makeCtx(null)
			await expect(guard.canActivate(ctx)).resolves.toBe(true)
		})
	})

	describe("non-admin users", () => {
		it("throws 403 when user has no tenantId", async () => {
			const ctx = makeCtx({
				user: { role: "case_agent", tenantId: null, emailVerified: true },
			})
			await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException)
		})

		it("throws 403 with descriptive message when tenantId missing", async () => {
			const ctx = makeCtx({
				user: { role: "patient", tenantId: null, emailVerified: false },
			})
			await expect(guard.canActivate(ctx)).rejects.toThrow("no tenant")
		})

		it("sets tenantId in CLS and on request for valid non-admin session", async () => {
			mockDbLimit.mockResolvedValueOnce([{ id: "tenant-qc" }])
			const ctx = makeCtx({
				user: { role: "case_agent", tenantId: "tenant-qc", emailVerified: true },
			})
			await expect(guard.canActivate(ctx)).resolves.toBe(true)
			expect(tenancyService.setTenantId).toHaveBeenCalledWith("tenant-qc")
		})

		it("sets tenantId for tenant_admin role", async () => {
			mockDbLimit.mockResolvedValueOnce([{ id: "tenant-bgc" }])
			const ctx = makeCtx({
				user: { role: "tenant_admin", tenantId: "tenant-bgc", emailVerified: true },
			})
			await expect(guard.canActivate(ctx)).resolves.toBe(true)
			expect(tenancyService.setTenantId).toHaveBeenCalledWith("tenant-bgc")
		})

		it("throws 403 when tenantId exists in session but is not in tenants table", async () => {
			mockDbLimit.mockResolvedValueOnce([]) // no matching row
			const ctx = makeCtx({
				user: { role: "case_agent", tenantId: "ghost-tenant", emailVerified: true },
			})
			await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException)
		})

		it("throws 403 with descriptive message for invalid tenant", async () => {
			mockDbLimit.mockResolvedValueOnce([])
			const ctx = makeCtx({
				user: { role: "patient", tenantId: "ghost-tenant", emailVerified: false },
			})
			await expect(guard.canActivate(ctx)).rejects.toThrow("Unknown tenant")
		})

		it("caches valid tenant to avoid repeated DB hits", async () => {
			mockDbLimit.mockResolvedValueOnce([{ id: "tenant-qc" }]) // only wired once
			const ctx1 = makeCtx({ user: { role: "case_agent", tenantId: "tenant-qc", emailVerified: true } })
			const ctx2 = makeCtx({ user: { role: "case_agent", tenantId: "tenant-qc", emailVerified: true } })
			await guard.canActivate(ctx1)
			await guard.canActivate(ctx2) // hits cache, not DB
			expect(mockDbLimit).toHaveBeenCalledTimes(1)
		})
	})

	describe("system_admin", () => {
		it("resolves tenantId from X-Tenant-Id header when tenant exists", async () => {
			mockDbLimit.mockResolvedValueOnce([{ id: "tenant-qc" }])
			const ctx = makeCtx(
				{ user: { role: "system_admin", tenantId: null, emailVerified: true } },
				{ "x-tenant-id": "tenant-qc" },
			)
			await expect(guard.canActivate(ctx)).resolves.toBe(true)
			expect(tenancyService.setTenantId).toHaveBeenCalledWith("tenant-qc")
		})

		it("throws 403 for unknown X-Tenant-Id", async () => {
			mockDbLimit.mockResolvedValueOnce([]) // no tenant found
			const ctx = makeCtx(
				{ user: { role: "system_admin", tenantId: null, emailVerified: true } },
				{ "x-tenant-id": "ghost-tenant" },
			)
			await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException)
		})

		it("returns true without setting CLS when X-Tenant-Id header is omitted", async () => {
			const ctx = makeCtx({
				user: { role: "system_admin", tenantId: null, emailVerified: true },
			})
			await expect(guard.canActivate(ctx)).resolves.toBe(true)
			expect(tenancyService.setTenantId).not.toHaveBeenCalled()
		})
	})

	describe("fallback session resolution", () => {
		it("calls auth.api.getSession() when request.user is undefined and caches result", async () => {
			const sessionData = {
				user: { role: "case_agent", tenantId: "tenant-qc", emailVerified: true },
			}
			mockGetSession.mockResolvedValueOnce(sessionData)
			mockDbLimit.mockResolvedValueOnce([{ id: "tenant-qc" }])

			// Simulate request with no pre-attached session (undefined, not null)
			const request = { headers: {} } as Record<string, unknown>
			const ctx = {
				switchToHttp: () => ({ getRequest: () => request }),
				getHandler: () => ({}),
				getClass: () => ({}),
			} as any

			await expect(guard.canActivate(ctx)).resolves.toBe(true)
			expect(mockGetSession).toHaveBeenCalledTimes(1)
			expect(request.user).toBe(sessionData)
			expect(tenancyService.setTenantId).toHaveBeenCalledWith("tenant-qc")
		})
	})
})
