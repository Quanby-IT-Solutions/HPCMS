import { Global, Module, OnModuleInit } from "@nestjs/common"
import { ClsModule, ClsService } from "nestjs-cls"

import { _registerCls } from "@/common/database/database.client"

import { TenancyService } from "./tenancy.service"

@Global()
@Module({
	imports: [
		ClsModule.forRoot({
			global: true,
			middleware: { mount: true },
		}),
	],
	providers: [TenancyService],
	exports: [TenancyService],
})
export class TenancyModule implements OnModuleInit {
	constructor(private readonly cls: ClsService) {}

	onModuleInit(): void {
		_registerCls(this.cls)
	}
}
