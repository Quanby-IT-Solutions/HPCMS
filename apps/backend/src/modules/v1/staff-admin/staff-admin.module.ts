import { Module } from "@nestjs/common"

import { EmailModule } from "@/common/email/email.module"

import { StaffAdminController } from "./staff-admin.controller"
import { StaffAdminService } from "./staff-admin.service"

@Module({
	imports: [EmailModule],
	controllers: [StaffAdminController],
	providers: [StaffAdminService],
})
export class StaffAdminModule {}
