"use client"

import { motion } from "framer-motion"

const containerVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

// === SVG Icons ===

function CaseDashboardIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="2" y="2" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
			<rect x="15" y="2" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
			<rect x="2" y="15" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
			<rect x="15" y="15" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
			<path d="M5 8H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
			<path d="M18 8H23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
			<path d="M5 22H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
		</svg>
	)
}

function Patient360Icon() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.4" strokeDasharray="4 2.5" />
			<circle cx="14" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.4" />
			<path d="M6 24C6 20.134 9.582 17 14 17C18.418 17 22 20.134 22 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
			<path d="M14 3V6M14 22V25M3 14H6M22 14H25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
		</svg>
	)
}

function AITriageIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
			{/* Brain outline */}
			<path d="M14 4C11.5 4 9 5.5 8 7.5C6 7.5 4 9.5 4 12C4 14 5.5 15.5 7 16C7 18.5 8.5 21 11 22H17C19.5 21 21 18.5 21 16C22.5 15.5 24 14 24 12C24 9.5 22 7.5 20 7.5C19 5.5 16.5 4 14 4Z"
				stroke="currentColor" strokeWidth="1.4" fill="none" />
			{/* Neural connections */}
			<path d="M10 12H14M14 12H18M14 8V12V17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
			<circle cx="10" cy="12" r="1.2" fill="currentColor" opacity="0.7" />
			<circle cx="18" cy="12" r="1.2" fill="currentColor" opacity="0.7" />
			<circle cx="14" cy="8" r="1.2" fill="currentColor" opacity="0.7" />
			<circle cx="14" cy="17" r="1.2" fill="currentColor" opacity="0.7" />
		</svg>
	)
}

function SelfServiceIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="3" y="8" width="22" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
			<path d="M3 13H25" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
			{/* Person */}
			<circle cx="14" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
			<path d="M10 8C10 6 12 4.5 14 4.5C16 4.5 18 6 18 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			{/* Form elements */}
			<rect x="7" y="17" width="6" height="2" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.6" />
			<rect x="15" y="17" width="6" height="2" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.6" />
			<path d="M7 21H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
		</svg>
	)
}

function IncidentIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M14 3L25 22H3L14 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
			<line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
			<circle cx="14" cy="19.5" r="1.1" fill="currentColor" />
			{/* Lightning bolt overlay */}
			<path d="M21 3L17 10H22L18 17" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
		</svg>
	)
}

function AssetTrackingIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
			{/* Tag shape */}
			<path d="M4 4H16L24 12C25.1 13.1 25.1 14.9 24 16L16 24C14.9 25.1 13.1 25.1 12 24L4 16V4Z" stroke="currentColor" strokeWidth="1.4" />
			<circle cx="9.5" cy="9.5" r="2" stroke="currentColor" strokeWidth="1.3" />
			<path d="M14 14L20 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
			{/* Network dots */}
			<circle cx="22" cy="5" r="1.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
			<circle cx="25" cy="9" r="1.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
			<path d="M22 6L23 7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
		</svg>
	)
}

function ClaimsBillingIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="4" y="3" width="20" height="22" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
			<path d="M8 9H20M8 13H16M8 17H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
			{/* PHP/₱ symbol */}
			<text x="16" y="20" fontSize="7" fontWeight="700" fill="currentColor" opacity="0.8" fontFamily="monospace">₱</text>
			<path d="M16 7H20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
		</svg>
	)
}

function KnowledgeBaseIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
			{/* Stack of books */}
			<rect x="3" y="16" width="22" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
			<rect x="5" y="11" width="18" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
			<rect x="7" y="6" width="14" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
			{/* Chat bubble */}
			<path d="M18 2H24C24.6 2 25 2.4 25 3V7C25 7.6 24.6 8 24 8H20.5L18.5 10V8H18C17.4 8 17 7.6 17 7V3C17 2.4 17.4 2 18 2Z" stroke="currentColor" strokeWidth="1.1" fill="none" opacity="0.7" />
			<circle cx="20" cy="5" r="0.6" fill="currentColor" opacity="0.6" />
			<circle cx="22" cy="5" r="0.6" fill="currentColor" opacity="0.6" />
		</svg>
	)
}

// Chart colors cycle for top borders
const CHART_VARS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--accent)", "var(--primary)", "var(--chart-3)"]

const MODULES = [
	{
		icon: <CaseDashboardIcon />,
		name: "Centralized Case Dashboard",
		description: "Unified queue across all case types and departments. Real-time status tracking, priority scoring, and workflow assignment.",
	},
	{
		icon: <Patient360Icon />,
		name: "Patient 360 Omni-Channel Timeline",
		description: "Complete interaction history across phone, SMS, email, and in-person — synchronized with the patient's EMR record.",
	},
	{
		icon: <AITriageIcon />,
		name: "AI-Assisted Triage & Recommendations",
		description: "Machine learning–powered case routing, priority classification, and actionable recommendations for care coordinators.",
	},
	{
		icon: <SelfServiceIcon />,
		name: "Patient Self-Service Portal & LOA",
		description: "Secure patient portal for LOA requests, case status tracking, document uploads, and digital consent workflows.",
	},
	{
		icon: <IncidentIcon />,
		name: "Major Incident Management",
		description: "End-to-end major incident lifecycle management with escalation workflows, cross-department coordination, and root-cause tracking.",
	},
	{
		icon: <AssetTrackingIcon />,
		name: "Asset & Entitlement Tracking",
		description: "Track medical devices, program enrollments, and entitlement contracts per patient — fully linked to case records.",
	},
	{
		icon: <ClaimsBillingIcon />,
		name: "Claims & PhilHealth Billing",
		description: "Automated XML claims generation, DRG shadow billing, LOA validation, and PhilHealth compliance management.",
	},
	{
		icon: <KnowledgeBaseIcon />,
		name: "Knowledge Base & Clinical Chatbot",
		description: "Structured KB with AI-assisted search for care coordinators, plus a patient-facing chatbot for common inquiries.",
	},
]

export function ModulesSection() {
	return (
		<section
			id="modules"
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
							background: "oklch(from var(--accent) l c h / 0.1)",
							border: "1px solid oklch(from var(--accent) l c h / 0.25)",
							marginBottom: "16px",
						}}
					>
						<span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
							Core Modules
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
						Purpose-built for clinical operations
					</h2>
					<p style={{ fontSize: "17px", color: "var(--muted-foreground)", maxWidth: "560px", lineHeight: 1.6 }}>
						Eight deeply integrated modules — each engineered for the specific workflows of hospital
						patient service operations at SLMC's scale.
					</p>
				</motion.div>

				{/* Module grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.15 }}
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
						gap: "16px",
					}}
				>
					{MODULES.map((mod, i) => (
						<motion.div
							key={mod.name}
							variants={itemVariants}
							whileHover={{
								y: -4,
								boxShadow: `0 16px 40px oklch(from ${CHART_VARS[i % CHART_VARS.length]} l c h / 0.15)`,
							}}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
							style={{
								padding: "24px",
								borderRadius: "var(--radius)",
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderTop: `2px solid ${CHART_VARS[i % CHART_VARS.length]}`,
								display: "flex",
								flexDirection: "column",
								gap: "14px",
								cursor: "default",
								position: "relative",
								overflow: "hidden",
							}}
						>
							{/* Icon */}
							<div style={{ color: CHART_VARS[i % CHART_VARS.length] }}>
								{mod.icon}
							</div>

							<div>
								<h3
									style={{
										fontSize: "15px",
										fontWeight: 700,
										color: "var(--foreground)",
										marginBottom: "8px",
										letterSpacing: "-0.01em",
										lineHeight: 1.3,
										fontFamily: "var(--font-sans), system-ui, sans-serif",
									}}
								>
									{mod.name}
								</h3>
								<p style={{ fontSize: "13.5px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
									{mod.description}
								</p>
							</div>

							<div
								style={{
									fontSize: "12px",
									color: CHART_VARS[i % CHART_VARS.length],
									fontWeight: 600,
									display: "flex",
									alignItems: "center",
									gap: "4px",
									marginTop: "auto",
								}}
							>
								Learn more
								<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
									<path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</div>

							{/* Background accent */}
							<div
								style={{
									position: "absolute",
									bottom: "-12px",
									right: "-12px",
									width: "80px",
									height: "80px",
									borderRadius: "50%",
									background: `${CHART_VARS[i % CHART_VARS.length]}`,
									opacity: 0.04,
									pointerEvents: "none",
								}}
							/>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
