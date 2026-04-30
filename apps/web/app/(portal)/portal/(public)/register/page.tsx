import Link from "next/link"

import { RegistrationForm } from "@/features/portal-shared/components/registration-form"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

export default function PortalRegisterPage() {
	return (
		<div className="mx-auto flex max-w-lg flex-col gap-6">
			<header>
				<h1 className="text-2xl font-bold">Create your patient account</h1>
				<p className="text-muted-foreground mt-1 text-sm">
					Sign up to submit LOA requests and track your cases.
				</p>
			</header>
			<RegistrationForm />
			<p className="text-muted-foreground text-sm">
				Already registered?{" "}
				<Link href={PORTAL_ROUTES.login} className="text-primary hover:underline">
					Log in
				</Link>
			</p>
		</div>
	)
}
