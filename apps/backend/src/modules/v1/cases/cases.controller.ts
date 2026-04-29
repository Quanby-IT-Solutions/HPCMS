import { Controller, UseGuards } from "@nestjs/common"
import { Implement } from "@orpc/nest"
import { implement } from "@orpc/server"

import { v1 } from "@/config/api-versions.config"
import { TenancyService } from "@/common/tenancy/tenancy.service"
import { EmailVerifiedGuard } from "@/shared/guards/email-verified.guard"
import { Roles } from "@/shared/decorators/roles.decorator"
import { Audited } from "@/shared/decorators/audited.decorator"

import { CasesService } from "./cases.service"

@Controller()
export class CasesController {
	constructor(
		private readonly casesService: CasesService,
		private readonly tenancyService: TenancyService,
	) {}

	@Implement(v1.cases.loa.requestUploads)
	@Roles("patient")
	@UseGuards(EmailVerifiedGuard)
	async loaRequestUploads() {
		return implement(v1.cases.loa.requestUploads).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.casesService.requestUploads(input, userId)
		})
	}

	@Implement(v1.cases.loa.submit)
	@Roles("patient")
	@UseGuards(EmailVerifiedGuard)
	@Audited("case.create", { targetType: "case", targetIdFrom: "result.caseId" })
	async loaSubmit() {
		return implement(v1.cases.loa.submit).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.casesService.submit(input, userId)
		})
	}

	@Implement(v1.cases.myRequests)
	@Roles("patient")
	async myRequests() {
		return implement(v1.cases.myRequests).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.casesService.myRequests(input, userId)
		})
	}

	@Implement(v1.cases.get)
	@Roles("patient", "case_agent", "case_supervisor", "tenant_admin", "system_admin")
	async getCase() {
		return implement(v1.cases.get).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.casesService.get(input, userId)
		})
	}

	@Implement(v1.cases.withdraw)
	@Roles("patient")
	@Audited("case.withdraw", { targetType: "case", targetIdFrom: "result.caseId" })
	async withdraw() {
		return implement(v1.cases.withdraw).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.casesService.withdraw(input, userId)
		})
	}

	@Implement(v1.cases.list)
	@Roles("case_agent", "case_supervisor", "tenant_admin", "system_admin")
	async list() {
		return implement(v1.cases.list).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.casesService.list(input, userId)
		})
	}

	@Implement(v1.cases.claim)
	@Roles("case_agent", "case_supervisor", "tenant_admin", "system_admin")
	@Audited("case.claim", { targetType: "case", targetIdFrom: "result.caseId" })
	async claim() {
		return implement(v1.cases.claim).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.casesService.claim(input, userId)
		})
	}

	@Implement(v1.cases.assign)
	@Roles("case_supervisor", "tenant_admin", "system_admin")
	@Audited("case.assign", { targetType: "case", targetIdFrom: "result.caseId" })
	async assign() {
		return implement(v1.cases.assign).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.casesService.assign(input, userId)
		})
	}

	@Implement(v1.cases.approve)
	@Roles("case_agent", "case_supervisor", "tenant_admin", "system_admin")
	@Audited("case.approve", { targetType: "case", targetIdFrom: "result.caseId" })
	async approve() {
		return implement(v1.cases.approve).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.casesService.approve(input, userId)
		})
	}

	@Implement(v1.cases.reject)
	@Roles("case_agent", "case_supervisor", "tenant_admin", "system_admin")
	@Audited("case.reject", { targetType: "case", targetIdFrom: "result.caseId" })
	async reject() {
		return implement(v1.cases.reject).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.casesService.reject(input, userId)
		})
	}

	@Implement(v1.cases.close)
	@Roles("case_agent", "case_supervisor", "tenant_admin", "system_admin")
	@Audited("case.close", { targetType: "case", targetIdFrom: "result.caseId" })
	async close() {
		return implement(v1.cases.close).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.casesService.close(input, userId)
		})
	}

	@Implement(v1.cases.addEvent)
	@Roles("case_agent", "case_supervisor", "tenant_admin", "system_admin")
	@Audited("case.add_event", { targetType: "case", targetIdFrom: "result.caseId" })
	async addEvent() {
		return implement(v1.cases.addEvent).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.casesService.addEvent(input, userId)
		})
	}
}
