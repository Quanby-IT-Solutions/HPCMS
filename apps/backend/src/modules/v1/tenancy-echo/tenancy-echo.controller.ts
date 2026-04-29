import { Controller, Get, Version } from "@nestjs/common"

import { TenancyService } from "@/common/tenancy/tenancy.service"

@Controller("tenancy-echo")
export class TenancyEchoController {
	constructor(private readonly tenancyService: TenancyService) {}

	@Get()
	@Version("1")
	echo() {
		return {
			tenantId: this.tenancyService.getTenantId() ?? null,
		}
	}
}
