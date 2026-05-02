import { LandingPage } from "@/features/landing/landing-page"

export default function Home() {
	return <LandingPage />
}

// Legacy home content preserved below (unused)
async function _LegacyHome() {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { getSession } = await import("@/services/better-auth/auth-server")
	const session = await getSession()
	const isLoggedIn = !!session

	return (
		<div className="flex w-full flex-col items-center gap-12 pt-24 text-center">
			<div className="flex flex-col items-center gap-3">
				<p className="text-lg text-zinc-700 md:text-xl dark:text-zinc-300">
					{isLoggedIn ? (
						<>
							Hello <span className="font-semibold">{session.user.name}</span>
						</>
					) : (
						<>
							Welcome <span className="font-semibold">Everyone!</span>
						</>
					)}
				</p>
				<h1 className="text-6xl font-bold tracking-tight text-black md:text-7xl dark:text-zinc-50">
					TURBO TEMPLATE.
				</h1>
				<p className="max-w-2xl text-lg leading-8 text-zinc-600 md:text-2xl dark:text-zinc-400">
					A full-stack monorepo template with Next.js, NestJS, and Flutter. Built for rapid
					development with shared packages, type-safe APIs, and modern tooling.
				</p>
			</div>

			<NavigationLinks />

			<HomeCtaButton href={isLoggedIn ? "/dashboard" : "/login"} isLoggedIn={isLoggedIn} />
		</div>
	)
}
