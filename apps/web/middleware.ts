import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Better Auth default session cookie name
const SESSION_COOKIE_NAME = "better-auth.session_token"

function getAuthUrl(): string {
	const internal = process.env.INTERNAL_API_BASE_URL
	const external = process.env.NEXT_PUBLIC_API_BASE_URL
	const version = process.env.NEXT_PUBLIC_API_VERSION ?? "v1"
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

	// Bounce unauthenticated or stale-session users to /login for protected routes
	if (pathname.startsWith("/portal") || pathname.startsWith("/staff")) {
		if (!sessionCookie?.value) {
			return NextResponse.redirect(new URL("/login", request.url))
		}
		const session = await resolveSession(request)
		if (!session?.user) {
			return NextResponse.redirect(new URL("/login", request.url))
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
			return NextResponse.redirect(new URL("/portal/my-requests", request.url))
		}
		if (role === "system_admin" || role === "tenant_admin") {
			return NextResponse.redirect(new URL("/staff/admin", request.url))
		}
		return NextResponse.redirect(new URL("/staff/cases", request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/", "/login", "/portal/:path*", "/staff/:path*"],
}
