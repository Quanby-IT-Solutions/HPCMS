import Link from "next/link"

import { ExternalLink, ShieldCheck } from "@/core/components/icons"
import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"

export default function ClinicianFallbackPage() {
	return (
		<main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
			<header className="flex flex-col gap-1">
				<p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
					Overview
				</p>
				<h1 className="text-2xl font-semibold">PCMS Clinician Sidebar</h1>
				<p className="text-muted-foreground text-sm">
					Embedded patient case context, launched from your EMR via SMART on FHIR.
				</p>
			</header>

			<Alert>
				<AlertTitle>Launch from your EMR</AlertTitle>
				<AlertDescription>
					This sidebar is designed to be embedded inside Altera Sunrise (or a compatible
					SMART on FHIR EMR). Open a patient chart in the EMR and use the PCMS launch
					button to access patient case context here.
				</AlertDescription>
			</Alert>

			<section className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ShieldCheck className="size-4" />
							SMART launch URL
						</CardTitle>
					</CardHeader>
					<CardContent className="text-muted-foreground flex flex-col gap-2 text-sm">
						<p>Launch with these query parameters:</p>
						<code className="bg-muted block rounded-md px-2 py-1.5 text-xs">
							/clinician/launch?iss=&lt;FHIR base&gt;&amp;launch=&lt;launch token&gt;
						</code>
						<p className="text-xs">
							The flow runs PKCE-protected OAuth, validates the launch context with
							PCMS, and redirects you into the patient sidebar.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ExternalLink className="size-4" />
							Preview links
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-2 text-sm">
						<Link
							href="/clinician/sidebar/patient-maria-santos"
							className="text-primary hover:underline"
						>
							→ Sidebar preview (mock patient)
						</Link>
						<Link
							href="/clinician/design-showcase"
							className="text-primary hover:underline"
						>
							→ UX primitives showcase
						</Link>
						<p className="text-muted-foreground mt-1 text-xs">
							These pages render with mock data so you can verify the UI without an
							active EMR launch.
						</p>
					</CardContent>
				</Card>
			</section>

			<section className="text-muted-foreground space-y-2 text-xs">
				<p>
					Administrators: see <code>apps/web/docs/clinician-smart-launch.md</code> for
					launch URL and OAuth configuration.
				</p>
			</section>
		</main>
	)
}
