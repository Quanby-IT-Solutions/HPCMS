import { notFound, redirect } from "next/navigation"

import { getSession } from "@/services/better-auth/auth-server"

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
	const session = await getSession()

	if (!session) {
		redirect("/login")
	}

	if (session.user.role !== "patient") {
		notFound()
	}

	return (
		<div className="bg-background min-h-screen">
			<header className="border-b">
				<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
					<span className="font-semibold">Patient Portal</span>
					<span className="text-muted-foreground text-sm">{session.user.email}</span>
				</div>
			</header>
			<main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
		</div>
	)
}
