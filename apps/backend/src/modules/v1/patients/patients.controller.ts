import { Controller, UseGuards } from "@nestjs/common"
import { Implement } from "@orpc/nest"
import { implement } from "@orpc/server"

import { v1 } from "@/config/api-versions.config"
import { TenancyService } from "@/common/tenancy/tenancy.service"
import { EmailVerifiedGuard } from "@/shared/guards/email-verified.guard"
import { Roles } from "@/shared/decorators/roles.decorator"
import { Audited } from "@/shared/decorators/audited.decorator"

import { PatientsService } from "./patients.service"

@Controller()
export class PatientsController {
	constructor(
		private readonly patientsService: PatientsService,
		private readonly tenancyService: TenancyService
	) {}

	@Implement(v1.patient.me)
	@Roles("patient")
	async getMe() {
		return implement(v1.patient.me).handler(async () => {
			const userId = this.tenancyService.getUserId()
			if (!userId) return null
			return this.patientsService.me(userId)
		})
	}

	@Implement(v1.patient.verifyMrn)
	@Roles("patient")
	@UseGuards(EmailVerifiedGuard)
	@Audited("patient.link", { targetType: "patient", targetIdFrom: "result.patient.id" })
	async verifyMrn() {
		return implement(v1.patient.verifyMrn).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.patientsService.verifyMrn({ ...input, userId })
		})
	}

	@Implement(v1.patient.get)
	@Roles("case_agent", "case_supervisor", "tenant_admin", "system_admin")
	async getPatient() {
		return implement(v1.patient.get).handler(async ({ input }) => {
			return this.patientsService.findById(input)
		})
	}

	@Implement(v1.patient.search)
	@Roles("case_agent", "case_supervisor", "tenant_admin", "system_admin")
	async searchPatients() {
		return implement(v1.patient.search).handler(async ({ input }) => {
			return this.patientsService.search(input)
		})
	}
}
