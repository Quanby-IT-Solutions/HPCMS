import { Controller } from "@nestjs/common"
import { Implement } from "@orpc/nest"
import { implement } from "@orpc/server"

import { v1 } from "@/config/api-versions.config"
import { TenancyService } from "@/common/tenancy/tenancy.service"
import { Roles } from "@/shared/decorators/roles.decorator"
import { Audited } from "@/shared/decorators/audited.decorator"

import { StaffAdminService } from "./staff-admin.service"

@Controller()
export class StaffAdminController {
	constructor(
		private readonly staffAdminService: StaffAdminService,
		private readonly tenancyService: TenancyService,
	) {}

	@Implement(v1.staffAdmin.users.list)
	@Roles("tenant_admin", "system_admin")
	async listUsers() {
		return implement(v1.staffAdmin.users.list).handler(async ({ input }) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return this.staffAdminService.listUsers(input as any)
		})
	}

	@Implement(v1.staffAdmin.users.invite)
	@Roles("tenant_admin", "system_admin")
	@Audited("staff_admin.users.invite", { targetType: "user", targetIdFrom: "result.userId" })
	async inviteUser() {
		return implement(v1.staffAdmin.users.invite).handler(async ({ input }) => {
			const actorUserId = this.tenancyService.getUserId()
			if (!actorUserId) throw new Error("User context unavailable")
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return this.staffAdminService.inviteUser(input as any, actorUserId)
		})
	}

	@Implement(v1.staffAdmin.users.setRole)
	@Roles("tenant_admin", "system_admin")
	@Audited("staff_admin.users.set_role", { targetType: "user", targetIdFrom: "input.userId" })
	async setRole() {
		return implement(v1.staffAdmin.users.setRole).handler(async ({ input }) => {
			const actorUserId = this.tenancyService.getUserId()
			if (!actorUserId) throw new Error("User context unavailable")
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return this.staffAdminService.setRole(input as any, actorUserId)
		})
	}

	@Implement(v1.staffAdmin.audit.list)
	@Roles("tenant_admin", "system_admin")
	async listAuditLogs() {
		return implement(v1.staffAdmin.audit.list).handler(async ({ input }) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return this.staffAdminService.listAuditLogs(input as any)
		})
	}
}
