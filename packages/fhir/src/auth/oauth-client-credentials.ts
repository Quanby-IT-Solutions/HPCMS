export interface OAuthConfig {
	tokenUrl: string
	clientId: string
	clientSecret: string
	scope?: string
}

interface TokenResponse {
	access_token: string
	expires_in: number
	token_type: string
}

interface CachedToken {
	accessToken: string
	expiresAt: number
}

export class OAuthClientCredentials {
	private cached: CachedToken | null = null

	constructor(private readonly config: OAuthConfig) {}

	async getAccessToken(): Promise<string> {
		if (this.cached && Date.now() < this.cached.expiresAt - 30_000) {
			return this.cached.accessToken
		}
		return this.fetchToken()
	}

	private async fetchToken(): Promise<string> {
		const body = new URLSearchParams({
			grant_type: "client_credentials",
			client_id: this.config.clientId,
			client_secret: this.config.clientSecret,
			...(this.config.scope ? { scope: this.config.scope } : {}),
		})

		const res = await fetch(this.config.tokenUrl, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: body.toString(),
		})

		if (!res.ok) {
			throw new Error(`OAuth token fetch failed: ${res.status} ${res.statusText}`)
		}

		const data = (await res.json()) as TokenResponse
		this.cached = {
			accessToken: data.access_token,
			expiresAt: Date.now() + data.expires_in * 1000,
		}
		return this.cached.accessToken
	}

	clearCache(): void {
		this.cached = null
	}
}
