import { NextResponse, type NextRequest } from "next/server"

import { env } from "@/env"
import {
	LAUNCH_COOKIE_NAMES,
	SMART_COOKIE_ISS,
	SMART_COOKIE_STATE,
	SMART_COOKIE_VERIFIER,
} from "@/features/clinician-launch/server/launch-cookies"
import { validateLaunchOnBackend } from "@/features/clinician-launch/server/validate-launch"

function errorRedirect(reason: string, request: NextRequest, detail?: string): NextResponse {
	const url = new URL("/clinician/callback/error", request.url)
	url.searchParams.set("reason", reason)
	if (detail) url.searchParams.set("detail", detail)
	return NextResponse.redirect(url, { status: 303 })
}

function clearLaunchCookies(response: NextResponse) {
	for (const name of LAUNCH_COOKIE_NAMES) {
		response.cookies.delete({ name, path: "/clinician" })
	}
}

export async function GET(request: NextRequest) {
	const code = request.nextUrl.searchParams.get("code")
	const state = request.nextUrl.searchParams.get("state")
	const error = request.nextUrl.searchParams.get("error")

	if (error) return errorRedirect("authorization-rejected", request, error)
	if (!code || !state) return errorRedirect("missing-callback-params", request)

	const expectedState = request.cookies.get(SMART_COOKIE_STATE)?.value
	const codeVerifier = request.cookies.get(SMART_COOKIE_VERIFIER)?.value
	const iss = request.cookies.get(SMART_COOKIE_ISS)?.value

	if (!expectedState || expectedState !== state) {
		return errorRedirect("state-mismatch", request)
	}

	if (!codeVerifier || !iss) {
		return errorRedirect("launch-context-lost", request)
	}

	const result = await validateLaunchOnBackend({
		code,
		state,
		codeVerifier,
		iss,
		redirectUri: env.NEXT_PUBLIC_SMART_REDIRECT_URI,
	})

	if (!result.ok) {
		const failure = errorRedirect("token-exchange-failed", request, result.reason)
		clearLaunchCookies(failure)
		return failure
	}

	const success = NextResponse.redirect(
		new URL(`/clinician/sidebar/${result.patientId}`, request.url),
		{ status: 303 }
	)
	clearLaunchCookies(success)
	for (const setCookie of result.setCookieHeaders) {
		success.headers.append("set-cookie", setCookie)
	}
	return success
}
