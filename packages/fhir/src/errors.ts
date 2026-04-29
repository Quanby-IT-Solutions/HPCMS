export class FhirNotFoundError extends Error {
	constructor(resourceType: string, id: string) {
		super(`FHIR ${resourceType}/${id} not found`)
		this.name = "FhirNotFoundError"
	}
}

export class FhirAuthError extends Error {
	constructor(message = "FHIR authentication failed") {
		super(message)
		this.name = "FhirAuthError"
	}
}

export class FhirTransientError extends Error {
	constructor(message = "FHIR upstream temporarily unavailable") {
		super(message)
		this.name = "FhirTransientError"
	}
}
