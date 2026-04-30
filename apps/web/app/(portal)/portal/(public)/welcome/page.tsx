import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

export default function WelcomePage() {
	return (
		<div className="mx-auto flex max-w-3xl flex-col gap-8">
			<header>
				<h1 className="text-2xl font-bold">Welcome to SLMC Patient Portal</h1>
				<p className="text-muted-foreground mt-1 text-sm">
					Your account is verified. Here are a few quick-start links.
				</p>
			</header>

			<section className="grid gap-3 sm:grid-cols-3">
				<Link
					href={PORTAL_ROUTES.loaNew}
					className="hover:bg-muted/40 rounded-md border p-4 transition-colors"
				>
					<p className="text-sm font-semibold">Submit an LOA</p>
					<p className="text-muted-foreground mt-1 text-xs">
						Upload your admitting order and start the request.
					</p>
				</Link>
				<Link
					href={PORTAL_ROUTES.requests}
					className="hover:bg-muted/40 rounded-md border p-4 transition-colors"
				>
					<p className="text-sm font-semibold">Track your requests</p>
					<p className="text-muted-foreground mt-1 text-xs">
						See live status of submitted cases.
					</p>
				</Link>
				<Link
					href={PORTAL_ROUTES.kb}
					className="hover:bg-muted/40 rounded-md border p-4 transition-colors"
				>
					<p className="text-sm font-semibold">Knowledge Base</p>
					<p className="text-muted-foreground mt-1 text-xs">
						Browse common questions and procedures.
					</p>
				</Link>
			</section>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Optional: enable MFA</CardTitle>
				</CardHeader>
				<CardContent className="text-muted-foreground flex items-center justify-between gap-4 text-sm">
					<span>
						Add a second factor for extra protection. You can do this later from your
						account settings.
					</span>
					<div className="flex shrink-0 items-center gap-2">
						<Link
							href={PORTAL_ROUTES.mfa}
							className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
						>
							Set up MFA
						</Link>
						<Link
							href={PORTAL_ROUTES.dashboard}
							className="text-muted-foreground hover:text-foreground inline-flex items-center px-2 py-1.5 text-xs"
						>
							Skip for now
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
