import { Controller } from "@nestjs/common"
import { Implement } from "@orpc/nest"
import { implement } from "@orpc/server"

import { v1 } from "@/config/api-versions.config"
import { TenancyService } from "@/common/tenancy/tenancy.service"
import { Roles } from "@/shared/decorators/roles.decorator"

import { AttachmentsService } from "./attachments.service"

@Controller()
export class AttachmentsController {
	constructor(
		private readonly attachmentsService: AttachmentsService,
		private readonly tenancyService: TenancyService,
	) {}

	@Implement(v1.attachments.signDownload)
	@Roles("patient", "case_agent", "case_supervisor", "tenant_admin", "system_admin")
	async signDownload() {
		return implement(v1.attachments.signDownload).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.attachmentsService.signDownload(input, userId)
		})
	}
}
