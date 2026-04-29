import { redirect } from "next/navigation"

import { getSession } from "@/services/better-auth/auth-server"
import { VerifyForm } from "@/features/portal-mrn-verify/components/verify-form"

export default async function VerifyPage() {
	const session = await getSession()

	if (!session) {
		redirect("/login")
	}

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-bold">Verify Your Patient Record</h1>
				<p className="text-muted-foreground mt-1 text-sm">
					Link your account to your patient record to submit a Letter of Authorization.
				</p>
			</div>
			<VerifyForm />
		</div>
	)
}
