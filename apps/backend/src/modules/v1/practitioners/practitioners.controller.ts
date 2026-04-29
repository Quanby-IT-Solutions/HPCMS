import { Controller } from "@nestjs/common"
import { Implement } from "@orpc/nest"
import { implement } from "@orpc/server"

import { v1 } from "@/config/api-versions.config"
import { Roles } from "@/shared/decorators/roles.decorator"

import { PractitionersService } from "./practitioners.service"

const STAFF_ROLES = ["case_agent", "case_supervisor", "tenant_admin", "system_admin"]

@Controller()
export class PractitionersController {
	constructor(private readonly practitionersService: PractitionersService) {}

	@Implement(v1.practitioner.list)
	@Roles(...STAFF_ROLES)
	async listPractitioners() {
		return implement(v1.practitioner.list).handler(async ({ input }) => {
			return this.practitionersService.list(input)
		})
	}

	@Implement(v1.practitioner.get)
	@Roles(...STAFF_ROLES)
	async getPractitioner() {
		return implement(v1.practitioner.get).handler(async ({ input }) => {
			return this.practitionersService.findById(input)
		})
	}
}
