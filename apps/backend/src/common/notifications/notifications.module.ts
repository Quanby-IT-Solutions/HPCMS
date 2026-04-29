import { Global, Module } from "@nestjs/common"

import { EmailModule } from "@/common/email/email.module"

import { NotificationsService } from "./notifications.service"

@Global()
@Module({
	imports: [EmailModule],
	providers: [NotificationsService],
	exports: [NotificationsService],
})
export class NotificationsModule {}
