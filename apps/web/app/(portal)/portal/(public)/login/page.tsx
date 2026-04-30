import Link from "next/link"

import { PortalLoginForm } from "@/features/portal-shared/components/login-form"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

export default function PortalLoginPage() {
	return (
		<div className="mx-auto flex max-w-md flex-col gap-6">
			<header>
				<h1 className="text-2xl font-bold">Patient portal sign-in</h1>
				<p className="text-muted-foreground mt-1 text-sm">
					Use your SLMC patient account to access the portal.
				</p>
			</header>
			<PortalLoginForm />
			<div className="text-muted-foreground flex flex-col gap-2 text-sm">
				<Link
					href={PORTAL_ROUTES.passwordReset}
					className="text-primary hover:underline"
				>
					Forgot your password?
				</Link>
				<span>
					New here?{" "}
					<Link href={PORTAL_ROUTES.register} className="text-primary hover:underline">
						Create an account
					</Link>
				</span>
			</div>
		</div>
	)
}
