import { NextResponse, type NextRequest } from "next/server"

import { env } from "@/env"

/**
 * Dev-only stub for CL-BE-02 (clinician.launch.validate).
 *
 * Accepts the same payload as the real endpoint and returns a hard-coded
 * patient context so the launch flow is exercisable end-to-end before the
 * backend lands. Disabled outside `development`.
 */
export async function POST(_request: NextRequest) {
	if (env.NODE_ENV === "production") {
		return NextResponse.json({ error: "dev-validate is disabled in production" }, { status: 404 })
	}

	return NextResponse.json({
		patientId: "patient-maria-santos",
		sessionEstablished: true,
	})
}
