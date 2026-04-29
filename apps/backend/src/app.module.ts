import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core"
import { AuthModule } from "@thallesp/nestjs-better-auth"
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod"

import { getAuth } from "@repo/auth"

import { AuditModule } from "@/common/audit/audit.module"
import { EmailModule } from "@/common/email/email.module"
import { FhirModule } from "@/common/fhir/fhir.module"
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter"
import { NotificationsModule } from "@/common/notifications/notifications.module"
import { StorageModule } from "@/common/storage/storage.module"
import { TenancyModule } from "@/common/tenancy/tenancy.module"
import { V1Module } from "@/modules/v1/v1.module"
import { RolesGuard } from "@/shared/guards/roles.guard"
import { TenancyGuard } from "@/shared/guards/tenancy.guard"
import { AuditInterceptor } from "@/shared/interceptors/audit.interceptor"

import { ORPCCommonModule } from "./common/orpc/orpc.module"
import { env } from "./config/env.config"

@Module({
	imports: [
		// Core configuration
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env",
			load: [() => env],
		}),
		// Authentication (controllers disabled - we register versioned routes in setupBetterAuth)
		AuthModule.forRoot({ auth: getAuth(), disableControllers: true }),
		// Tenancy (global — provides CLS + TenancyService)
		TenancyModule,
		// Email (also wires Better Auth email hooks in onModuleInit)
		EmailModule,
		// Cross-cutting services
		StorageModule,
		AuditModule,
		NotificationsModule,
		FhirModule,
		// oRPC setup
		ORPCCommonModule,
		// Versioned modules
		V1Module,
	],
	providers: [
		// Global providers
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ZodSerializerInterceptor,
		},
		// AuditInterceptor runs after ZodSerializerInterceptor (registration order)
		{
			provide: APP_INTERCEPTOR,
			useClass: AuditInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		// Global guards — order matters: TenancyGuard resolves tenant first, RolesGuard checks roles second
		{
			provide: APP_GUARD,
			useClass: TenancyGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AppModule {}
