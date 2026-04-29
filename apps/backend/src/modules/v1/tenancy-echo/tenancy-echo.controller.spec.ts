import { Test, type TestingModule } from "@nestjs/testing"

import { TenancyService } from "@/common/tenancy/tenancy.service"

import { TenancyEchoController } from "./tenancy-echo.controller"

const mockTenancyService = {
	getTenantId: jest.fn(),
}

describe("TenancyEchoController", () => {
	let controller: TenancyEchoController

	beforeEach(async () => {
		jest.clearAllMocks()
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TenancyEchoController],
			providers: [{ provide: TenancyService, useValue: mockTenancyService }],
		}).compile()

		controller = module.get<TenancyEchoController>(TenancyEchoController)
	})

	it("should be defined", () => {
		expect(controller).toBeDefined()
	})

	it("returns tenantId from CLS when present", () => {
		mockTenancyService.getTenantId.mockReturnValue("tenant-qc")
		expect(controller.echo()).toEqual({ tenantId: "tenant-qc" })
	})

	it("returns null when no tenant in CLS", () => {
		mockTenancyService.getTenantId.mockReturnValue(undefined)
		expect(controller.echo()).toEqual({ tenantId: null })
	})
})
