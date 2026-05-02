"use client"

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import type { StaffShellNavGroup } from "@/app/(staff)/staff-shell"

// ─── INLINE ICONS ──────────────────────────────────────────────────────────────

const SvgChevron = ({ size = 14 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
		<path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
)
const SvgMenu = ({ size = 18 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
		<path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
	</svg>
)
const SvgClose = ({ size = 18 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
		<path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
	</svg>
)
const SvgLogo = ({ size = 26 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 26 26" fill="none" aria-hidden="true">
		<rect x="1" y="1" width="24" height="24" rx="7" fill="currentColor" opacity="0.16" />
		<rect x="1" y="1" width="24" height="24" rx="7" stroke="currentColor" strokeWidth="1" opacity="0.55" />
		<path d="M13 5V21M5 13H21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
	</svg>
)

// ─── TYPES ─────────────────────────────────────────────────────────────────────

export interface AppShellUser {
	email: string
	name?: string | null
	role: string
}

export interface AppShellProps {
	title: string
	subtitle?: string
	navGroups: StaffShellNavGroup[]
	user: AppShellUser
	notificationsSlot?: ReactNode
	signOutSlot?: ReactNode
	children: ReactNode
}

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function isActive(pathname: string, href: string): boolean {
	if (pathname === href) return true
	return pathname.startsWith(`${href}/`)
}

function initials(user: AppShellUser): string {
	const source = user.name?.trim() || user.email
	const parts = source.split(/[\s@._-]+/).filter(Boolean)
	if (parts.length === 0) return "U"
	if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
	return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
}

function avatarHueIndex(user: AppShellUser): 1 | 2 | 3 | 4 | 5 {
	const seed = user.email
	let h = 0
	for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
	return ((h % 5) + 1) as 1 | 2 | 3 | 4 | 5
}

// ─── SIDEBAR ───────────────────────────────────────────────────────────────────

interface SidebarBodyProps {
	title: string
	subtitle?: string
	navGroups: StaffShellNavGroup[]
	collapsed: boolean
	onItemClick?: () => void
}

function SidebarBody({ title, subtitle, navGroups, collapsed, onItemClick }: SidebarBodyProps) {
	const pathname = usePathname()
	const reduced = useReducedMotion() ?? false

	return (
		<div className="flex h-full flex-col">
			{/* Workspace identity */}
			<div className="border-sidebar-border flex h-16 shrink-0 items-center gap-3 border-b px-4">
				<span className="text-sidebar-primary shrink-0">
					<SvgLogo size={26} />
				</span>
				<AnimatePresence initial={false}>
					{!collapsed && (
						<motion.div
							key="identity-text"
							initial={{ opacity: 0, x: -6 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -6 }}
							transition={{ duration: reduced ? 0 : 0.18 }}
							className="min-w-0 flex-1"
						>
							<p className="text-sidebar-foreground truncate text-[13.5px] font-semibold leading-tight tracking-tight">
								{title}
							</p>
							{subtitle ? (
								<p className="text-muted-foreground mt-0.5 truncate text-[10.5px] font-medium uppercase leading-tight tracking-wider">
									{subtitle}
								</p>
							) : null}
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Navigation groups */}
			<nav
				className="scrollbar-thin flex-1 overflow-y-auto overflow-x-hidden px-3 py-4"
				aria-label="Primary navigation"
			>
				{navGroups.map((group, groupIdx) => (
					<div key={group.label} className={groupIdx === 0 ? "" : "mt-5"}>
						<AnimatePresence initial={false}>
							{!collapsed ? (
								<motion.p
									key={`label-${group.label}`}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: reduced ? 0 : 0.15 }}
									className="text-muted-foreground mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
								>
									{group.label}
								</motion.p>
							) : groupIdx > 0 ? (
								<motion.div
									key={`divider-${group.label}`}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="bg-sidebar-border mx-3 mb-3 h-px"
								/>
							) : null}
						</AnimatePresence>

						<ul className="flex flex-col gap-0.5">
							{group.items.map(item => {
								const active = isActive(pathname, item.href)
								return (
									<li key={item.href} className="relative">
										<Link
											href={item.href}
											onClick={onItemClick}
											aria-current={active ? "page" : undefined}
											className={[
												"group/navitem relative flex items-center rounded-lg outline-none transition-colors",
												"focus-visible:ring-ring/60 focus-visible:ring-2",
												collapsed ? "h-10 w-10 justify-center mx-auto" : "h-9 gap-2.5 px-2.5",
												active
													? "text-sidebar-primary-foreground"
													: "text-sidebar-foreground/75 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
											].join(" ")}
										>
											{active && (
												<motion.span
													layoutId="sidebar-active-indicator"
													transition={
														reduced
															? { duration: 0 }
															: { type: "spring", stiffness: 380, damping: 32 }
													}
													className="bg-sidebar-primary absolute inset-0 rounded-lg"
													aria-hidden="true"
												/>
											)}
											<span
												className={[
													"relative z-10 flex shrink-0 items-center justify-center transition-colors",
													active ? "text-sidebar-primary-foreground" : "",
												].join(" ")}
											>
												{item.icon}
											</span>

											<AnimatePresence initial={false}>
												{!collapsed && (
													<motion.span
														key="label"
														initial={{ opacity: 0, x: -4 }}
														animate={{ opacity: 1, x: 0 }}
														exit={{ opacity: 0, x: -4 }}
														transition={{ duration: reduced ? 0 : 0.16 }}
														className="relative z-10 truncate text-[13.5px] font-medium"
													>
														{item.label}
													</motion.span>
												)}
											</AnimatePresence>

											{/* Tooltip in collapsed mode */}
											{collapsed && (
												<span
													role="tooltip"
													className={[
														"pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-50 -translate-y-1/2",
														"bg-card text-foreground border-border whitespace-nowrap rounded-md border px-2.5 py-1.5",
														"text-[12px] font-medium opacity-0 shadow-lg transition-all duration-150",
														"group-hover/navitem:translate-x-0 group-hover/navitem:opacity-100",
														"group-focus-visible/navitem:translate-x-0 group-focus-visible/navitem:opacity-100",
														"-translate-x-1",
													].join(" ")}
												>
													{item.label}
												</span>
											)}
										</Link>
									</li>
								)
							})}
						</ul>
					</div>
				))}
			</nav>
		</div>
	)
}

// ─── COLLAPSE TOGGLE ───────────────────────────────────────────────────────────

interface CollapseToggleProps {
	collapsed: boolean
	onToggle: () => void
	reduced: boolean
}

function CollapseToggle({ collapsed, onToggle, reduced }: CollapseToggleProps) {
	return (
		<div className="border-sidebar-border flex items-center justify-between border-t px-3 py-3">
			<AnimatePresence initial={false}>
				{!collapsed && (
					<motion.span
						key="version"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: reduced ? 0 : 0.15 }}
						className="text-muted-foreground text-[10.5px] font-medium tracking-wider"
					>
						PCMS v1.2.0
					</motion.span>
				)}
			</AnimatePresence>
			<motion.button
				type="button"
				onClick={onToggle}
				whileTap={reduced ? undefined : { scale: 0.92 }}
				aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
				aria-expanded={!collapsed}
				className={[
					"text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
					"focus-visible:ring-ring/60 flex h-7 w-7 items-center justify-center rounded-md",
					"transition-colors focus-visible:outline-none focus-visible:ring-2",
					collapsed ? "mx-auto" : "",
				].join(" ")}
			>
				<motion.span
					animate={{ rotate: collapsed ? 180 : 0 }}
					transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 24 }}
					className="flex"
				>
					<SvgChevron />
				</motion.span>
			</motion.button>
		</div>
	)
}

// ─── HEADER ────────────────────────────────────────────────────────────────────

interface HeaderProps {
	currentLabel: string
	user: AppShellUser
	notificationsSlot?: ReactNode
	signOutSlot?: ReactNode
	onMobileMenu: () => void
	mobileOpen: boolean
}

function Header({
	currentLabel,
	user,
	notificationsSlot,
	signOutSlot,
	onMobileMenu,
	mobileOpen,
}: HeaderProps) {
	const reduced = useReducedMotion() ?? false
	const hueIdx = avatarHueIndex(user)
	const initialsText = initials(user)
	const roleLabel = user.role.replace(/_/g, " ")

	return (
		<header
			className={[
				"bg-card/85 supports-backdrop-filter:bg-card/65 border-border sticky top-0 z-30",
				"flex h-15 items-center gap-3 border-b px-4 backdrop-blur sm:px-6",
			].join(" ")}
		>
			{/* Mobile menu */}
			<button
				type="button"
				onClick={onMobileMenu}
				aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
				aria-expanded={mobileOpen}
				className={[
					"text-muted-foreground hover:text-foreground hover:bg-secondary",
					"focus-visible:ring-ring/60 -ml-1 flex h-9 w-9 items-center justify-center rounded-md",
					"transition-colors focus-visible:outline-none focus-visible:ring-2 lg:hidden",
				].join(" ")}
			>
				<AnimatePresence mode="wait" initial={false}>
					{mobileOpen ? (
						<motion.span
							key="x"
							initial={reduced ? false : { opacity: 0, rotate: -45 }}
							animate={{ opacity: 1, rotate: 0 }}
							exit={reduced ? undefined : { opacity: 0, rotate: 45 }}
							transition={{ duration: 0.15 }}
							className="flex"
						>
							<SvgClose />
						</motion.span>
					) : (
						<motion.span
							key="menu"
							initial={reduced ? false : { opacity: 0, rotate: 45 }}
							animate={{ opacity: 1, rotate: 0 }}
							exit={reduced ? undefined : { opacity: 0, rotate: -45 }}
							transition={{ duration: 0.15 }}
							className="flex"
						>
							<SvgMenu />
						</motion.span>
					)}
				</AnimatePresence>
			</button>

			{/* Page label */}
			<div className="min-w-0 flex-1 overflow-hidden">
				<AnimatePresence mode="wait" initial={false}>
					<motion.h1
						key={currentLabel}
						initial={reduced ? false : { opacity: 0, x: 8 }}
						animate={{ opacity: 1, x: 0 }}
						exit={reduced ? undefined : { opacity: 0, x: -8 }}
						transition={{ duration: 0.18 }}
						className="text-foreground truncate text-[14.5px] font-semibold tracking-tight"
					>
						{currentLabel}
					</motion.h1>
				</AnimatePresence>
				<p className="text-muted-foreground -mt-0.5 hidden truncate text-[11px] font-medium capitalize tracking-wide sm:block">
					{roleLabel}
				</p>
			</div>

			{/* Right cluster */}
			<div className="flex items-center gap-1.5 sm:gap-3">
				{notificationsSlot}

				<span className="text-muted-foreground hidden truncate text-[12.5px] font-medium md:inline">
					{user.email}
				</span>

				<div className="bg-border hidden h-5 w-px md:block" aria-hidden="true" />

				{signOutSlot ? <span className="hidden md:inline">{signOutSlot}</span> : null}

				{/* Avatar */}
				<div className="relative">
					<div
						aria-label={`Signed in as ${user.email}`}
						className={[
							"text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full",
							"text-[12px] font-semibold tracking-wide",
							"ring-background ring-2",
						].join(" ")}
						style={{
							background: `linear-gradient(135deg, var(--chart-${hueIdx}), var(--chart-${
								((hueIdx % 5) + 1) as 1 | 2 | 3 | 4 | 5
							}))`,
						}}
					>
						{initialsText}
					</div>
					<span
						className="bg-card absolute bottom-0 right-0 flex h-2.5 w-2.5 items-center justify-center rounded-full"
						aria-hidden="true"
					>
						<span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--chart-1)" }} />
					</span>
				</div>
			</div>
		</header>
	)
}

// ─── ROOT SHELL ────────────────────────────────────────────────────────────────

const SIDEBAR_W_EXPANDED = 248
const SIDEBAR_W_COLLAPSED = 72
const STORAGE_KEY = "pcms.shell.collapsed"

export function AppShell({
	title,
	subtitle,
	navGroups,
	user,
	notificationsSlot,
	signOutSlot,
	children,
}: AppShellProps) {
	const pathname = usePathname()
	const reduced = useReducedMotion() ?? false

	const [collapsed, setCollapsed] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)
	const [hydrated, setHydrated] = useState(false)

	useEffect(() => {
		try {
			setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1")
		} catch {
			/* noop */
		}
		setHydrated(true)
	}, [])

	useEffect(() => {
		if (!hydrated) return
		try {
			window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0")
		} catch {
			/* noop */
		}
	}, [collapsed, hydrated])

	// Close mobile drawer on route change
	useEffect(() => {
		setMobileOpen(false)
	}, [pathname])

	// Escape closes mobile drawer
	useEffect(() => {
		if (!mobileOpen) return
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") setMobileOpen(false)
		}
		window.addEventListener("keydown", handler)
		return () => window.removeEventListener("keydown", handler)
	}, [mobileOpen])

	// Lock scroll when drawer open
	useEffect(() => {
		if (!mobileOpen) return
		const prev = document.body.style.overflow
		document.body.style.overflow = "hidden"
		return () => {
			document.body.style.overflow = prev
		}
	}, [mobileOpen])

	const sidebarWidth = collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W_EXPANDED

	const currentLabel = useMemo(() => {
		for (const g of navGroups) {
			for (const item of g.items) {
				if (isActive(pathname, item.href)) return item.label
			}
		}
		return title
	}, [pathname, navGroups, title])

	const sidebarStyle: CSSProperties = { width: sidebarWidth }
	const mainStyle: CSSProperties = { "--shell-sidebar-w": `${sidebarWidth}px` } as CSSProperties

	return (
		<div className="bg-background text-foreground relative min-h-screen">
			{/* ─── Desktop sidebar ─── */}
			<motion.aside
				initial={false}
				animate={hydrated ? { width: sidebarWidth } : undefined}
				transition={
					reduced ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 30 }
				}
				style={sidebarStyle}
				className="bg-sidebar text-sidebar-foreground border-sidebar-border fixed left-0 top-0 z-40 hidden h-screen flex-col border-r lg:flex"
				aria-label="Sidebar"
			>
				<SidebarBody
					title={title}
					subtitle={subtitle}
					navGroups={navGroups}
					collapsed={collapsed}
				/>
				<CollapseToggle
					collapsed={collapsed}
					onToggle={() => setCollapsed(c => !c)}
					reduced={reduced}
				/>
			</motion.aside>

			{/* ─── Mobile drawer ─── */}
			<AnimatePresence>
				{mobileOpen && (
					<>
						<motion.div
							key="backdrop"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							onClick={() => setMobileOpen(false)}
							className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm lg:hidden"
							aria-hidden="true"
						/>
						<motion.aside
							key="drawer"
							initial={reduced ? false : { x: "-100%" }}
							animate={{ x: 0 }}
							exit={reduced ? undefined : { x: "-100%" }}
							transition={
								reduced ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 32 }
							}
							className="bg-sidebar text-sidebar-foreground border-sidebar-border fixed left-0 top-0 z-50 flex h-screen w-70 flex-col border-r lg:hidden"
							role="dialog"
							aria-modal="true"
							aria-label="Mobile navigation"
						>
							<button
								type="button"
								onClick={() => setMobileOpen(false)}
								aria-label="Close navigation"
								className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent focus-visible:ring-ring/60 absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2"
							>
								<SvgClose />
							</button>
							<SidebarBody
								title={title}
								subtitle={subtitle}
								navGroups={navGroups}
								collapsed={false}
								onItemClick={() => setMobileOpen(false)}
							/>
							<div className="border-sidebar-border text-muted-foreground border-t px-4 py-3 text-[10.5px] font-medium tracking-wider">
								PCMS v1.2.0
							</div>
						</motion.aside>
					</>
				)}
			</AnimatePresence>

			{/* ─── Main column ─── */}
			<motion.div
				initial={false}
				animate={hydrated ? { paddingLeft: 0 } : undefined}
				className="flex min-h-screen flex-col lg:pl-(--shell-sidebar-w)"
				style={mainStyle}
			>
				<Header
					currentLabel={currentLabel}
					user={user}
					notificationsSlot={notificationsSlot}
					signOutSlot={signOutSlot}
					onMobileMenu={() => setMobileOpen(o => !o)}
					mobileOpen={mobileOpen}
				/>

				<main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
					<AnimatePresence mode="wait" initial={false}>
						<motion.div
							key={pathname}
							initial={reduced ? false : { opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={reduced ? undefined : { opacity: 0 }}
							transition={{ duration: 0.18, ease: "easeOut" }}
						>
							{children}
						</motion.div>
					</AnimatePresence>
				</main>
			</motion.div>
		</div>
	)
}
