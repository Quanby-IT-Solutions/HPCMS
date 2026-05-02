"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const NAV_LINKS = [
	{ label: "Platform", href: "#architecture" },
	{ label: "Modules", href: "#modules" },
	{ label: "Integration", href: "#integration" },
	{ label: "Security", href: "#security" },
	{ label: "Roadmap", href: "#roadmap" },
	{ label: "Contact", href: "#contact" },
]

function LinkedInIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect x="1.5" y="1.5" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="1.3" />
			<path d="M5 7.5V13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			<circle cx="5" cy="5.5" r="0.8" fill="currentColor" />
			<path d="M8.5 13V10C8.5 8.6 9.4 7.5 11 7.5C12.6 7.5 13 8.6 13 10V13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			<path d="M8.5 7.5V13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
		</svg>
	)
}

function EmailIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect x="1.5" y="4" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
			<path d="M1.5 6.5L9 10.5L16.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
		</svg>
	)
}

export function LandingFooter() {
	return (
		<footer
			style={{
				background: "var(--background)",
				borderTop: "1px solid var(--border)",
				padding: "40px 24px 28px",
			}}
		>
			<div
				style={{
					maxWidth: "1280px",
					margin: "0 auto",
				}}
			>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: "32px",
						justifyContent: "space-between",
						alignItems: "flex-start",
						marginBottom: "32px",
					}}
				>
					{/* Brand */}
					<div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "280px" }}>
						<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
							{/* Logo mark */}
							<div
								style={{
									width: "32px",
									height: "32px",
									borderRadius: "7px",
									background: "var(--primary)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<span
									style={{
										fontSize: "16px",
										fontWeight: 900,
										color: "oklch(0.985 0.003 247)",
										fontFamily: "var(--font-sans), system-ui, sans-serif",
										letterSpacing: "-0.03em",
									}}
								>
									P
								</span>
							</div>
							<div>
								<div style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", fontFamily: "var(--font-sans), system-ui, sans-serif", letterSpacing: "-0.01em" }}>
									PCMS
								</div>
								<div style={{ fontSize: "10px", color: "var(--muted-foreground)", lineHeight: 1.2 }}>
									by St. Luke's Medical Center
								</div>
							</div>
						</div>
						<p style={{ fontSize: "12.5px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
							Patient Case Management System — purpose-built for SLMC's clinical operations
							across Quezon City and BGC campuses.
						</p>
					</div>

					{/* Nav links */}
					<nav>
						<div style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "12px" }}>
							Platform
						</div>
						<ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
							{NAV_LINKS.map((link) => (
								<li key={link.label}>
									<motion.a
										href={link.href}
										whileHover={{ x: 2 }}
										transition={{ type: "spring", stiffness: 300, damping: 30 }}
										style={{
											fontSize: "13px",
											color: "var(--muted-foreground)",
											textDecoration: "none",
											display: "inline-block",
										}}
										onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--foreground)" }}
										onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--muted-foreground)" }}
									>
										{link.label}
									</motion.a>
								</li>
							))}
						</ul>
					</nav>

					{/* Contact / social */}
					<div>
						<div style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "12px" }}>
							Contact
						</div>
						<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
							<a
								href="mailto:pcms@stlukes.com.ph"
								style={{
									display: "flex",
									alignItems: "center",
									gap: "8px",
									fontSize: "13px",
									color: "var(--muted-foreground)",
									textDecoration: "none",
								}}
								onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--primary)" }}
								onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)" }}
							>
								<EmailIcon />
								pcms@stlukes.com.ph
							</a>
							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									display: "flex",
									alignItems: "center",
									gap: "8px",
									fontSize: "13px",
									color: "var(--muted-foreground)",
									textDecoration: "none",
								}}
								onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--primary)" }}
								onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)" }}
							>
								<LinkedInIcon />
								St. Luke's Medical Center
							</a>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div
					style={{
						paddingTop: "20px",
						borderTop: "1px solid var(--border)",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: "wrap",
						gap: "8px",
					}}
				>
					<p style={{ fontSize: "12px", color: "var(--muted-foreground)", margin: 0 }}>
						&copy; {new Date().getFullYear()} St. Luke's Medical Center. All rights reserved. PCMS is a proprietary system.
					</p>
					<p style={{ fontSize: "11px", color: "var(--muted-foreground)", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
						<span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
						Built for St. Luke's Medical Center · Quezon City &amp; BGC
					</p>
				</div>
			</div>
		</footer>
	)
}
