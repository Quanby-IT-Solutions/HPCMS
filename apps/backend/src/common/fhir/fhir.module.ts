import { Global, Module } from "@nestjs/common"

import { createFhirClient } from "@repo/fhir"

import { env } from "@/config/env.config"

import { FhirCacheService } from "./fhir-cache.service"
import { FHIR_CLIENT } from "./fhir.tokens"

export { FHIR_CLIENT }

@Global()
@Module({
	providers: [
		{
			provide: FHIR_CLIENT,
			useFactory: () =>
				createFhirClient({
					mode: env.FHIR_MODE,
					baseUrl: env.FHIR_BASE_URL,
					clientId: env.FHIR_CLIENT_ID,
					clientSecret: env.FHIR_CLIENT_SECRET,
				}),
		},
		FhirCacheService,
	],
	exports: [FHIR_CLIENT, FhirCacheService],
})
export class FhirModule {}
