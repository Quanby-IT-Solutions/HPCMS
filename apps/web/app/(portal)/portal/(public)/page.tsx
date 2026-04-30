import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

export default function PortalLandingPage() {
	return (
		<div className="flex flex-col gap-10">
			<section className="flex flex-col gap-4">
				<h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
					Welcome to the SLMC Patient Portal
				</h1>
				<p className="text-muted-foreground max-w-2xl text-base">
					Submit Letter of Authorization requests, track your cases, ask the SLMC
					assistant questions, and message the care team — all from one place.
				</p>
				<div className="flex flex-wrap gap-3">
					<Link
						href={PORTAL_ROUTES.login}
						className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
					>
						Log in
					</Link>
					<Link
						href={PORTAL_ROUTES.register}
						className="border-border hover:bg-muted inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
					>
						Create an account
					</Link>
					<Link
						href={PORTAL_ROUTES.kb}
						className="text-muted-foreground hover:text-foreground inline-flex items-center px-2 py-2 text-sm font-medium hover:underline"
					>
						Browse knowledge base →
					</Link>
				</div>
			</section>

			<section className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Submit an LOA</CardTitle>
					</CardHeader>
					<CardContent className="text-muted-foreground text-sm">
						Upload your admitting order, HMO card, and IDs. We&apos;ll coordinate with
						the care team and your HMO and keep you posted on every status change.
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Track your requests</CardTitle>
					</CardHeader>
					<CardContent className="text-muted-foreground text-sm">
						Real-time status updates, full history of team responses, and one-click
						replies — no more chasing email threads.
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Ask the SLMC assistant</CardTitle>
					</CardHeader>
					<CardContent className="text-muted-foreground text-sm">
						The portal chatbot can answer common questions and route you to a live agent
						if you need a human.
					</CardContent>
				</Card>
			</section>
		</div>
	)
}
