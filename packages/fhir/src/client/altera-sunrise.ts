import { OAuthClientCredentials } from "../auth/oauth-client-credentials.js"
import { FhirAuthError, FhirNotFoundError, FhirTransientError } from "../errors.js"
import { FhirPatient, FhirPatientSchema } from "../models/patient.js"
import { FhirPractitioner, FhirPractitionerSchema } from "../models/practitioner.js"
import { FhirClient, PatientSearchParams } from "../types.js"

export interface AlteraSunriseConfig {
	baseUrl: string
	clientId: string
	clientSecret: string
	tokenUrl?: string
	scope?: string
}

export class AlteraSunriseFhirClient implements FhirClient {
	private readonly oauth: OAuthClientCredentials

	constructor(private readonly config: AlteraSunriseConfig) {
		this.oauth = new OAuthClientCredentials({
			tokenUrl: config.tokenUrl ?? `${config.baseUrl}/oauth2/token`,
			clientId: config.clientId,
			clientSecret: config.clientSecret,
			scope: config.scope,
		})
	}

	private async request<T>(path: string): Promise<T> {
		let token: string
		try {
			token = await this.oauth.getAccessToken()
		} catch (err) {
			throw new FhirAuthError((err as Error).message)
		}

		let res: Response
		try {
			res = await fetch(`${this.config.baseUrl}/fhir/r4${path}`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/fhir+json",
				},
			})
		} catch (err) {
			throw new FhirTransientError((err as Error).message)
		}

		if (res.status === 401 || res.status === 403) {
			this.oauth.clearCache()
			throw new FhirAuthError(`FHIR auth failed: ${res.status}`)
		}
		if (res.status === 404) {
			throw new FhirNotFoundError(path.split("/")[1] ?? "Resource", path.split("/")[2] ?? "unknown")
		}
		if (!res.ok) {
			throw new FhirTransientError(`FHIR upstream error: ${res.status} ${res.statusText}`)
		}

		return res.json() as Promise<T>
	}

	async getPatient(id: string): Promise<FhirPatient> {
		const raw = await this.request<unknown>(`/Patient/${id}`)
		return FhirPatientSchema.parse(raw)
	}

	async searchPatient(params: PatientSearchParams): Promise<FhirPatient[]> {
		const qs = new URLSearchParams()
		if (params.identifier) qs.set("identifier", params.identifier)
		if (params.family) qs.set("family", params.family)
		if (params.birthDate) qs.set("birthdate", params.birthDate)

		const raw = await this.request<{ entry?: Array<{ resource: unknown }> }>(`/Patient?${qs.toString()}`)
		return (raw.entry ?? []).map(e => FhirPatientSchema.parse(e.resource))
	}

	async getPractitioner(id: string): Promise<FhirPractitioner> {
		const raw = await this.request<unknown>(`/Practitioner/${id}`)
		return FhirPractitionerSchema.parse(raw)
	}
}
