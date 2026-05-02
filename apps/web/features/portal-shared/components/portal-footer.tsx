import Link from "next/link"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"
import { LogoIcon } from "@/core/components/logo"

function ShieldIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
			<path d="m9 12 2 2 4-4" />
		</svg>
	)
}

export function PortalFooter() {
	const currentYear = new Date().getFullYear()
	
	const footerLinks = [
		{ name: "Home", href: PORTAL_ROUTES.dashboard },
		{ name: "My Cases", href: PORTAL_ROUTES.requests },
		{ name: "Submit LOA", href: PORTAL_ROUTES.loaNew },
		{ name: "Knowledge Base", href: PORTAL_ROUTES.kb },
		{ name: "Privacy Policy", href: "#" },
		{ name: "Terms of Service", href: "#" },
	]

	return (
		<footer className="bg-card border-border mt-auto border-t">
			<div className="mx-auto max-w-[1080px] px-4 py-8 sm:px-6">
				{/* Top Row: Quick Links */}
				<div className="mb-8 flex flex-wrap justify-center gap-x-8 gap-y-4">
					{footerLinks.map((link) => (
						<Link
							key={link.name}
							href={link.href}
							className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
						>
							{link.name}
						</Link>
					))}
				</div>

				{/* Middle Row: Institutional Identity */}
				<div className="mb-8 flex flex-col items-center justify-center gap-3">
					<div className="flex items-center gap-2">
						<LogoIcon className="text-primary size-6" />
						<span className="text-foreground text-base font-semibold tracking-tight">St. Luke&apos;s Medical Center</span>
					</div>
					<div className="text-muted-foreground text-sm">
						Quezon City &middot; Bonifacio Global City
					</div>
				</div>

				{/* Bottom Row: Copyright & Compliance */}
				<div className="border-border flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
					<div className="text-muted-foreground text-xs">
						&copy; {currentYear} St. Luke&apos;s Medical Center. All rights reserved.
					</div>
					<div className="flex flex-wrap items-center justify-center gap-4 text-xs">
						<span className="text-muted-foreground">Powered by PCMS</span>
						<div className="bg-border hidden h-3 w-px sm:block" />
						<div className="text-muted-foreground flex items-center gap-1.5">
							<ShieldIcon className="size-3.5" />
							<span>Data Privacy Act 2012 Compliant</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
