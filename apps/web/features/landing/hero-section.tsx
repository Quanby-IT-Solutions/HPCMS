"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const NODES = [
	{ x: 12, y: 18, r: 3, delay: 0 },
	{ x: 88, y: 12, r: 2.5, delay: 0.4 },
	{ x: 75, y: 72, r: 3.5, delay: 0.8 },
	{ x: 22, y: 78, r: 2, delay: 0.6 },
	{ x: 50, y: 8, r: 2.5, delay: 0.2 },
	{ x: 95, y: 45, r: 2, delay: 1.0 },
	{ x: 5, y: 50, r: 2, delay: 0.9 },
	{ x: 62, y: 90, r: 2.5, delay: 0.7 },
	{ x: 38, y: 22, r: 2, delay: 0.3 },
]

const CONNECTIONS = [
	{ x1: "12%", y1: "18%", x2: "22%", y2: "78%", delay: 0.5 },
	{ x1: "12%", y1: "18%", x2: "50%", y2: "8%", delay: 0.7 },
	{ x1: "88%", y1: "12%", x2: "95%", y2: "45%", delay: 0.9 },
	{ x1: "88%", y1: "12%", x2: "50%", y2: "8%", delay: 0.6 },
	{ x1: "75%", y1: "72%", x2: "95%", y2: "45%", delay: 1.1 },
	{ x1: "75%", y1: "72%", x2: "62%", y2: "90%", delay: 0.8 },
	{ x1: "22%", y1: "78%", x2: "62%", y2: "90%", delay: 1.0 },
	{ x1: "5%", y1: "50%", x2: "22%", y2: "78%", delay: 0.4 },
	{ x1: "38%", y1: "22%", x2: "50%", y2: "8%", delay: 0.3 },
	{ x1: "38%", y1: "22%", x2: "12%", y2: "18%", delay: 0.6 },
]

function HeroBackground({ scrollY }: { scrollY: ReturnType<typeof useScroll>["scrollY"] }) {
	const gridY = useTransform(scrollY, [0, 600], [0, -60])
	const nodesY = useTransform(scrollY, [0, 600], [0, -30])

	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				overflow: "hidden",
				pointerEvents: "none",
			}}
		>
			{/* Gradient base */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.25 0.06 258 / 0.5), transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, oklch(0.715 0.115 189 / 0.07), transparent 60%)",
				}}
			/>

			{/* Isometric grid */}
			<motion.svg
				style={{ position: "absolute", inset: 0, width: "100%", height: "100%", y: gridY }}
				viewBox="0 0 1200 800"
				preserveAspectRatio="xMidYMid slice"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
						<path
							d="M 60 0 L 0 0 0 60"
							fill="none"
							stroke="var(--foreground)"
							strokeWidth="0.3"
							opacity="0.04"
						/>
					</pattern>
					<pattern id="grid-large" width="180" height="180" patternUnits="userSpaceOnUse">
						<path
							d="M 180 0 L 0 0 0 180"
							fill="none"
							stroke="var(--primary)"
							strokeWidth="0.4"
							opacity="0.05"
						/>
					</pattern>
				</defs>
				<rect width="1200" height="800" fill="url(#grid)" />
				<rect width="1200" height="800" fill="url(#grid-large)" />
			</motion.svg>

			{/* Floating nodes + connections */}
			<motion.svg
				style={{ position: "absolute", inset: 0, width: "100%", height: "100%", y: nodesY }}
				viewBox="0 0 100 100"
				preserveAspectRatio="xMidYMid slice"
				xmlns="http://www.w3.org/2000/svg"
			>
				{/* Connections */}
				{CONNECTIONS.map((c, i) => (
					<motion.line
						key={i}
						x1={c.x1}
						y1={c.y1}
						x2={c.x2}
						y2={c.y2}
						stroke="var(--primary)"
						strokeWidth="0.12"
						opacity={0.25}
						initial={{ pathLength: 0, opacity: 0 }}
						animate={{ pathLength: 1, opacity: 0.2 }}
						transition={{ duration: 1.4, delay: c.delay, ease: "easeOut" }}
					/>
				))}

				{/* Nodes */}
				{NODES.map((n, i) => (
					<motion.circle
						key={i}
						cx={`${n.x}%`}
						cy={`${n.y}%`}
						r={n.r * 0.35}
						fill="var(--primary)"
						initial={{ scale: 0, opacity: 0 }}
						animate={{
							scale: 1,
							opacity: [0.5, 0.9, 0.5],
						}}
						transition={{
							scale: { duration: 0.5, delay: n.delay },
							opacity: { duration: 3.5, delay: n.delay, repeat: Infinity, ease: "easeInOut" },
						}}
					/>
				))}

				{/* Pulse from center */}
				{[0, 1.2, 2.4].map((d) => (
					<motion.circle
						key={d}
						cx="50%"
						cy="45%"
						r={0}
						fill="none"
						stroke="var(--primary)"
						strokeWidth="0.15"
						initial={{ r: 0, opacity: 0.4 }}
						animate={{ r: 28, opacity: 0 }}
						transition={{ duration: 3.5, delay: d, repeat: Infinity, ease: "easeOut" }}
					/>
				))}
			</motion.svg>
		</div>
	)
}

function DashboardMockup() {
	const rows = [
		{ id: "CS-2847", patient: "Santos, Maria R.", status: "Active", priority: "High", dept: "Cardiology" },
		{ id: "CS-2846", patient: "Reyes, Jose A.", status: "Pending", priority: "Med", dept: "Oncology" },
		{ id: "CS-2845", patient: "Cruz, Ana L.", status: "Active", priority: "Low", dept: "Pediatrics" },
		{ id: "CS-2844", patient: "Lim, Robert T.", status: "Closed", priority: "Med", dept: "Nephrology" },
	]

	const statusColor: Record<string, string> = {
		Active: "var(--chart-2)",
		Pending: "var(--chart-4)",
		Closed: "var(--muted-foreground)",
	}

	const priorityColor: Record<string, string> = {
		High: "var(--destructive)",
		Med: "var(--chart-4)",
		Low: "var(--chart-5)",
	}

	const containerVariants = {
		hidden: {},
		visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
	}
	const panelVariants = {
		hidden: { opacity: 0, y: 16 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
	}

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			style={{
				width: "100%",
				maxWidth: "560px",
				borderRadius: "12px",
				border: "1px solid var(--border)",
				background: "var(--card)",
				overflow: "hidden",
				boxShadow: "0 32px 80px oklch(0.05 0.02 258 / 0.6), 0 0 0 1px var(--border)",
			}}
		>
			{/* Titlebar */}
			<motion.div
				variants={panelVariants}
				style={{
					height: "38px",
					background: "var(--muted)",
					display: "flex",
					alignItems: "center",
					padding: "0 14px",
					gap: "8px",
					borderBottom: "1px solid var(--border)",
				}}
			>
				<div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--destructive)", opacity: 0.7 }} />
				<div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--chart-4)", opacity: 0.7 }} />
				<div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--chart-5)", opacity: 0.7 }} />
				<div
					style={{
						flex: 1,
						margin: "0 24px",
						height: "20px",
						background: "var(--background)",
						borderRadius: "4px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<span style={{ fontSize: "9px", color: "var(--muted-foreground)", fontFamily: "monospace" }}>
						pcms.slmc.com.ph/cases
					</span>
				</div>
			</motion.div>

			<div style={{ display: "flex", height: "340px" }}>
				{/* Sidebar */}
				<motion.div
					variants={panelVariants}
					style={{
						width: "140px",
						borderRight: "1px solid var(--border)",
						background: "oklch(from var(--card) l c h / 0.6)",
						padding: "12px 0",
						display: "flex",
						flexDirection: "column",
						gap: "2px",
					}}
				>
					{/* Logo */}
					<div style={{ padding: "6px 12px 12px", borderBottom: "1px solid var(--border)", marginBottom: "6px" }}>
						<div style={{ width: "40px", height: "14px", background: "var(--primary)", borderRadius: "3px", opacity: 0.8 }} />
					</div>
					{[
						{ label: "Cases", active: true, accent: "var(--primary)" },
						{ label: "Patients", active: false, accent: null },
						{ label: "Inbox", active: false, accent: null },
						{ label: "Triage AI", active: false, accent: null },
						{ label: "Claims", active: false, accent: null },
						{ label: "Incidents", active: false, accent: null },
					].map((item) => (
						<div
							key={item.label}
							style={{
								padding: "7px 12px",
								fontSize: "10px",
								fontWeight: item.active ? 600 : 400,
								color: item.active ? "var(--foreground)" : "var(--muted-foreground)",
								background: item.active ? "var(--muted)" : "transparent",
								borderLeft: item.active ? "2px solid var(--primary)" : "2px solid transparent",
								borderRadius: "0 4px 4px 0",
							}}
						>
							{item.label}
						</div>
					))}
				</motion.div>

				{/* Main content */}
				<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
					{/* Header */}
					<motion.div
						variants={panelVariants}
						style={{
							padding: "10px 14px",
							borderBottom: "1px solid var(--border)",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<span style={{ fontSize: "11px", fontWeight: 700, color: "var(--foreground)" }}>Case Queue</span>
						<div style={{ display: "flex", gap: "6px" }}>
							{["All", "Active", "Pending"].map((f, i) => (
								<div
									key={f}
									style={{
										fontSize: "8.5px",
										padding: "2px 7px",
										borderRadius: "4px",
										background: i === 0 ? "var(--primary)" : "var(--muted)",
										color: i === 0 ? "var(--primary-foreground)" : "var(--muted-foreground)",
									}}
								>
									{f}
								</div>
							))}
						</div>
					</motion.div>

					{/* Table header */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "60px 1fr 52px 40px",
							gap: "4px",
							padding: "5px 14px",
							borderBottom: "1px solid var(--border)",
						}}
					>
						{["Case ID", "Patient", "Status", "Pri."].map((h) => (
							<span key={h} style={{ fontSize: "8px", color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
								{h}
							</span>
						))}
					</div>

					{/* Table rows */}
					{rows.map((row, i) => (
						<motion.div
							key={row.id}
							variants={{
								hidden: { opacity: 0, x: -8 },
								visible: { opacity: 1, x: 0, transition: { delay: 0.5 + i * 0.08, duration: 0.4 } },
							}}
							style={{
								display: "grid",
								gridTemplateColumns: "60px 1fr 52px 40px",
								gap: "4px",
								padding: "8px 14px",
								borderBottom: "1px solid var(--border)",
								alignItems: "center",
							}}
						>
							<span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--primary)", fontWeight: 600 }}>{row.id}</span>
							<div>
								<div style={{ fontSize: "9px", color: "var(--foreground)", fontWeight: 500 }}>{row.patient}</div>
								<div style={{ fontSize: "8px", color: "var(--muted-foreground)" }}>{row.dept}</div>
							</div>
							<div
								style={{
									fontSize: "8px",
									padding: "2px 5px",
									borderRadius: "3px",
									background: `${statusColor[row.status]}18`,
									color: statusColor[row.status],
									fontWeight: 600,
									border: `1px solid ${statusColor[row.status]}30`,
									textAlign: "center",
								}}
							>
								{row.status}
							</div>
							<div
								style={{
									fontSize: "8px",
									padding: "2px 5px",
									borderRadius: "3px",
									background: `${priorityColor[row.priority]}18`,
									color: priorityColor[row.priority],
									fontWeight: 600,
									textAlign: "center",
								}}
							>
								{row.priority}
							</div>
						</motion.div>
					))}

					{/* Stats bar */}
					<motion.div
						variants={panelVariants}
						style={{
							marginTop: "auto",
							padding: "8px 14px",
							background: "var(--muted)",
							display: "flex",
							gap: "16px",
						}}
					>
						{[
							{ label: "Open", value: "142", color: "var(--chart-1)" },
							{ label: "Pending", value: "38", color: "var(--chart-4)" },
							{ label: "Today", value: "24", color: "var(--chart-2)" },
						].map((stat) => (
							<div key={stat.label}>
								<div style={{ fontSize: "14px", fontWeight: 700, color: stat.color }}>{stat.value}</div>
								<div style={{ fontSize: "8px", color: "var(--muted-foreground)" }}>{stat.label}</div>
							</div>
						))}
					</motion.div>
				</div>
			</div>
		</motion.div>
	)
}

export function HeroSection() {
	const containerRef = useRef<HTMLDivElement>(null)
	const { scrollY } = useScroll()
	const contentY = useTransform(scrollY, [0, 500], [0, -40])

	return (
		<section
			id="hero"
			ref={containerRef}
			style={{
				position: "relative",
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				background: "var(--background)",
				overflow: "hidden",
				paddingTop: "64px",
			}}
		>
			<HeroBackground scrollY={scrollY} />

			<div
				style={{
					position: "relative",
					zIndex: 1,
					maxWidth: "1280px",
					margin: "0 auto",
					padding: "80px 24px 80px",
					width: "100%",
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "48px",
					alignItems: "center",
				}}
				className="hero-grid"
			>
				{/* Left: Copy */}
				<motion.div style={{ y: contentY }}>
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
					>
						{/* Badge */}
						<div
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "8px",
								padding: "5px 12px 5px 8px",
								borderRadius: "100px",
								border: "1px solid var(--primary)",
								background: "oklch(from var(--primary) l c h / 0.1)",
								marginBottom: "28px",
							}}
						>
							<div
								style={{
									width: "6px",
									height: "6px",
									borderRadius: "50%",
									background: "var(--accent)",
								}}
							/>
							<motion.div
								animate={{ opacity: [1, 0.3, 1] }}
								transition={{ duration: 2, repeat: Infinity }}
								style={{
									position: "absolute",
									width: "6px",
									height: "6px",
									borderRadius: "50%",
									background: "var(--accent)",
									marginLeft: "8px",
								}}
							/>
							<span
								style={{
									fontSize: "12px",
									fontWeight: 600,
									color: "var(--primary)",
									letterSpacing: "0.04em",
									textTransform: "uppercase",
								}}
							>
								Enterprise Healthcare Platform
							</span>
						</div>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 32 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
						style={{
							fontSize: "clamp(32px, 4.5vw, 58px)",
							fontWeight: 800,
							lineHeight: 1.08,
							letterSpacing: "-0.025em",
							color: "var(--foreground)",
							marginBottom: "20px",
							fontFamily: "var(--font-sans), system-ui, sans-serif",
						}}
					>
						Centralized Patient{" "}
						<span style={{ color: "var(--primary)" }}>Case Management</span>
						{" "}for St. Luke's Medical Center
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
						style={{
							fontSize: "clamp(15px, 1.8vw, 18px)",
							lineHeight: 1.7,
							color: "var(--muted-foreground)",
							marginBottom: "36px",
							maxWidth: "520px",
						}}
					>
						An enterprise-grade platform centralizing case operations, omni-channel communications,
						AI-assisted triage, and bidirectional EMR integration across SLMC's clinical network.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
						style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
					>
						<motion.a
							href="#contact"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.97 }}
							onClick={(e) => {
								e.preventDefault()
								document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
							}}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "8px",
								fontSize: "15px",
								fontWeight: 600,
								color: "var(--primary-foreground)",
								background: "var(--primary)",
								padding: "13px 28px",
								borderRadius: "var(--radius)",
								textDecoration: "none",
								boxShadow: "0 4px 20px oklch(from var(--primary) l c h / 0.35)",
								letterSpacing: "0.01em",
							}}
						>
							Request Demo
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
								<path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</motion.a>

						<motion.a
							href="#architecture"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.97 }}
							onClick={(e) => {
								e.preventDefault()
								document.querySelector("#architecture")?.scrollIntoView({ behavior: "smooth" })
							}}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "8px",
								fontSize: "15px",
								fontWeight: 600,
								color: "var(--foreground)",
								background: "transparent",
								padding: "13px 28px",
								borderRadius: "var(--radius)",
								textDecoration: "none",
								border: "1px solid var(--border)",
								letterSpacing: "0.01em",
							}}
						>
							View Architecture
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
								<rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
								<path d="M4 7H10M7 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
							</svg>
						</motion.a>
					</motion.div>

					{/* Stats */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.6 }}
						style={{
							display: "flex",
							gap: "28px",
							marginTop: "44px",
							paddingTop: "32px",
							borderTop: "1px solid var(--border)",
						}}
					>
						{[
							{ value: "2", label: "SLMC Campuses", sub: "QC & BGC" },
							{ value: "8+", label: "Core Modules", sub: "Integrated" },
							{ value: "HL7", label: "FHIR R4", sub: "Bidirectional" },
						].map((stat) => (
							<div key={stat.label}>
								<div style={{ fontSize: "22px", fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.02em" }}>
									{stat.value}
								</div>
								<div style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)" }}>{stat.label}</div>
								<div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{stat.sub}</div>
							</div>
						))}
					</motion.div>
				</motion.div>

				{/* Right: Dashboard mockup */}
				<motion.div
					initial={{ opacity: 0, x: 40 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
					className="hero-visual"
				>
					<DashboardMockup />
				</motion.div>
			</div>

			{/* Scroll cue */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.2 }}
				style={{
					position: "absolute",
					bottom: "28px",
					left: "50%",
					transform: "translateX(-50%)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "6px",
				}}
			>
				<span style={{ fontSize: "11px", color: "var(--muted-foreground)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
					Scroll
				</span>
				<motion.div
					animate={{ y: [0, 5, 0] }}
					transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
				>
					<svg width="16" height="20" viewBox="0 0 16 20" fill="none">
						<rect x="1" y="1" width="14" height="18" rx="7" stroke="var(--muted-foreground)" strokeWidth="1.2" />
						<motion.rect
							x="6.5" y="4" width="3" height="5" rx="1.5"
							fill="var(--primary)"
							animate={{ y: [0, 4, 0] }}
							transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
						/>
					</svg>
				</motion.div>
			</motion.div>

			<style>{`
				@media (max-width: 768px) {
					.hero-grid {
						grid-template-columns: 1fr !important;
					}
					.hero-visual {
						display: none !important;
					}
				}
			`}</style>
		</section>
	)
}
