import { Module } from "@nestjs/common"

import { AttachmentsModule } from "./attachments/attachments.module"
import { CasesModule } from "./cases/cases.module"
import { ExamplesModule } from "./examples/examples.module"
import { HealthModule } from "./health/health.module"
import { NotificationsV1Module } from "./notifications/notifications.module"
import { PatientsModule } from "./patients/patients.module"
import { PractitionersModule } from "./practitioners/practitioners.module"
import { SessionSmokeModule } from "./session-smoke/session-smoke.module"
import { StaffAdminModule } from "./staff-admin/staff-admin.module"
import { TenancyEchoModule } from "./tenancy-echo/tenancy-echo.module"
import { TicketsModule } from "./tickets/tickets.module"

@Module({
	imports: [
		AttachmentsModule,
		CasesModule,
		ExamplesModule,
		HealthModule,
		NotificationsV1Module,
		PatientsModule,
		PractitionersModule,
		SessionSmokeModule,
		StaffAdminModule,
		TenancyEchoModule,
		TicketsModule,
	],
})
export class V1Module {}
