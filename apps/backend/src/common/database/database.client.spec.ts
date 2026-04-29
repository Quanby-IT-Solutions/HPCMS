import { ForbiddenException } from "@nestjs/common"

// Mock drizzle and env so the module loads without a real DB connection
jest.mock("drizzle-orm/node-postgres", () => ({
	drizzle: jest.fn().mockReturnValue({}),
}))

jest.mock("drizzle-orm", () => ({
	eq: jest.fn((_col: unknown, _val: unknown) => ({ __type: "eq", _col, _val })),
	and: jest.fn((...args: unknown[]) => ({ __type: "and", args })),
}))

jest.mock("@repo/db/schema", () => ({
	schema: {},
	patients: { tenantId: { __col: "tenant_id" } },
	practitioners: { tenantId: { __col: "tenant_id" } },
	healthcareCases: { tenantId: { __col: "tenant_id" } },
	caseSequences: { tenantId: { __col: "tenant_id" } },
	caseEvents: { tenantId: { __col: "tenant_id" } },
	caseAttachments: { tenantId: { __col: "tenant_id" } },
	notifications: { tenantId: { __col: "tenant_id" } },
	auditLogs: { tenantId: { __col: "tenant_id" } },
	fhirCache: { tenantId: { __col: "tenant_id" } },
}))

jest.mock("@/config/env.config", () => ({
	env: { DATABASE_URL: "postgresql://test:5432/test" },
}))

import { _registerCls, db, tenantDb, TENANT_TABLES } from "./database.client"

const makeCls = (tenantId: string | undefined) => ({
	get: (_key: string) => tenantId,
})

describe("tenantDb()", () => {
	afterEach(() => {
		// Reset to uninitialized state between tests
		_registerCls(makeCls(undefined))
	})

	it("throws ForbiddenException when no tenant in CLS", () => {
		_registerCls(makeCls(undefined))
		expect(() => tenantDb()).toThrow(ForbiddenException)
	})

	it("throws ForbiddenException with descriptive message when no tenant", () => {
		_registerCls(makeCls(undefined))
		expect(() => tenantDb()).toThrow("No tenant in context")
	})

	it("returns tenantId when tenant is set in CLS", () => {
		_registerCls(makeCls("tenant-qc"))
		const { tenantId } = tenantDb()
		expect(tenantId).toBe("tenant-qc")
	})

	it("does not expose raw db on context (no escape hatch)", () => {
		_registerCls(makeCls("tenant-qc"))
		const ctx = tenantDb()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((ctx as any).db).toBeUndefined()
	})

	it("includes all expected tenant-scoped tables", () => {
		_registerCls(makeCls("tenant-qc"))
		const { tables } = tenantDb()
		const expected: Array<keyof typeof TENANT_TABLES> = [
			"patients",
			"practitioners",
			"healthcareCases",
			"caseSequences",
			"caseEvents",
			"caseAttachments",
			"notifications",
			"auditLogs",
			"fhirCache",
		]
		for (const key of expected) {
			expect(tables).toHaveProperty(key)
		}
	})

	it("does not include auth or template tables in TENANT_TABLES", () => {
		expect(TENANT_TABLES).not.toHaveProperty("users")
		expect(TENANT_TABLES).not.toHaveProperty("sessions")
		expect(TENANT_TABLES).not.toHaveProperty("todos")
		expect(TENANT_TABLES).not.toHaveProperty("tenants")
	})
})

describe("tenantDb().select() auto-scoping", () => {
	let mockWhere: jest.Mock
	let mockFrom: jest.Mock
	let mockSelect: jest.Mock

	beforeEach(() => {
		jest.clearAllMocks()
		mockWhere = jest.fn().mockReturnValue("scoped-query")
		mockFrom = jest.fn().mockReturnValue({ where: mockWhere })
		mockSelect = jest.fn().mockReturnValue({ from: mockFrom })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(db as any).select = mockSelect
	})

	afterEach(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		delete (db as any).select
		_registerCls(makeCls(undefined))
	})

	it("calls db.select().from(table).where(...) with tenant filter", () => {
		_registerCls(makeCls("tenant-qc"))
		const ctx = tenantDb()
		ctx.select(TENANT_TABLES.patients)

		expect(mockSelect).toHaveBeenCalled()
		expect(mockFrom).toHaveBeenCalledWith(TENANT_TABLES.patients)
		expect(mockWhere).toHaveBeenCalled()
	})

	it("passes eq(table.tenantId, currentTenantId) as the WHERE predicate", () => {
		_registerCls(makeCls("tenant-qc"))
		const ctx = tenantDb()
		ctx.select(TENANT_TABLES.patients)

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { eq } = jest.requireMock("drizzle-orm") as { eq: jest.Mock }
		expect(eq).toHaveBeenCalledWith(TENANT_TABLES.patients.tenantId, "tenant-qc")
	})

	it("ANDs additionalWhere with the tenant filter when provided", () => {
		_registerCls(makeCls("tenant-qc"))
		const ctx = tenantDb()
		const extra = { __type: "extra" }
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		ctx.select(TENANT_TABLES.patients, extra as any)

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { and } = jest.requireMock("drizzle-orm") as { and: jest.Mock }
		expect(and).toHaveBeenCalled()
	})

	it("does NOT call and() when no additionalWhere is given", () => {
		_registerCls(makeCls("tenant-qc"))
		const ctx = tenantDb()
		ctx.select(TENANT_TABLES.patients)

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { and } = jest.requireMock("drizzle-orm") as { and: jest.Mock }
		expect(and).not.toHaveBeenCalled()
	})

	it("throws ForbiddenException outside a CLS tenant even with select", () => {
		_registerCls(makeCls(undefined))
		expect(() => tenantDb()).toThrow(ForbiddenException)
	})
})

describe("raw db singleton", () => {
	it("is defined as module-level export for Better Auth and audit writes", () => {
		expect(db).toBeDefined()
	})

	it("is not accessible via tenantDb() context (no bypass possible)", () => {
		_registerCls(makeCls("tenant-qc"))
		const ctx = tenantDb()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((ctx as any).db).toBeUndefined()
	})
})
