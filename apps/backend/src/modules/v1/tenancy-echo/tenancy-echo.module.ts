import { Module } from "@nestjs/common"

import { TenancyEchoController } from "./tenancy-echo.controller"

@Module({
	controllers: [TenancyEchoController],
})
export class TenancyEchoModule {}
