import { PortalFooter } from "@/features/portal-shared/components/portal-footer"
import { PortalHeader } from "@/features/portal-shared/components/portal-header"
import { getSession } from "@/services/better-auth/auth-server"

export default async function PortalPublicLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await getSession()
	const authed = session?.user.role === "patient"
	return (
		<div
			data-portal-shell
			className="bg-background flex min-h-screen flex-col text-base"
		>
			<PortalHeader authed={authed} userEmail={session?.user.email ?? null} />
			<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
			<PortalFooter />
		</div>
	)
}
