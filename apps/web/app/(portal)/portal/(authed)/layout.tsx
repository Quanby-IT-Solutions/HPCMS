import { redirect } from "next/navigation"

import { ChatbotWidget } from "@/features/portal-shared/components/chatbot-widget"
import { PortalFooter } from "@/features/portal-shared/components/portal-footer"
import { PortalHeader } from "@/features/portal-shared/components/portal-header"
import { getSession } from "@/services/better-auth/auth-server"

function homeForRole(role: string | null | undefined): string {
	switch (role) {
		case "system_admin":
		case "tenant_admin":
			return "/staff/admin"
		case "case_agent":
		case "case_supervisor":
			return "/agent"
		case "clinician":
			return "/clinician"
		default:
			return "/login"
	}
}

export default async function PortalAuthedLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await getSession()
	if (!session) {
		redirect("/portal/login")
	}
	// Non-patient roles get sent to their own workspace (CA-FE-01 AC4).
	if (session.user.role !== "patient") {
		redirect(homeForRole(session.user.role))
	}
	return (
		<div
			data-portal-shell
			className="bg-background flex min-h-screen flex-col text-base"
		>
			<PortalHeader authed userEmail={session.user.email} />
			<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
			<PortalFooter />
			<ChatbotWidget />
		</div>
	)
}
