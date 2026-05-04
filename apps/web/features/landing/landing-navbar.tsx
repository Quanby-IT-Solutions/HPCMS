"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"

interface LandingNavbarProps {
	isLight: boolean
	onToggleTheme: () => void
}

const NAV_LINKS = [
	{ label: "Platform", href: "#architecture" },
	{ label: "Modules", href: "#modules" },
	{ label: "Integration", href: "#integration" },
	{ label: "Security", href: "#security" },
	{ label: "Roadmap", href: "#roadmap" },
]

function PcmsLogo() {
	return (
		<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
			<Image
				src="/logo/stlukes.png"
				alt="St. Luke's Medical Center"
				width={36}
				height={36}
				style={{ borderRadius: "50%", objectFit: "contain" }}
			/>
			<div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
				<span style={{ fontSize: "13px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.01em", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>PCMS</span>
				<span style={{ fontSize: "9.5px", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>by St. Luke's Medical</span>
			</div>
		</div>
	)
}

function SunIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="7" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.3" />
			<line x1="7" y1="0.5" x2="7" y2="2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			<line x1="7" y1="11.5" x2="7" y2="13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			<line x1="0.5" y1="7" x2="2.5" y2="7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			<line x1="11.5" y1="7" x2="13.5" y2="7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			<line x1="2.4" y1="2.4" x2="3.8" y2="3.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			<line x1="10.2" y1="10.2" x2="11.6" y2="11.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			<line x1="11.6" y1="2.4" x2="10.2" y2="3.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			<line x1="3.8" y1="10.2" x2="2.4" y2="11.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
		</svg>
	)
}

function MoonIcon() {
	return (
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M11.5 8.5C10.5 9.2 9.3 9.6 8 9.6C4.9 9.6 2.4 7.1 2.4 4C2.4 2.7 2.8 1.5 3.5 0.5C1.2 1.3 -0.5 3.5 0.1 6.1C0.7 8.9 3.5 10.8 6.4 10.2C8.5 9.8 10.3 8.4 11.5 6.5"
				stroke="currentColor"
				strokeWidth="1.3"
				strokeLinecap="round"
				fill="none"
			/>
		</svg>
	)
}

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
	return (
		<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
			<motion.line
				x1="3" y1="6" x2="19" y2="6"
				stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round"
				animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
				style={{ originX: "50%", originY: "50%" }}
			/>
			<motion.line
				x1="3" y1="11" x2="19" y2="11"
				stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round"
				animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
				style={{ originX: "50%", originY: "50%" }}
			/>
			<motion.line
				x1="3" y1="16" x2="19" y2="16"
				stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round"
				animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
				style={{ originX: "50%", originY: "50%" }}
			/>
		</svg>
	)
}

function ThemeToggle({ isLight, onToggle }: { isLight: boolean; onToggle: () => void }) {
	return (
		<button
			onClick={onToggle}
			aria-label="Toggle theme"
			style={{
				display: "flex",
				alignItems: "center",
				gap: "6px",
				background: isLight
					? "oklch(0.87 0.012 253)"
					: "oklch(0.20 0.022 258)",
				border: "1px solid var(--border)",
				borderRadius: "100px",
				padding: "4px 6px 4px 8px",
				cursor: "pointer",
				outline: "none",
				transition: "background 0.3s ease",
			}}
		>
			<motion.span
				animate={{ color: isLight ? "oklch(0.55 0.16 85)" : "oklch(0.60 0.022 258)" }}
				transition={{ duration: 0.2 }}
				style={{ display: "flex", alignItems: "center" }}
			>
				<SunIcon />
			</motion.span>

			{/* Pill track */}
			<div
				style={{
					position: "relative",
					width: "38px",
					height: "20px",
					background: isLight
						? "oklch(0.90 0.01 253)"
						: "oklch(0.155 0.022 258)",
					borderRadius: "100px",
					border: "1px solid var(--border)",
				}}
			>
				<motion.div
					animate={{ x: isLight ? 18 : 0 }}
					transition={{ type: "spring", stiffness: 500, damping: 40 }}
					style={{
						position: "absolute",
						top: "2px",
						left: "2px",
						width: "16px",
						height: "16px",
						borderRadius: "50%",
						background: isLight ? "var(--primary)" : "var(--foreground)",
					}}
				/>
			</div>

			<motion.span
				animate={{ color: isLight ? "oklch(0.60 0.022 258)" : "oklch(0.985 0.003 247)" }}
				transition={{ duration: 0.2 }}
				style={{ display: "flex", alignItems: "center" }}
			>
				<MoonIcon />
			</motion.span>
		</button>
	)
}

export function LandingNavbar({ isLight, onToggleTheme }: LandingNavbarProps) {
	const { scrollY } = useScroll()
	const [mobileOpen, setMobileOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		return scrollY.on("change", (v) => setScrolled(v > 60))
	}, [scrollY])

	const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
		e.preventDefault()
		setMobileOpen(false)
		const el = document.querySelector(href)
		if (el) el.scrollIntoView({ behavior: "smooth" })
	}

	return (
		<>
			<motion.nav
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					zIndex: 50,
					borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
				}}
				animate={{
					backgroundColor: scrolled
						? isLight
							? "rgba(248,250,252,0.88)"
							: "rgba(11,17,32,0.88)"
						: "transparent",
					backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
				}}
				transition={{ duration: 0.3 }}
			>
				<div
					style={{
						maxWidth: "1280px",
						margin: "0 auto",
						padding: "0 24px",
						height: "64px",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					{/* Logo */}
					<a href="#hero" onClick={(e) => handleNavClick(e, "#hero")} style={{ display: "flex", alignItems: "center" }}>
						<PcmsLogo />
					</a>

					{/* Desktop nav */}
					<nav
						style={{
							display: "flex",
							alignItems: "center",
							gap: "32px",
						}}
						className="hidden md:flex"
					>
						{NAV_LINKS.map((link) => (
							<a
								key={link.href}
								href={link.href}
								onClick={(e) => handleNavClick(e, link.href)}
								style={{
									fontSize: "14px",
									fontWeight: 500,
									color: "var(--muted-foreground)",
									textDecoration: "none",
									letterSpacing: "0.01em",
									transition: "color 0.2s",
								}}
								onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
								onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
							>
								{link.label}
							</a>
						))}
					</nav>

					{/* Right controls */}
					<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
						<div className="hidden sm:flex">
							<ThemeToggle isLight={isLight} onToggle={onToggleTheme} />
						</div>
						<motion.div
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.97 }}
							className="hidden sm:block"
						>
							<Link
								href="/portal"
								style={{
									display: "flex",
									alignItems: "center",
									gap: "6px",
									fontSize: "13px",
									fontWeight: 600,
									color: "var(--muted-foreground)",
									background: "transparent",
									padding: "7px 14px",
									borderRadius: "var(--radius)",
									textDecoration: "none",
									letterSpacing: "0.01em",
									whiteSpace: "nowrap",
									transition: "color 0.2s",
								}}
								onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
								onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
							>
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
									<path d="M7 1C3.7 1 1 3.7 1 7s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" stroke="currentColor" strokeWidth="1.3" />
									<path d="M5 5.5C5 4.7 5.7 4 7 4s2 .7 2 1.5S8 7 7 7v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
									<circle cx="7" cy="10" r="0.6" fill="currentColor" />
								</svg>
								Patient Portal
							</Link>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.97 }}
							className="hidden sm:block"
						>
							<Link
								href="/login"
								style={{
									display: "block",
									fontSize: "13px",
									fontWeight: 600,
									color: "var(--primary)",
									background: "transparent",
									border: "1.5px solid var(--primary)",
									padding: "7px 16px",
									borderRadius: "var(--radius)",
									textDecoration: "none",
									letterSpacing: "0.01em",
									whiteSpace: "nowrap",
								}}
							>
								Staff Sign In
							</Link>
						</motion.div>
						<motion.a
							href="#contact"
							onClick={(e) => handleNavClick(e, "#contact")}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.97 }}
							className="hidden sm:block"
							style={{
								fontSize: "13px",
								fontWeight: 600,
								color: "var(--primary-foreground)",
								background: "var(--primary)",
								padding: "8px 18px",
								borderRadius: "var(--radius)",
								textDecoration: "none",
								letterSpacing: "0.01em",
								boxShadow: "0 2px 12px var(--primary)/30%",
								whiteSpace: "nowrap",
							}}
						>
							Request Demo
						</motion.a>
						{/* Mobile hamburger */}
						<button
							onClick={() => setMobileOpen(!mobileOpen)}
							className="flex md:hidden"
							style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
							aria-label="Toggle menu"
						>
							<HamburgerIcon isOpen={mobileOpen} />
						</button>
					</div>
				</div>
			</motion.nav>

			{/* Mobile menu */}
			<AnimatePresence>
				{mobileOpen && (
					<motion.div
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
						style={{
							position: "fixed",
							top: "64px",
							left: 0,
							right: 0,
							zIndex: 49,
							backgroundColor: isLight ? "rgba(248,250,252,0.97)" : "rgba(11,17,32,0.97)",
							backdropFilter: "blur(16px)",
							borderBottom: "1px solid var(--border)",
							padding: "16px 24px 24px",
						}}
					>
						<div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
							{NAV_LINKS.map((link, i) => (
								<motion.a
									key={link.href}
									href={link.href}
									onClick={(e) => handleNavClick(e, link.href)}
									initial={{ opacity: 0, x: -12 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.06 }}
									style={{
										fontSize: "16px",
										fontWeight: 500,
										color: "var(--foreground)",
										textDecoration: "none",
										padding: "12px 0",
										borderBottom: "1px solid var(--border)",
									}}
								>
									{link.label}
								</motion.a>
							))}
						<div style={{ marginTop: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
							<ThemeToggle isLight={isLight} onToggle={onToggleTheme} />
							<Link
								href="/portal"
								style={{
									fontSize: "14px",
									fontWeight: 600,
									color: "var(--foreground)",
									background: "transparent",
									border: "1.5px solid var(--border)",
									padding: "10px 20px",
									borderRadius: "var(--radius)",
									textDecoration: "none",
								}}
							>
								Patient Portal
							</Link>
							<Link
								href="/login"
								style={{
									fontSize: "14px",
									fontWeight: 600,
									color: "var(--primary)",
									background: "transparent",
									border: "1.5px solid var(--primary)",
									padding: "10px 20px",
									borderRadius: "var(--radius)",
									textDecoration: "none",
								}}
							>
								Staff Sign In
							</Link>
								<motion.a
									href="#contact"
									onClick={(e) => handleNavClick(e, "#contact")}
									whileTap={{ scale: 0.97 }}
									style={{
										fontSize: "14px",
										fontWeight: 600,
										color: "var(--primary-foreground)",
										background: "var(--primary)",
										padding: "10px 20px",
										borderRadius: "var(--radius)",
										textDecoration: "none",
									}}
								>
									Request Demo
								</motion.a>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}
