import "dotenv/config"

import type { NextConfig } from "next"
import path from "node:path"

import "./env"

function buildClinicianFrameAncestors(): string {
	const raw = process.env.NEXT_PUBLIC_EMR_FRAME_ORIGINS ?? ""
	const origins = raw
		.split(/[\s,]+/)
		.map(o => o.trim())
		.filter(Boolean)
	if (origins.length === 0) return "'none'"
	return origins.join(" ")
}

/** @type {import("next").NextConfig} */
const config: NextConfig = {
	typedRoutes: true,
	output: "standalone",
	outputFileTracingRoot: path.resolve(import.meta.dirname, "../../"),

	/** Enables hot reloading for local packages without a build step */
	transpilePackages: [
		"@repo/auth",
		"@repo/backend",
		"@repo/contracts",
		"@repo/db",
		"@t3-oss/env-core",
		"@t3-oss/env-nextjs",
	],

	typescript: { ignoreBuildErrors: true },
	reactCompiler: true,

	devIndicators: {
		position: "bottom-right",
	},

	async headers() {
		const frameAncestors = buildClinicianFrameAncestors()
		return [
			{
				source: "/clinician/:path*",
				headers: [
					{
						key: "Content-Security-Policy",
						value: `frame-ancestors ${frameAncestors}`,
					},
				],
			},
			{
				source: "/((?!clinician).*)",
				headers: [
					{ key: "X-Frame-Options", value: "DENY" },
					{ key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
				],
			},
		]
	},
}

export default config
