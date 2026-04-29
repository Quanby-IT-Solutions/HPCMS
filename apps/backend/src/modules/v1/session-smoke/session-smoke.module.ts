import { Module } from "@nestjs/common"

import { SessionSmokeController } from "./session-smoke.controller"

@Module({
	controllers: [SessionSmokeController],
})
export class SessionSmokeModule {}
