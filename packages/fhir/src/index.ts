export { AlteraSunriseFhirClient } from "./client/altera-sunrise.js"
export { StubFhirClient } from "./client/stub.js"
export { FhirAuthError, FhirNotFoundError, FhirTransientError } from "./errors.js"
export { FhirPatientSchema } from "./models/patient.js"
export type { FhirPatient } from "./models/patient.js"
export { FhirPractitionerSchema } from "./models/practitioner.js"
export type { FhirPractitioner } from "./models/practitioner.js"
export type { FhirClient, FhirClientConfig, PatientSearchParams } from "./types.js"

import { AlteraSunriseFhirClient } from "./client/altera-sunrise.js"
import { StubFhirClient } from "./client/stub.js"
import type { FhirClient, FhirClientConfig } from "./types.js"

export function createFhirClient(config: FhirClientConfig): FhirClient {
	if (config.mode === "stub") {
		return new StubFhirClient()
	}

	if (!config.baseUrl || !config.clientId || !config.clientSecret) {
		throw new Error("FHIR_BASE_URL, FHIR_CLIENT_ID, and FHIR_CLIENT_SECRET are required for altera mode")
	}

	return new AlteraSunriseFhirClient({
		baseUrl: config.baseUrl,
		clientId: config.clientId,
		clientSecret: config.clientSecret,
		tokenUrl: config.tokenUrl,
		scope: config.scope,
	})
}
