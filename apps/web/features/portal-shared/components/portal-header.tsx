import Link from "next/link"

import { LogoIcon } from "@/core/components/logo"
import { SignOutButton } from "@/features/auth/components/sign-out-button"
import { PortalNotificationBell } from "@/features/portal-shared/components/portal-notification-bell"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

interface PortalHeaderProps {
	authed: boolean
	userEmail?: string | null
}

export function PortalHeader({ authed, userEmail }: PortalHeaderProps) {
	return (
		<header className="bg-background sticky top-0 z-30 border-b">
			<div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
				<Link
					href={authed ? PORTAL_ROUTES.dashboard : PORTAL_ROUTES.home}
					className="flex items-center gap-2"
				>
					<LogoIcon className="size-7" />
					<span className="text-base font-semibold">SLMC Patient Portal</span>
				</Link>
				<nav className="flex items-center gap-3 text-sm">
					{authed ? (
						<>
							<Link
								href={PORTAL_ROUTES.requests}
								className="text-muted-foreground hover:text-foreground"
							>
								My Requests
							</Link>
							<Link
								href={PORTAL_ROUTES.kb}
								className="text-muted-foreground hover:text-foreground"
							>
								Knowledge Base
							</Link>
							<PortalNotificationBell />
							{userEmail ? (
								<span className="text-muted-foreground hidden text-xs sm:inline">
									{userEmail}
								</span>
							) : null}
							<SignOutButton />
						</>
					) : (
						<>
							<Link
								href={PORTAL_ROUTES.kb}
								className="text-muted-foreground hover:text-foreground"
							>
								Knowledge Base
							</Link>
							<Link
								href={PORTAL_ROUTES.login}
								className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
							>
								Log in
							</Link>
							<Link
								href={PORTAL_ROUTES.register}
								className="border-border hover:bg-muted inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium"
							>
								Register
							</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	)
}
