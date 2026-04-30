import { NextResponse, type NextRequest } from "next/server"

import { env } from "@/env"
import {
	LAUNCH_COOKIE_OPTIONS,
	SMART_COOKIE_ISS,
	SMART_COOKIE_LAUNCH,
	SMART_COOKIE_STATE,
	SMART_COOKIE_VERIFIER,
} from "@/features/clinician-launch/server/launch-cookies"
import {
	generateCodeChallenge,
	generateCodeVerifier,
	generateState,
} from "@/features/clinician-launch/server/pkce"
import {
	SmartDiscoveryError,
	discoverSmartConfiguration,
} from "@/features/clinician-launch/server/smart-discovery"

function errorRedirect(reason: string, request: NextRequest): NextResponse {
	const url = new URL("/clinician/launch/error", request.url)
	url.searchParams.set("reason", reason)
	return NextResponse.redirect(url, { status: 303 })
}

export async function GET(request: NextRequest) {
	const iss = request.nextUrl.searchParams.get("iss")
	const launch = request.nextUrl.searchParams.get("launch")

	if (!iss || !launch) {
		return errorRedirect("missing-launch-params", request)
	}

	let authorizationEndpoint: string
	try {
		const config = await discoverSmartConfiguration(iss)
		authorizationEndpoint = config.authorization_endpoint
	} catch (err) {
		const message = err instanceof SmartDiscoveryError ? err.message : "discovery-failed"
		const url = new URL("/clinician/launch/error", request.url)
		url.searchParams.set("reason", "discovery-failed")
		url.searchParams.set("detail", message)
		return NextResponse.redirect(url, { status: 303 })
	}

	const codeVerifier = generateCodeVerifier()
	const codeChallenge = generateCodeChallenge(codeVerifier)
	const state = generateState()

	const params = new URLSearchParams({
		response_type: "code",
		client_id: env.NEXT_PUBLIC_SMART_CLIENT_ID,
		redirect_uri: env.NEXT_PUBLIC_SMART_REDIRECT_URI,
		scope: env.NEXT_PUBLIC_SMART_SCOPES,
		state,
		aud: iss,
		launch,
		code_challenge: codeChallenge,
		code_challenge_method: "S256",
	})

	const response = NextResponse.redirect(`${authorizationEndpoint}?${params.toString()}`, {
		status: 303,
	})
	response.cookies.set(SMART_COOKIE_VERIFIER, codeVerifier, LAUNCH_COOKIE_OPTIONS)
	response.cookies.set(SMART_COOKIE_STATE, state, LAUNCH_COOKIE_OPTIONS)
	response.cookies.set(SMART_COOKIE_ISS, iss, LAUNCH_COOKIE_OPTIONS)
	response.cookies.set(SMART_COOKIE_LAUNCH, launch, LAUNCH_COOKIE_OPTIONS)
	return response
}
