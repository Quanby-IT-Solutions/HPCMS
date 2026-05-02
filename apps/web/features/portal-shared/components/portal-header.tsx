"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useTheme } from "next-themes"

import { LogoIcon } from "@/core/components/logo"
import { useSignOutMutation } from "@/features/auth/api/session.hooks"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

// --- INLINE SVGS ---

function SunIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2" /><path d="M12 20v2" />
			<path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
			<path d="M2 12h2" /><path d="M20 12h2" />
			<path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
		</svg>
	)
}

function MoonIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</svg>
	)
}

function BellIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
			<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
		</svg>
	)
}

function MenuIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<line x1="4" x2="20" y1="12" y2="12" />
			<line x1="4" x2="20" y1="6" y2="6" />
			<line x1="4" x2="20" y1="18" y2="18" />
		</svg>
	)
}

function CloseIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	)
}

// --- COMPONENTS ---

interface PortalHeaderProps {
	authed: boolean
	userEmail?: string | null
}

export function PortalHeader({ authed, userEmail }: PortalHeaderProps) {
	const pathname = usePathname()
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	
	const [userMenuOpen, setUserMenuOpen] = useState(false)
	const [notificationsOpen, setNotificationsOpen] = useState(false)
	
	const { mutate: signOut, isPending: isSigningOut } = useSignOutMutation()

	useEffect(() => setMounted(true), [])

	const { scrollY } = useScroll()
	const headerBackground = useTransform(
		scrollY,
		[0, 50],
		["var(--card)", "var(--card)"] // We'll manage opacity via CSS for glass effect
	)
	const headerBorder = useTransform(
		scrollY,
		[0, 50],
		["rgba(0,0,0,0)", "var(--border)"] // Fallback if needed, we'll use a glass effect class
	)

	const navLinks = [
		{ name: "Home", href: PORTAL_ROUTES.dashboard },
		{ name: "My Cases", href: PORTAL_ROUTES.requests },
		{ name: "Submit LOA", href: PORTAL_ROUTES.loaNew },
		{ name: "Knowledge Base", href: PORTAL_ROUTES.kb },
	]

	// Extract initials for avatar
	const initials = userEmail ? userEmail.substring(0, 2).toUpperCase() : "U"

	return (
		<motion.header
			className="sticky top-0 z-50 w-full border-b transition-colors duration-300"
			style={{
				backgroundColor: "color-mix(in srgb, var(--card) 85%, transparent)",
				backdropFilter: "blur(16px)",
				borderBottomColor: headerBorder as any,
			}}
		>
			<div className="mx-auto flex h-[72px] max-w-[1080px] items-center justify-between px-4 sm:px-6">
				{/* Left Section */}
				<div className="flex items-center gap-4">
					<Link href={authed ? PORTAL_ROUTES.dashboard : PORTAL_ROUTES.home} className="flex items-center gap-3">
						<LogoIcon className="text-primary size-8" />
						<div className="bg-border hidden h-6 w-px sm:block" />
						<span className="text-muted-foreground hidden font-medium sm:block">
							Patient Portal
						</span>
					</Link>
				</div>

				{/* Center Section (Desktop) */}
				{authed && (
					<nav className="hidden items-center gap-6 md:flex">
						{navLinks.map((link) => {
							const isActive = pathname === link.href || pathname?.startsWith(link.href + "/")
							return (
								<Link
									key={link.name}
									href={link.href}
									className={`relative py-2 text-[15px] font-medium transition-colors ${
										isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
									}`}
								>
									{link.name}
									{isActive && (
										<motion.div
											layoutId="portal-nav-indicator"
											className="bg-primary absolute -bottom-[1px] left-0 h-[2px] w-full"
											initial={false}
											transition={{ type: "spring", stiffness: 500, damping: 30 }}
										/>
									)}
								</Link>
							)
						})}
					</nav>
				)}

				{/* Right Section */}
				<div className="flex items-center gap-3 sm:gap-4">
					{mounted && (
						<button
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							className="bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground relative flex h-8 w-14 cursor-pointer items-center rounded-full p-1 transition-colors"
							aria-label="Toggle dark mode"
						>
							<motion.div
								className="bg-background shadow-sm flex size-6 items-center justify-center rounded-full"
								layout
								transition={{ type: "spring", stiffness: 500, damping: 30 }}
								style={{
									marginLeft: theme === "dark" ? "auto" : "0",
								}}
							>
								{theme === "dark" ? <MoonIcon className="size-3.5" /> : <SunIcon className="size-3.5" />}
							</motion.div>
						</button>
					)}

					{authed ? (
						<>
							{/* Notification Bell */}
							<div className="relative">
								<button
									onClick={() => {
										setNotificationsOpen(!notificationsOpen)
										setUserMenuOpen(false)
									}}
									className="text-muted-foreground hover:text-foreground relative cursor-pointer p-2 transition-colors"
								>
									<BellIcon className="size-5" />
									{/* Fake dot for illustration */}
									<span className="bg-destructive absolute right-2 top-2 size-2 rounded-full ring-2 ring-[var(--card)]" />
								</button>
								<AnimatePresence>
									{notificationsOpen && (
										<motion.div
											initial={{ opacity: 0, y: 10, scale: 0.95 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: 10, scale: 0.95 }}
											transition={{ duration: 0.15, ease: "easeOut" }}
											className="bg-card border-border shadow-lg absolute right-0 top-full mt-2 w-80 rounded-xl border p-4"
										>
											<h4 className="mb-3 text-sm font-semibold">Recent Notifications</h4>
											<div className="flex flex-col gap-3">
												<div className="flex items-start gap-3">
													<div className="bg-primary/10 mt-0.5 rounded-full p-1.5">
														<BellIcon className="text-primary size-4" />
													</div>
													<div>
														<p className="text-foreground text-sm">Your LOA Request #4521 has been updated.</p>
														<p className="text-muted-foreground text-xs">2 hours ago</p>
													</div>
												</div>
												<div className="flex items-start gap-3">
													<div className="bg-chart-3/10 mt-0.5 rounded-full p-1.5">
														<BellIcon className="text-chart-3 size-4" />
													</div>
													<div>
														<p className="text-foreground text-sm">New message from Support.</p>
														<p className="text-muted-foreground text-xs">Yesterday</p>
													</div>
												</div>
											</div>
											<Link href={PORTAL_ROUTES.notifications} className="text-primary mt-4 block text-center text-sm font-medium hover:underline">
												View all notifications
											</Link>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* User Identity / Account Menu */}
							<div className="relative hidden items-center gap-2 md:flex">
								<span className="text-muted-foreground text-sm">{userEmail}</span>
								<button
									onClick={() => {
										setUserMenuOpen(!userMenuOpen)
										setNotificationsOpen(false)
									}}
									className="bg-primary text-primary-foreground focus:ring-ring flex size-8 cursor-pointer items-center justify-center rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2"
								>
									{initials}
								</button>
								
								<AnimatePresence>
									{userMenuOpen && (
										<motion.div
											initial={{ opacity: 0, y: 10, scale: 0.95 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: 10, scale: 0.95 }}
											transition={{ duration: 0.15, ease: "easeOut" }}
											className="bg-card border-border shadow-lg absolute right-0 top-full mt-2 w-56 rounded-xl border p-1"
										>
											<div className="border-border border-b px-3 py-2">
												<p className="text-foreground text-sm font-medium">{userEmail}</p>
											</div>
											<div className="p-1">
												<Link href="#" className="text-foreground hover:bg-secondary block rounded-md px-3 py-2 text-sm transition-colors">
													My Profile
												</Link>
												<Link href="#" className="text-foreground hover:bg-secondary block rounded-md px-3 py-2 text-sm transition-colors">
													Settings
												</Link>
											</div>
											<div className="border-border border-t p-1">
												<button
													onClick={() => signOut()}
													disabled={isSigningOut}
													className="text-destructive hover:bg-destructive/10 w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm transition-colors disabled:opacity-50"
												>
													{isSigningOut ? "Signing out..." : "Sign Out"}
												</button>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* Mobile Hamburger */}
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="text-muted-foreground hover:text-foreground cursor-pointer p-2 md:hidden"
							>
								{mobileMenuOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
							</button>
						</>
					) : (
						<div className="flex items-center gap-2">
							<Link
								href={PORTAL_ROUTES.login}
								className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
							>
								Log in
							</Link>
							<Link
								href={PORTAL_ROUTES.register}
								className="bg-primary text-primary-foreground hover:bg-primary/90 hidden rounded-md px-4 py-2 text-sm font-medium transition-colors sm:block"
							>
								Register
							</Link>
						</div>
					)}
				</div>
			</div>

			{/* Mobile Drawer Menu */}
			<AnimatePresence>
				{mobileMenuOpen && authed && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="bg-background border-border overflow-hidden border-b md:hidden"
					>
						<nav className="flex flex-col px-4 pb-6 pt-2">
							{navLinks.map((link) => (
								<Link
									key={link.name}
									href={link.href}
									onClick={() => setMobileMenuOpen(false)}
									className={`border-border flex h-12 items-center border-b text-[15px] transition-colors ${
										pathname === link.href ? "text-foreground font-semibold" : "text-muted-foreground"
									}`}
								>
									{link.name}
								</Link>
							))}
							<div className="mt-6 flex flex-col gap-4">
								<div className="flex items-center gap-3">
									<div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full text-sm font-semibold">
										{initials}
									</div>
									<span className="text-foreground text-sm font-medium">{userEmail}</span>
								</div>
								<button
									onClick={() => {
										signOut()
										setMobileMenuOpen(false)
									}}
									className="bg-destructive/10 text-destructive flex h-12 w-full items-center justify-center rounded-md font-medium"
								>
									Sign Out
								</button>
							</div>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	)
}
