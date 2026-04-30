import "server-only"

import { env } from "@/env"

export const SMART_COOKIE_VERIFIER = "pcms-smart-verifier"
export const SMART_COOKIE_STATE = "pcms-smart-state"
export const SMART_COOKIE_ISS = "pcms-smart-iss"
export const SMART_COOKIE_LAUNCH = "pcms-smart-launch"

export const LAUNCH_COOKIE_NAMES = [
	SMART_COOKIE_VERIFIER,
	SMART_COOKIE_STATE,
	SMART_COOKIE_ISS,
	SMART_COOKIE_LAUNCH,
] as const

export const LAUNCH_COOKIE_OPTIONS = {
	httpOnly: true,
	sameSite: "none",
	secure: env.NODE_ENV === "production",
	path: "/clinician",
	maxAge: 60 * 10,
} as const
