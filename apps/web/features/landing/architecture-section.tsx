"use client"

import { motion } from "framer-motion"

const containerVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.1 } },
}
const nodeVariants = {
	hidden: { scale: 0, opacity: 0 },
	visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 22 } },
}

interface NodeProps {
	cx: number
	cy: number
	label: string
	sublabel?: string
	color: string
	delay?: number
	isCenter?: boolean
}

function ArchNode({ cx, cy, label, sublabel, color, delay = 0, isCenter = false }: NodeProps) {
	const r = isCenter ? 46 : 34
	return (
		<motion.g
			variants={nodeVariants}
			transition={{ delay }}
		>
			{/* Glow ring */}
			<circle cx={cx} cy={cy} r={r + 8} fill={`${color}`} opacity="0.06" />
			<circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={color} strokeWidth="0.6" opacity="0.2" />
			{/* Main circle */}
			<circle cx={cx} cy={cy} r={r} fill="var(--card)" stroke={color} strokeWidth="1.4" />
			{/* Label */}
			<text
				x={cx}
				y={sublabel ? cy - 4 : cy + 4}
				textAnchor="middle"
				fontSize={isCenter ? 11 : 9}
				fontWeight={isCenter ? 800 : 700}
				fill={isCenter ? "var(--primary)" : "var(--foreground)"}
				fontFamily="var(--font-sans), system-ui, sans-serif"
			>
				{label}
			</text>
			{sublabel && (
				<text x={cx} y={cy + 11} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)" fontFamily="var(--font-sans), system-ui, sans-serif">
					{sublabel}
				</text>
			)}
		</motion.g>
	)
}

interface ConnectionProps {
	x1: number
	y1: number
	x2: number
	y2: number
	color: string
	label?: string
	bidirectional?: boolean
	delay?: number
}

function Connection({ x1, y1, x2, y2, color, label, bidirectional = false, delay = 0 }: ConnectionProps) {
	const mx = (x1 + x2) / 2
	const my = (y1 + y2) / 2

	return (
		<motion.g
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ delay, duration: 0.4 }}
		>
			<motion.path
				d={`M ${x1} ${y1} L ${x2} ${y2}`}
				stroke={color}
				strokeWidth={1.2}
				strokeDasharray="5 3"
				fill="none"
				opacity={0.45}
				initial={{ pathLength: 0 }}
				whileInView={{ pathLength: 1 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 1.0, delay: delay + 0.2, ease: "easeOut" }}
			/>
			{/* Arrow heads */}
			{bidirectional ? (
				<>
					<path
						d={`M ${x2 - (x2 - x1) * 0.06} ${y2 - (y2 - y1) * 0.06} L ${x2} ${y2}`}
						stroke={color}
						strokeWidth={1.2}
						fill="none"
						markerEnd="none"
						opacity={0.6}
					/>
				</>
			) : null}
			{label && (
				<text x={mx} y={my - 6} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)" fontFamily="var(--font-sans), system-ui, sans-serif">
					{label}
				</text>
			)}
		</motion.g>
	)
}

const NODES = [
	{ cx: 400, cy: 250, label: "PCMS", sublabel: "Core Platform", color: "var(--primary)", isCenter: true, delay: 0 },
	{ cx: 180, cy: 130, label: "Hospital EMR", sublabel: "FHIR R4", color: "var(--chart-1)", delay: 0.15 },
	{ cx: 620, cy: 130, label: "Patient", sublabel: "Portal", color: "var(--chart-2)", delay: 0.2 },
	{ cx: 680, cy: 310, label: "AI Triage", sublabel: "Engine", color: "var(--chart-3)", delay: 0.25 },
	{ cx: 560, cy: 430, label: "Claims &", sublabel: "PhilHealth", color: "var(--chart-4)", delay: 0.3 },
	{ cx: 240, cy: 430, label: "Incident", sublabel: "Management", color: "var(--chart-5)", delay: 0.35 },
	{ cx: 120, cy: 310, label: "Omni-Channel", sublabel: "Comms", color: "var(--accent)", delay: 0.4 },
]

const CONNECTIONS = [
	{ x1: 354, y1: 222, x2: 214, y2: 158, color: "var(--chart-1)", label: "FHIR R4", bidirectional: true, delay: 0.5 },
	{ x1: 446, y1: 222, x2: 586, y2: 158, color: "var(--chart-2)", label: "OAuth 2.0", bidirectional: true, delay: 0.6 },
	{ x1: 445, y1: 270, x2: 647, y2: 298, color: "var(--chart-3)", label: "AI API", bidirectional: false, delay: 0.7 },
	{ x1: 422, y1: 296, x2: 527, y2: 403, color: "var(--chart-4)", label: "Claims XML", bidirectional: true, delay: 0.75 },
	{ x1: 378, y1: 296, x2: 273, y2: 403, color: "var(--chart-5)", label: "Events", bidirectional: true, delay: 0.8 },
	{ x1: 354, y1: 270, x2: 153, y2: 296, color: "var(--accent)", label: "Comms API", bidirectional: true, delay: 0.85 },
]

export function ArchitectureSection() {
	return (
		<section
			id="architecture"
			style={{
				background: "var(--background)",
				padding: "96px 24px",
				borderTop: "1px solid var(--border)",
				overflow: "hidden",
			}}
		>
			<div style={{ maxWidth: "1280px", margin: "0 auto" }}>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.55 }}
					style={{ textAlign: "center", marginBottom: "64px" }}
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
							Platform Architecture
						</span>
					</div>
					<h2
						style={{
							fontSize: "clamp(26px, 3.5vw, 40px)",
							fontWeight: 800,
							color: "var(--foreground)",
							letterSpacing: "-0.02em",
							marginBottom: "14px",
							fontFamily: "var(--font-sans), system-ui, sans-serif",
						}}
					>
						One platform. Every touchpoint.
					</h2>
					<p style={{ fontSize: "17px", color: "var(--muted-foreground)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
						PCMS acts as the operational hub — connecting every clinical system, patient channel, and
						administrative workflow into a single unified platform.
					</p>
				</motion.div>

				{/* Architecture diagram */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<motion.svg
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						viewBox="0 60 800 440"
						style={{
							width: "100%",
							maxWidth: "800px",
							overflow: "visible",
						}}
						xmlns="http://www.w3.org/2000/svg"
					>
						{/* Background decoration */}
						<defs>
							<radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
								<stop offset="0%" stopColor="var(--primary)" stopOpacity="0.06" />
								<stop offset="100%" stopColor="transparent" stopOpacity="0" />
							</radialGradient>
						</defs>
						<ellipse cx="400" cy="250" rx="200" ry="150" fill="url(#centerGlow)" />

						{/* Connection lines */}
						{CONNECTIONS.map((c, i) => (
							<Connection key={i} {...c} />
						))}

						{/* Nodes */}
						{NODES.map((node) => (
							<ArchNode key={node.label} {...node} />
						))}
					</motion.svg>
				</div>

				{/* Legend */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					style={{
						display: "flex",
						justifyContent: "center",
						flexWrap: "wrap",
						gap: "20px",
						marginTop: "32px",
					}}
				>
					{[
						{ color: "var(--chart-1)", label: "EMR Integration (FHIR R4)" },
						{ color: "var(--chart-2)", label: "Patient-Facing (OAuth 2.0)" },
						{ color: "var(--chart-3)", label: "AI & Analytics" },
						{ color: "var(--chart-4)", label: "Claims & Billing" },
						{ color: "var(--chart-5)", label: "Incident Management" },
						{ color: "var(--accent)", label: "Omni-Channel Comms" },
					].map((item) => (
						<div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
							<div
								style={{
									width: "10px",
									height: "10px",
									borderRadius: "50%",
									background: item.color,
								}}
							/>
							<span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{item.label}</span>
						</div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
