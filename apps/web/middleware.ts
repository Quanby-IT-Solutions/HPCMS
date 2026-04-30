import { NextResponse, type NextRequest } from "next/server"

import { env } from "@/env"

// Better Auth default session cookie name
const SESSION_COOKIE_NAME = "better-auth.session_token"

function getAuthUrl(): string {
	const internal = env.INTERNAL_API_BASE_URL
	const external = env.NEXT_PUBLIC_API_BASE_URL
	const version = env.NEXT_PUBLIC_API_VERSION ?? "v1"
	const base = (internal ?? external ?? "http://localhost:3000/api").replace(/\/$/, "")
	return `${base}/${version}/auth`
}

async function resolveSession(request: NextRequest) {
	try {
		const cookieHeader = request.headers.get("cookie") ?? ""
		const response = await fetch(`${getAuthUrl()}/get-session`, {
			headers: {
				"Content-Type": "application/json",
				cookie: cookieHeader,
			},
		})
		if (!response.ok) return null
		return response.json() as Promise<{ user?: { role?: string } } | null>
	} catch {
		return null
	}
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)

	// Clinician sidebar routes establish their own session via SMART launch.
	// They must not be redirected to /login or to a role-based dashboard.
	if (pathname.startsWith("/clinician")) {
		return NextResponse.next()
	}

	// Public portal sub-paths: marketing landing, auth pages, knowledge base,
	// design showcase. PAT-FE-01 AC1 explicitly requires `/portal` to be
	// reachable without login.
	const portalPublicPrefixes = [
		"/portal/login",
		"/portal/register",
		"/portal/password-reset",
		"/portal/verify-email",
		"/portal/welcome",
		"/portal/mfa",
		"/portal/kb",
		"/portal/design-showcase",
	]
	const isPortalRoute = pathname.startsWith("/portal")
	const isPortalPublic =
		pathname === "/portal" || portalPublicPrefixes.some(p => pathname.startsWith(p))

	if (isPortalRoute && isPortalPublic) {
		return NextResponse.next()
	}

	// Bounce unauthenticated or stale-session users for protected routes.
	if (isPortalRoute || pathname.startsWith("/staff") || pathname.startsWith("/agent") || pathname.startsWith("/supervisor") || pathname.startsWith("/admin") || pathname.startsWith("/tenant-admin")) {
		const loginUrl = isPortalRoute ? "/portal/login" : "/login"
		if (!sessionCookie?.value) {
			return NextResponse.redirect(new URL(loginUrl, request.url))
		}
		const session = await resolveSession(request)
		if (!session?.user) {
			return NextResponse.redirect(new URL(loginUrl, request.url))
		}

		// /supervisor is restricted to supervisors and admins — redirect others to their dashboard
		if (pathname.startsWith("/supervisor")) {
			const role = session.user.role ?? ""
			const supervisorRoles = ["case_supervisor", "tenant_admin", "system_admin"]
			if (!supervisorRoles.includes(role)) {
				const fallback = role === "patient" ? "/portal/dashboard" : "/agent"
				return NextResponse.redirect(new URL(fallback, request.url))
			}
		}

		// /admin is restricted to system_admin only
		if (pathname.startsWith("/admin")) {
			const role = session.user.role ?? ""
			if (role !== "system_admin") {
				const fallback = role === "patient" ? "/portal/dashboard" : role === "case_supervisor" ? "/supervisor" : "/agent"
				return NextResponse.redirect(new URL(fallback, request.url))
			}
		}

		// /tenant-admin is restricted to tenant_admin and system_admin
		if (pathname.startsWith("/tenant-admin")) {
			const role = session.user.role ?? ""
			const tenantAdminRoles = ["tenant_admin", "system_admin"]
			if (!tenantAdminRoles.includes(role)) {
				const fallback = role === "patient" ? "/portal/dashboard" : role === "case_supervisor" ? "/supervisor" : "/agent"
				return NextResponse.redirect(new URL(fallback, request.url))
			}
		}

		return NextResponse.next()
	}

	// Redirect authenticated users away from / and /login based on role
	if (pathname === "/" || pathname === "/login") {
		if (!sessionCookie?.value) {
			return NextResponse.next()
		}
		const session = await resolveSession(request)
		if (!session?.user) {
			return NextResponse.next()
		}
		const role = session.user.role ?? "patient"
		if (role === "patient") {
			return NextResponse.redirect(new URL("/portal/dashboard", request.url))
		}
		if (role === "system_admin") {
			return NextResponse.redirect(new URL("/admin", request.url))
		}
		if (role === "tenant_admin") {
			return NextResponse.redirect(new URL("/tenant-admin", request.url))
		}
		if (role === "clinician") {
			return NextResponse.redirect(new URL("/clinician", request.url))
		}
		if (role === "case_supervisor") {
			return NextResponse.redirect(new URL("/supervisor", request.url))
		}
		// case_agent and any other staff role → agent workspace
		return NextResponse.redirect(new URL("/agent", request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		"/",
		"/login",
		"/portal/:path*",
		"/staff/:path*",
		"/agent/:path*",
		"/supervisor/:path*",
		"/clinician/:path*",
		"/admin/:path*",
		"/tenant-admin/:path*",
	],
}
