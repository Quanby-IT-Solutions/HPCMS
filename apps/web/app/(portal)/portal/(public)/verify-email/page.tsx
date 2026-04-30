import Link from "next/link"

import { PortalAlert } from "@/features/portal-shared/components/portal-alert"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

interface Props {
	searchParams: Promise<{ token?: string; email?: string }>
}

export default async function VerifyEmailPage({ searchParams }: Props) {
	const { token, email } = await searchParams
	if (!token) {
		return (
			<div className="mx-auto flex max-w-lg flex-col gap-4">
				<h1 className="text-2xl font-bold">Verify your email</h1>
				<PortalAlert
					variant="info"
					title={email ? `Verification sent to ${email}` : "Verification sent"}
					description="Open the email and click the verification link. The link expires in 24 hours."
				/>
				<p className="text-muted-foreground text-sm">
					Already verified?{" "}
					<Link href={PORTAL_ROUTES.login} className="text-primary hover:underline">
						Log in
					</Link>
				</p>
			</div>
		)
	}
	// In a real flow we'd call patientPortal.registration.verify({ token }).
	// Backend stub will return one of activated|expired|invalid.
	return (
		<div className="mx-auto flex max-w-lg flex-col gap-4">
			<h1 className="text-2xl font-bold">Verifying your email…</h1>
			<PortalAlert
				variant="success"
				title="Account activated"
				description={
					<>
						Your account is ready.{" "}
						<Link href={PORTAL_ROUTES.welcome} className="text-primary hover:underline">
							Continue to your portal welcome page
						</Link>
						.
					</>
				}
			/>
		</div>
	)
}
