"use client"

import { motion } from "framer-motion"

const containerVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
}

function FragmentedFilesIcon() {
	return (
		<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="4" y="8" width="16" height="20" rx="2" stroke="var(--destructive)" strokeWidth="1.4" />
			<path d="M4 13H20" stroke="var(--destructive)" strokeWidth="1" opacity="0.5" />
			<path d="M7 17H14" stroke="var(--destructive)" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
			<path d="M7 20H16" stroke="var(--destructive)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
			{/* Floating disconnected fragment */}
			<rect x="18" y="4" width="13" height="16" rx="2" stroke="var(--destructive)" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.6" />
			<path d="M21 10H28" stroke="var(--destructive)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
			<path d="M21 13H26" stroke="var(--destructive)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
			{/* X break */}
			<path d="M14 26L18 30M18 26L14 30" stroke="var(--destructive)" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
		</svg>
	)
}

function DisconnectedChatIcon() {
	return (
		<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M4 8H20C21.1 8 22 8.9 22 10V20C22 21.1 21.1 22 20 22H16L12 26V22H4C2.9 22 2 21.1 2 20V10C2 8.9 2.9 8 4 8Z"
				stroke="var(--destructive)" strokeWidth="1.4" fill="none" opacity="0.6" />
			<path d="M18 12H22C23.1 12 24 12.9 24 14V24C24 25.1 23.1 26 22 26H18" stroke="var(--destructive)" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.5" />
			{/* X slash */}
			<path d="M25 5L31 11M31 5L25 11" stroke="var(--destructive)" strokeWidth="1.5" strokeLinecap="round" />
			{/* Dots in chat */}
			<circle cx="8" cy="15" r="1.2" fill="var(--destructive)" opacity="0.6" />
			<circle cx="12" cy="15" r="1.2" fill="var(--destructive)" opacity="0.6" />
			<circle cx="16" cy="15" r="1.2" fill="var(--destructive)" opacity="0.6" />
		</svg>
	)
}

function ManualTriageIcon() {
	return (
		<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
			{/* Clock */}
			<circle cx="14" cy="18" r="11" stroke="var(--destructive)" strokeWidth="1.4" fill="none" />
			<path d="M14 11V18L18 22" stroke="var(--destructive)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
			{/* Gear overlay */}
			<path d="M28 12 L27 9 L29 9 L28 12Z M28 24 L27 21 L29 21 L28 24Z M22 18 L19 17 L19 19 L22 18Z M34 18 L31 17 L31 19 L34 18Z"
				fill="var(--destructive)" opacity="0.5" />
			<circle cx="28" cy="18" r="3" stroke="var(--destructive)" strokeWidth="1.2" fill="none" opacity="0.7" />
			<circle cx="28" cy="18" r="1.2" stroke="var(--destructive)" strokeWidth="1" fill="none" opacity="0.7" />
		</svg>
	)
}

function ComplianceRiskIcon() {
	return (
		<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M18 4L32 30H4L18 4Z" stroke="var(--destructive)" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
			<line x1="18" y1="14" x2="18" y2="22" stroke="var(--destructive)" strokeWidth="1.8" strokeLinecap="round" />
			<circle cx="18" cy="25.5" r="1.3" fill="var(--destructive)" />
			{/* Shield outline behind */}
			<path d="M18 6L25 9V16C25 20 22 23 18 24C14 23 11 20 11 16V9L18 6Z"
				stroke="var(--destructive)" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
		</svg>
	)
}

const PROBLEMS = [
	{
		icon: <FragmentedFilesIcon />,
		title: "Siloed Case Records",
		description: "Patient cases span multiple disconnected systems — paper forms, email threads, and unlinked EMR records with no unified view.",
	},
	{
		icon: <DisconnectedChatIcon />,
		title: "Fragmented Communications",
		description: "Patient interactions scattered across phone, SMS, email, and in-person channels with no consolidated omni-channel history.",
	},
	{
		icon: <ManualTriageIcon />,
		title: "Manual Triage Workflows",
		description: "Case coordinators rely on spreadsheets and tribal knowledge for triage decisions, with no AI-assisted routing or priority scoring.",
	},
	{
		icon: <ComplianceRiskIcon />,
		title: "Compliance Complexity",
		description: "PhilHealth LOA requirements, Data Privacy Act obligations, and JCI audit trails managed piecemeal — high risk, high overhead.",
	},
]

export function ProblemSection() {
	return (
		<section
			id="problem"
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
							background: "oklch(from var(--destructive) l c h / 0.12)",
							border: "1px solid oklch(from var(--destructive) l c h / 0.25)",
							marginBottom: "16px",
						}}
					>
						<span style={{ fontSize: "11px", fontWeight: 700, color: "var(--destructive)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
							The Operational Reality
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
						Fragmented systems create operational risk
					</h2>
					<p style={{ fontSize: "17px", color: "var(--muted-foreground)", maxWidth: "560px", lineHeight: 1.6 }}>
						Without a unified platform, SLMC's patient service operations face compounding inefficiencies
						that impact care quality, compliance posture, and staff burden.
					</p>
				</motion.div>

				{/* Problem cards */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
						gap: "20px",
					}}
				>
					{PROBLEMS.map((problem) => (
						<motion.div
							key={problem.title}
							variants={itemVariants}
							whileHover={{ y: -4 }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
							style={{
								padding: "28px 24px",
								borderRadius: "var(--radius)",
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderLeft: "3px solid var(--destructive)",
								display: "flex",
								flexDirection: "column",
								gap: "16px",
								cursor: "default",
							}}
						>
							<div>{problem.icon}</div>
							<div>
								<h3
									style={{
										fontSize: "16px",
										fontWeight: 700,
										color: "var(--foreground)",
										marginBottom: "8px",
										letterSpacing: "-0.01em",
										fontFamily: "var(--font-sans), system-ui, sans-serif",
									}}
								>
									{problem.title}
								</h3>
								<p style={{ fontSize: "14px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
									{problem.description}
								</p>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
