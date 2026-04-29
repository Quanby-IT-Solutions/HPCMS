import { Controller } from "@nestjs/common"
import { Implement } from "@orpc/nest"
import { implement } from "@orpc/server"

import { v1 } from "@/config/api-versions.config"
import { TenancyService } from "@/common/tenancy/tenancy.service"
import { Roles } from "@/shared/decorators/roles.decorator"

import { NotificationsReadService } from "./notifications.service"

@Controller()
export class NotificationsController {
	constructor(
		private readonly notificationsService: NotificationsReadService,
		private readonly tenancyService: TenancyService,
	) {}

	@Implement(v1.notifications.list)
	@Roles("patient", "case_agent", "case_supervisor", "tenant_admin", "system_admin", "clinician")
	async list() {
		return implement(v1.notifications.list).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return this.notificationsService.list(input as any, userId)
		})
	}

	@Implement(v1.notifications.markRead)
	@Roles("patient", "case_agent", "case_supervisor", "tenant_admin", "system_admin", "clinician")
	async markRead() {
		return implement(v1.notifications.markRead).handler(async ({ input }) => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return this.notificationsService.markRead(input as any, userId)
		})
	}

	@Implement(v1.notifications.markAllRead)
	@Roles("patient", "case_agent", "case_supervisor", "tenant_admin", "system_admin", "clinician")
	async markAllRead() {
		return implement(v1.notifications.markAllRead).handler(async () => {
			const userId = this.tenancyService.getUserId()
			if (!userId) throw new Error("User context unavailable")
			return this.notificationsService.markAllRead(userId)
		})
	}
}
