import { FhirNotFoundError } from "../errors.js"
import { FhirPatient, FhirPatientSchema } from "../models/patient.js"
import { FhirPractitioner, FhirPractitionerSchema } from "../models/practitioner.js"
import { FhirClient, PatientSearchParams } from "../types.js"

const STUB_PATIENTS: FhirPatient[] = [
	FhirPatientSchema.parse({
		resourceType: "Patient",
		id: "stub-patient-qc-001",
		identifier: [{ system: "urn:oid:2.16.840.1.113883.4.1", value: "QC-MRN-001" }],
		name: [{ use: "official", family: "Dela Cruz", given: ["Juan", "Manuel"] }],
		birthDate: "1985-03-15",
		gender: "male",
		telecom: [{ system: "phone", value: "+63-912-345-6789", use: "mobile" }],
		address: [{ use: "home", line: ["123 Rizal St"], city: "Quezon City", country: "PH" }],
	}),
	FhirPatientSchema.parse({
		resourceType: "Patient",
		id: "stub-patient-bgc-001",
		identifier: [{ system: "urn:oid:2.16.840.1.113883.4.1", value: "BGC-MRN-001" }],
		name: [{ use: "official", family: "Santos", given: ["Maria", "Clara"] }],
		birthDate: "1992-07-22",
		gender: "female",
		telecom: [{ system: "email", value: "maria.santos@example.com" }],
		address: [{ use: "home", line: ["45 McKinley Rd"], city: "Bonifacio Global City", country: "PH" }],
	}),
]

const STUB_PRACTITIONERS: FhirPractitioner[] = [
	FhirPractitionerSchema.parse({
		resourceType: "Practitioner",
		id: "stub-prac-001",
		identifier: [{ system: "urn:ph:prc", value: "PRC-12345" }],
		name: [{ use: "official", family: "Reyes", given: ["Antonio"], prefix: ["Dr."] }],
		gender: "male",
		qualification: [
			{
				code: { coding: [{ system: "http://snomed.info/sct", code: "59058001", display: "General physician" }] },
			},
		],
		specialty: [
			{ coding: [{ system: "http://snomed.info/sct", code: "394814009", display: "General practice" }] },
		],
	}),
]

export class StubFhirClient implements FhirClient {
	async getPatient(id: string): Promise<FhirPatient> {
		const patient = STUB_PATIENTS.find(p => p.id === id)
		if (!patient) throw new FhirNotFoundError("Patient", id)
		return patient
	}

	async searchPatient(params: PatientSearchParams): Promise<FhirPatient[]> {
		return STUB_PATIENTS.filter(p => {
			if (params.identifier) {
				const match = p.identifier?.some(i => i.value === params.identifier)
				if (!match) return false
			}
			if (params.family) {
				const match = p.name?.some(n => n.family?.toLowerCase().includes(params.family!.toLowerCase()))
				if (!match) return false
			}
			if (params.birthDate) {
				if (p.birthDate !== params.birthDate) return false
			}
			return true
		})
	}

	async getPractitioner(id: string): Promise<FhirPractitioner> {
		const prac = STUB_PRACTITIONERS.find(p => p.id === id)
		if (!prac) throw new FhirNotFoundError("Practitioner", id)
		return prac
	}
}
