import { Module } from "@nestjs/common"

import { NotificationsController } from "./notifications.controller"
import { NotificationsReadService } from "./notifications.service"

@Module({
	controllers: [NotificationsController],
	providers: [NotificationsReadService],
})
export class NotificationsV1Module {}
