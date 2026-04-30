import "server-only"

interface SmartConfiguration {
	authorization_endpoint: string
	token_endpoint: string
	scopes_supported?: string[]
	code_challenge_methods_supported?: string[]
}

export class SmartDiscoveryError extends Error {
	constructor(
		readonly iss: string,
		message: string
	) {
		super(message)
		this.name = "SmartDiscoveryError"
	}
}

export async function discoverSmartConfiguration(iss: string): Promise<SmartConfiguration> {
	const base = iss.replace(/\/$/, "")
	const url = `${base}/.well-known/smart-configuration`
	let response: Response
	try {
		response = await fetch(url, {
			headers: { Accept: "application/json" },
			cache: "no-store",
		})
	} catch (err) {
		throw new SmartDiscoveryError(iss, `network error fetching ${url}: ${(err as Error).message}`)
	}
	if (!response.ok) {
		throw new SmartDiscoveryError(iss, `discovery returned ${response.status} for ${url}`)
	}
	const data = (await response.json()) as Partial<SmartConfiguration>
	if (!data.authorization_endpoint || !data.token_endpoint) {
		throw new SmartDiscoveryError(iss, "missing authorization_endpoint or token_endpoint")
	}
	return data as SmartConfiguration
}
