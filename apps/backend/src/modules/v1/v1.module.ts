import { Module } from "@nestjs/common"

import { AttachmentsModule } from "./attachments/attachments.module"
import { CasesModule } from "./cases/cases.module"
import { HealthModule } from "./health/health.module"
import { NotificationsV1Module } from "./notifications/notifications.module"
import { PatientsModule } from "./patients/patients.module"
import { PractitionersModule } from "./practitioners/practitioners.module"
import { StaffAdminModule } from "./staff-admin/staff-admin.module"
import { TicketsModule } from "./tickets/tickets.module"

@Module({
	imports: [
		AttachmentsModule,
		CasesModule,
		HealthModule,
		NotificationsV1Module,
		PatientsModule,
		PractitionersModule,
		StaffAdminModule,
		TicketsModule,
	],
})
export class V1Module {}
