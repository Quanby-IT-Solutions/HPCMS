"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const PHASES = [
	{
		number: "01",
		title: "Foundation",
		subtitle: "Core Case Management",
		color: "var(--chart-1)",
		items: [
			"Centralized case dashboard across departments",
			"Letter of Authorization (LOA) workflow engine",
			"HL7 FHIR R4 integration with hospital EMR platform",
			"Patient consent management foundation",
			"Role-based access control & audit logging",
		],
	},
	{
		number: "02",
		title: "Expansion",
		subtitle: "Omni-Channel & AI",
		color: "var(--chart-2)",
		items: [
			"Patient 360 omni-channel interaction timeline",
			"SMART on FHIR embedded clinician experience",
			"Knowledge base & AI-assisted clinical chatbot",
			"Medical device & program entitlement tracking",
			"Self-service patient portal with case status",
		],
	},
	{
		number: "03",
		title: "Intelligence",
		subtitle: "AI & Advanced Analytics",
		color: "var(--accent)",
		items: [
			"AI-driven triage recommendations & case routing",
			"Major incident aggregation & trend detection",
			"Automated PhilHealth claims XML generation",
			"DRG shadow billing & cost estimation",
			"Advanced analytics and executive dashboards",
		],
	},
]

function PhaseCard({ phase, index }: { phase: (typeof PHASES)[number]; index: number }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 28 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
			style={{
				flex: "1 1 280px",
				maxWidth: "380px",
				padding: "28px",
				borderRadius: "var(--radius)",
				background: "var(--card)",
				border: "1px solid var(--border)",
				borderTop: `2.5px solid ${phase.color}`,
				display: "flex",
				flexDirection: "column",
				gap: "16px",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Phase number background */}
			<div
				style={{
					position: "absolute",
					top: "-10px",
					right: "16px",
					fontSize: "88px",
					fontWeight: 900,
					color: phase.color,
					opacity: 0.05,
					lineHeight: 1,
					fontFamily: "var(--font-sans), system-ui, sans-serif",
					pointerEvents: "none",
					userSelect: "none",
				}}
			>
				{phase.number}
			</div>

			{/* Phase label */}
			<div
				style={{
					display: "inline-flex",
					alignItems: "center",
					gap: "6px",
					padding: "3px 10px",
					borderRadius: "4px",
					background: `oklch(from ${phase.color} l c h / 0.1)`,
					border: `1px solid oklch(from ${phase.color} l c h / 0.25)`,
					alignSelf: "flex-start",
				}}
			>
				<span style={{ fontSize: "10px", fontWeight: 700, color: phase.color, letterSpacing: "0.07em", textTransform: "uppercase" }}>
					Phase {phase.number}
				</span>
			</div>

			<div>
				<h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em", marginBottom: "4px", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
					{phase.title}
				</h3>
				<p style={{ fontSize: "13px", color: phase.color, fontWeight: 600 }}>
					{phase.subtitle}
				</p>
			</div>

			<ul style={{ display: "flex", flexDirection: "column", gap: "10px", listStyle: "none", padding: 0, margin: 0 }}>
				{phase.items.map((item, i) => (
					<motion.li
						key={i}
						initial={{ opacity: 0, x: -10 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ delay: index * 0.12 + i * 0.05 + 0.3 }}
						style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px", color: "var(--muted-foreground)", lineHeight: 1.5 }}
					>
						<span
							style={{
								marginTop: "5px",
								width: "6px",
								height: "6px",
								borderRadius: "50%",
								background: phase.color,
								flexShrink: 0,
							}}
						/>
						{item}
					</motion.li>
				))}
			</ul>
		</motion.div>
	)
}

function TimelineConnector({ from, to }: { from: string; to: string }) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: "0",
				alignSelf: "center",
				paddingTop: "56px",
			}}
		>
			<motion.div
				initial={{ scaleX: 0 }}
				whileInView={{ scaleX: 1 }}
				viewport={{ once: true, amount: 0.5 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				style={{
					height: "1.5px",
					width: "48px",
					background: `linear-gradient(90deg, ${from}, ${to})`,
					opacity: 0.5,
					transformOrigin: "left center",
				}}
			/>
			<motion.div
				initial={{ scale: 0 }}
				whileInView={{ scale: 1 }}
				viewport={{ once: true }}
				transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
				style={{
					width: "7px",
					height: "7px",
					borderRadius: "50%",
					background: to,
					flexShrink: 0,
				}}
			/>
			<motion.div
				initial={{ scaleX: 0 }}
				whileInView={{ scaleX: 1 }}
				viewport={{ once: true, amount: 0.5 }}
				transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
				style={{
					height: "1.5px",
					width: "48px",
					background: `linear-gradient(90deg, ${to}, ${to})`,
					opacity: 0.5,
					transformOrigin: "left center",
				}}
			/>
		</div>
	)
}

export function RoadmapSection() {
	const sectionRef = useRef<HTMLElement>(null)
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 80%", "end 40%"] })
	const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

	return (
		<section
			id="roadmap"
			ref={sectionRef}
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
							background: "oklch(from var(--chart-2) l c h / 0.1)",
							border: "1px solid oklch(from var(--chart-2) l c h / 0.25)",
							marginBottom: "16px",
						}}
					>
						<span style={{ fontSize: "11px", fontWeight: 700, color: "var(--chart-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
							Delivery Roadmap
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
						Three phases to full operational coverage
					</h2>
					<p style={{ fontSize: "17px", color: "var(--muted-foreground)", maxWidth: "540px", lineHeight: 1.6 }}>
						From core case management to AI-driven intelligence — each phase delivers
						immediate value while laying the foundation for what comes next.
					</p>
				</motion.div>

				{/* Scroll progress bar */}
				<div
					style={{
						position: "relative",
						height: "3px",
						background: "var(--border)",
						borderRadius: "2px",
						marginBottom: "48px",
						overflow: "hidden",
					}}
				>
					<motion.div
						style={{
							position: "absolute",
							left: 0,
							top: 0,
							height: "100%",
							width: progressWidth,
							background: "linear-gradient(90deg, var(--chart-1), var(--chart-2), var(--accent))",
							borderRadius: "2px",
						}}
					/>
				</div>

				{/* Phase cards + connectors */}
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: "0",
						justifyContent: "center",
						alignItems: "flex-start",
					}}
				>
					{PHASES.map((phase, i) => (
						<>
							<PhaseCard key={phase.number} phase={phase} index={i} />
							{i < PHASES.length - 1 && (
								<TimelineConnector
									key={`connector-${i}`}
									from={PHASES[i].color}
									to={PHASES[i + 1].color}
								/>
							)}
						</>
					))}
				</div>

				{/* Bottom note */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					style={{
						marginTop: "40px",
						textAlign: "center",
						fontSize: "13px",
						color: "var(--muted-foreground)",
					}}
				>
					Each phase is designed for incremental deployment — hospital operations continue uninterrupted throughout the rollout.
				</motion.div>
			</div>
		</section>
	)
}
