import { FhirPatient } from "./models/patient"
import { FhirPractitioner } from "./models/practitioner"

export interface PatientSearchParams {
	identifier?: string
	family?: string
	birthDate?: string
}

export interface FhirClient {
	getPatient(id: string): Promise<FhirPatient>
	searchPatient(params: PatientSearchParams): Promise<FhirPatient[]>
	getPractitioner(id: string): Promise<FhirPractitioner>
}

export interface FhirClientConfig {
	mode: "stub" | "altera"
	baseUrl?: string
	clientId?: string
	clientSecret?: string
	tokenUrl?: string
	scope?: string
}
