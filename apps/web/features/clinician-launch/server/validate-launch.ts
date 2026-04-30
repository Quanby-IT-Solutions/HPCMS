import "server-only"

import { env } from "@/env"

interface ValidateLaunchInput {
	code: string
	state: string
	codeVerifier: string
	iss: string
	redirectUri: string
}

interface ValidateLaunchOutput {
	patientId: string
	sessionEstablished: boolean
}

interface ValidateLaunchSuccess {
	ok: true
	patientId: string
	setCookieHeaders: string[]
}

interface ValidateLaunchFailure {
	ok: false
	reason: string
}

export type ValidateLaunchResult = ValidateLaunchSuccess | ValidateLaunchFailure

function getBackendValidateUrl(): string {
	const internal = env.INTERNAL_API_BASE_URL
	const external = env.NEXT_PUBLIC_API_BASE_URL
	const version = env.NEXT_PUBLIC_API_VERSION
	const base = (internal ?? external ?? "http://localhost:3000/api").replace(/\/$/, "")
	return `${base}/${version}/clinician/launch/validate`
}

/**
 * Posts the SMART authorization-code exchange to the backend.
 *
 * Owned by CL-BE-02. Until that lands, the dev fallback at
 * `/clinician/api/dev-validate` returns a stub session for `iss=stub:*`.
 */
export async function validateLaunchOnBackend(
	input: ValidateLaunchInput
): Promise<ValidateLaunchResult> {
	const useDevFallback = input.iss.startsWith("stub:") || input.iss.includes("localhost:4444")

	const url = useDevFallback
		? `${env.NEXT_PUBLIC_APP_URL}/clinician/api/dev-validate`
		: getBackendValidateUrl()

	let response: Response
	try {
		response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(input),
			cache: "no-store",
		})
	} catch (err) {
		return { ok: false, reason: `network error calling ${url}: ${(err as Error).message}` }
	}

	if (!response.ok) {
		return { ok: false, reason: `${response.status} ${response.statusText}` }
	}

	const data = (await response.json()) as Partial<ValidateLaunchOutput>
	if (!data.patientId) {
		return { ok: false, reason: "backend response missing patientId" }
	}

	const setCookieHeaders: string[] = []
	const setCookie = response.headers.get("set-cookie")
	if (setCookie) setCookieHeaders.push(setCookie)

	return { ok: true, patientId: data.patientId, setCookieHeaders }
}
