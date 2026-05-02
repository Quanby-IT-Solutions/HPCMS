"use client"

import { motion } from "framer-motion"

const containerVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.07 } },
}
const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

// === Icons ===
function ShieldIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
			<path d="M14 3L22 7V14C22 18.5 18.5 22.5 14 24C9.5 22.5 6 18.5 6 14V7L14 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
			<path d="M10 14L13 17L18 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

function LockIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
			<rect x="5" y="13" width="18" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
			<path d="M9 13V9C9 6.8 11.2 5 14 5C16.8 5 19 6.8 19 9V13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
			<circle cx="14" cy="19" r="1.8" fill="currentColor" opacity="0.7" />
			<path d="M14 20.8V23" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
		</svg>
	)
}

function TenantIsolationIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
			{/* Building 1 */}
			<rect x="3" y="12" width="9" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
			{/* Building 2 */}
			<rect x="16" y="12" width="9" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
			{/* Divider */}
			<path d="M14 10V25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="3 2" opacity="0.5" />
			{/* Crown / cloud above each */}
			<path d="M7.5 9V12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			<path d="M20.5 9V12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			<circle cx="7.5" cy="8" r="2" stroke="currentColor" strokeWidth="1.1" />
			<circle cx="20.5" cy="8" r="2" stroke="currentColor" strokeWidth="1.1" />
		</svg>
	)
}

function AuditLogIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
			<rect x="4" y="3" width="20" height="22" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
			<path d="M8 9H20M8 13H20M8 17H16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
			{/* Clock on corner */}
			<circle cx="21" cy="22" r="5" fill="var(--background)" stroke="currentColor" strokeWidth="1.2" />
			<path d="M21 20V22.5L22.5 24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

function PrivacyActIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
			{/* Government building */}
			<rect x="4" y="13" width="20" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
			<path d="M4 13L14 4L24 13" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
			{/* Columns */}
			<line x1="9" y1="13" x2="9" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.5" />
			<line x1="14" y1="13" x2="14" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.5" />
			<line x1="19" y1="13" x2="19" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.5" />
			{/* Flag */}
			<path d="M14 4V1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
		</svg>
	)
}

function JciIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
			{/* Medal shape */}
			<circle cx="14" cy="17" r="8" stroke="currentColor" strokeWidth="1.4" />
			<path d="M10 4H18L16 10H12L10 4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
			<path d="M12 4L12 10M16 4L16 10" stroke="currentColor" strokeWidth="1" opacity="0.5" />
			{/* Checkmark in medal */}
			<path d="M10.5 17L13 19.5L18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

const TRUST_SIGNALS = [
	{
		icon: <PrivacyActIcon />,
		label: "Data Privacy Act 2012",
		sublabel: "Republic Act No. 10173",
		description: "Full compliance with the Philippine Data Privacy Act — consent management, data subject rights, and NPC-aligned breach protocols.",
		color: "var(--primary)",
	},
	{
		icon: <JciIcon />,
		label: "JCI Accredited Workflows",
		sublabel: "Joint Commission International",
		description: "Case management and incident workflows engineered to JCI clinical governance standards for hospital accreditation readiness.",
		color: "var(--chart-2)",
	},
	{
		icon: <LockIcon />,
		label: "AES-256 Encryption",
		sublabel: "At Rest & In Transit",
		description: "Industry-standard AES-256 encryption for all data at rest, with TLS 1.3 enforced for every API and web session.",
		color: "var(--chart-1)",
	},
	{
		icon: <TenantIsolationIcon />,
		label: "Multi-Tenant Isolation",
		sublabel: "SLMC QC · SLMC BGC",
		description: "Strict data partitioning between hospital tenants — row-level security enforced at the database layer, not application logic.",
		color: "var(--chart-3)",
	},
	{
		icon: <AuditLogIcon />,
		label: "Full Audit Logging",
		sublabel: "Immutable Event Trail",
		description: "Every data access, state change, and user action is recorded in a tamper-evident audit log for compliance and forensics.",
		color: "var(--chart-4)",
	},
	{
		icon: <ShieldIcon />,
		label: "Role-Based Access Control",
		sublabel: "Zero Trust Architecture",
		description: "Granular RBAC with least-privilege access — care coordinators, clinicians, supervisors, and admins each have distinct permission scopes.",
		color: "var(--accent)",
	},
]

export function SecuritySection() {
	return (
		<section
			id="security"
			style={{
				background: "var(--background)",
				padding: "96px 24px",
				borderTop: "1px solid var(--border)",
			}}
		>
			<div style={{ maxWidth: "1280px", margin: "0 auto" }}>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.55 }}
					style={{ marginBottom: "56px" }}
				>
					<div
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: "8px",
							padding: "4px 12px",
							borderRadius: "4px",
							background: "oklch(from var(--primary) l c h / 0.1)",
							border: "1px solid oklch(from var(--primary) l c h / 0.25)",
							marginBottom: "16px",
						}}
					>
						<span style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
							Security & Compliance
						</span>
					</div>
					<h2
						style={{
							fontSize: "clamp(26px, 3.5vw, 40px)",
							fontWeight: 800,
							color: "var(--foreground)",
							letterSpacing: "-0.02em",
							lineHeight: 1.15,
							marginBottom: "14px",
							fontFamily: "var(--font-sans), system-ui, sans-serif",
						}}
					>
						Enterprise-grade security,
						<br />
						<span style={{ color: "var(--primary)" }}>compliance-ready by design</span>
					</h2>
					<p style={{ fontSize: "17px", color: "var(--muted-foreground)", maxWidth: "540px", lineHeight: 1.6 }}>
						Engineered from the ground up for Philippine healthcare compliance, JCI accreditation
						standards, and hospital-grade data security.
					</p>
				</motion.div>

				{/* Trust signal grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.1 }}
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
						gap: "16px",
					}}
				>
					{TRUST_SIGNALS.map((signal) => (
						<motion.div
							key={signal.label}
							variants={itemVariants}
							whileHover={{ y: -3, boxShadow: `0 12px 32px oklch(from ${signal.color} l c h / 0.12)` }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
							style={{
								padding: "24px",
								borderRadius: "var(--radius)",
								background: "var(--card)",
								border: "1px solid var(--border)",
								display: "flex",
								flexDirection: "column",
								gap: "12px",
								cursor: "default",
							}}
						>
							{/* Icon + label row */}
							<div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
								<div
									style={{
										color: signal.color,
										padding: "10px",
										borderRadius: "8px",
										background: `oklch(from ${signal.color} l c h / 0.08)`,
										flexShrink: 0,
									}}
								>
									{signal.icon}
								</div>
								<div>
									<div style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", lineHeight: 1.3 }}>
										{signal.label}
									</div>
									<div style={{ fontSize: "11px", color: signal.color, fontWeight: 600, marginTop: "2px" }}>
										{signal.sublabel}
									</div>
								</div>
							</div>

							<p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
								{signal.description}
							</p>
						</motion.div>
					))}
				</motion.div>

				{/* Bottom trust bar */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					style={{
						marginTop: "40px",
						padding: "20px 28px",
						borderRadius: "var(--radius)",
						background: "var(--card)",
						border: "1px solid var(--border)",
						display: "flex",
						alignItems: "center",
						gap: "12px",
						flexWrap: "wrap",
					}}
				>
					<div
						style={{
							width: "8px",
							height: "8px",
							borderRadius: "50%",
							background: "var(--accent)",
							flexShrink: 0,
							boxShadow: "0 0 8px var(--accent)",
						}}
					/>
					<p style={{ fontSize: "14px", color: "var(--muted-foreground)", margin: 0, lineHeight: 1.5 }}>
						<span style={{ color: "var(--foreground)", fontWeight: 600 }}>Security is not an afterthought.</span>
						{" "}PCMS is built with a defense-in-depth architecture — every layer from database to API to frontend enforces its own security controls,
						so no single vulnerability compromises patient data.
					</p>
				</motion.div>
			</div>
		</section>
	)
}
