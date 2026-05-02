"use client"

import { motion } from "framer-motion"

const containerVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.1 } },
}
const nodeVariants = {
	hidden: { scale: 0, opacity: 0 },
	visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 240, damping: 22 } },
}

const FHIR_RESOURCES = [
	{ id: "Patient", x: 540, y: 80, color: "var(--chart-1)", delay: 0.1 },
	{ id: "Encounter", x: 620, y: 155, color: "var(--chart-1)", delay: 0.2 },
	{ id: "Condition", x: 650, y: 250, color: "var(--chart-2)", delay: 0.3 },
	{ id: "ServiceRequest", x: 610, y: 345, color: "var(--chart-2)", delay: 0.4 },
	{ id: "Coverage", x: 540, y: 420, color: "var(--chart-4)", delay: 0.5 },
	{ id: "Immunization", x: 450, y: 460, color: "var(--chart-5)", delay: 0.6 },
	{ id: "Procedure", x: 360, y: 460, color: "var(--chart-5)", delay: 0.65 },
	{ id: "Observation", x: 270, y: 420, color: "var(--chart-3)", delay: 0.55 },
]

function FhirResourceNode({ id, x, y, color, delay }: { id: string; x: number; y: number; color: string; delay: number }) {
	return (
		<motion.g
			variants={nodeVariants}
			transition={{ delay }}
		>
			<rect x={x - 46} y={y - 14} width="92" height="28" rx="5" fill="var(--card)" stroke={color} strokeWidth="1" />
			<text x={x} y={y + 5} textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--foreground)" fontFamily="var(--font-sans), system-ui, sans-serif">
				{id}
			</text>
		</motion.g>
	)
}

function DrawLine({ x1, y1, x2, y2, delay, color = "var(--primary)" }: { x1: number; y1: number; x2: number; y2: number; delay: number; color?: string }) {
	return (
		<motion.path
			d={`M ${x1} ${y1} L ${x2} ${y2}`}
			stroke={color}
			strokeWidth={1}
			strokeDasharray="4 3"
			fill="none"
			opacity={0.4}
			initial={{ pathLength: 0, opacity: 0 }}
			whileInView={{ pathLength: 1, opacity: 0.35 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.9, delay: delay + 0.4, ease: "easeOut" }}
		/>
	)
}

const RESOURCE_CONNECTIONS = FHIR_RESOURCES.map((r) => ({
	x2: r.x,
	y2: r.y,
	delay: r.delay,
	color: r.color,
}))

function FhirDiagram() {
	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
			<motion.svg
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
				viewBox="0 0 800 540"
				style={{ width: "100%", maxWidth: "760px" }}
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<radialGradient id="pcmsGlow" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
						<stop offset="100%" stopColor="transparent" stopOpacity="0" />
					</radialGradient>
					<radialGradient id="emrGlow" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.08" />
						<stop offset="100%" stopColor="transparent" stopOpacity="0" />
					</radialGradient>
				</defs>

				{/* Draw connection lines from PCMS to each resource */}
				{RESOURCE_CONNECTIONS.map((c, i) => (
					<DrawLine key={i} x1={185} y1={270} x2={c.x2} y2={c.y2} delay={c.delay} color={c.color} />
				))}

				{/* Bidirectional arrow between PCMS and EMR */}
				<motion.path
					d="M 250 270 L 350 270"
					stroke="var(--primary)"
					strokeWidth={2}
					fill="none"
					initial={{ pathLength: 0, opacity: 0 }}
					whileInView={{ pathLength: 1, opacity: 0.9 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
				/>
				<motion.path
					d="M 248 265 L 248 275"
					stroke="var(--primary)"
					strokeWidth={2}
					fill="none"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 0.9 }}
					viewport={{ once: true }}
					transition={{ delay: 0.9 }}
				/>
				{/* Arrow heads */}
				<motion.path
					d="M 348 265 L 354 270 L 348 275"
					stroke="var(--primary)" strokeWidth="1.5" fill="none"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 1.0 }}
				/>
				<motion.path
					d="M 252 265 L 246 270 L 252 275"
					stroke="var(--primary)" strokeWidth="1.5" fill="none"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 1.0 }}
				/>

				{/* FHIR R4 label on arrow */}
				<motion.text
					x={299}
					y={262}
					textAnchor="middle"
					fontSize={9}
					fontWeight="700"
					fill="var(--primary)"
					fontFamily="var(--font-sans), system-ui, sans-serif"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 1.1 }}
				>
					HL7 FHIR R4
				</motion.text>

				{/* PCMS Node */}
				<motion.g
					variants={nodeVariants}
				>
					<circle cx={185} cy={270} r={70} fill="url(#pcmsGlow)" />
					<circle cx={185} cy={270} r={56} fill="var(--card)" stroke="var(--primary)" strokeWidth={2} />
					<text x={185} y={264} textAnchor="middle" fontSize={13} fontWeight="800" fill="var(--primary)" fontFamily="var(--font-sans), system-ui, sans-serif">PCMS</text>
					<text x={185} y={280} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)" fontFamily="var(--font-sans), system-ui, sans-serif">Core Platform</text>
				</motion.g>

				{/* Hospital EMR Node */}
				<motion.g
					variants={nodeVariants}
					transition={{ delay: 0.05 }}
				>
					<circle cx={430} cy={270} r={70} fill="url(#emrGlow)" />
					<circle cx={430} cy={270} r={54} fill="var(--card)" stroke="var(--chart-1)" strokeWidth={1.8} />
					<text x={430} y={260} textAnchor="middle" fontSize={10} fontWeight="700" fill="var(--chart-1)" fontFamily="var(--font-sans), system-ui, sans-serif">Hospital</text>
					<text x={430} y={274} textAnchor="middle" fontSize={9} fontWeight="600" fill="var(--foreground)" fontFamily="var(--font-sans), system-ui, sans-serif">EMR Platform</text>
					<text x={430} y={286} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)" fontFamily="var(--font-sans), system-ui, sans-serif">SMART on FHIR</text>
				</motion.g>

				{/* FHIR Resource nodes around EMR */}
				{FHIR_RESOURCES.map((r) => (
					<FhirResourceNode key={r.id} {...r} />
				))}

				{/* SMART on FHIR label */}
				<motion.g
					initial={{ opacity: 0, y: 8 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.8 }}
				>
					<path d="M 430 326 C 430 360 430 380 430 400" stroke="var(--chart-2)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
					<text x={430} y={415} textAnchor="middle" fontSize={8} fill="var(--chart-2)" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="600">
						SMART Launch Context
					</text>
				</motion.g>
			</motion.svg>
		</div>
	)
}

function FhirBadge({ label, sublabel, color }: { label: string; sublabel: string; color: string }) {
	return (
		<div
			style={{
				display: "inline-flex",
				flexDirection: "column",
				alignItems: "center",
				padding: "12px 20px",
				borderRadius: "var(--radius)",
				background: "var(--card)",
				border: `1.5px solid ${color}`,
				gap: "2px",
			}}
		>
			<span style={{ fontSize: "13px", fontWeight: 800, color, letterSpacing: "0.02em" }}>{label}</span>
			<span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>{sublabel}</span>
		</div>
	)
}

const INTEGRATION_FEATURES = [
	{
		title: "Bidirectional FHIR R4 Data Exchange",
					description: "Patient demographics, encounters, conditions, procedures, and coverage synchronized in real time with any HL7 FHIR-compliant EMR platform.",
		color: "var(--chart-1)",
	},
	{
		title: "SMART on FHIR Embedded Experience",
		description: "PCMS modules launch directly within the EMR clinician workflow — no context switching, authenticated via SMART launch protocol.",
		color: "var(--chart-2)",
	},
	{
		title: "OAuth 2.0 / OpenID Connect Security",
		description: "Enterprise-grade authorization with scoped access tokens, session validation, and audit logging for every API transaction.",
		color: "var(--chart-3)",
	},
	{
		title: "Contextual Patient Launch",
		description: "Case context auto-populated from the active EMR patient session — care coordinators see the full 360 view instantly.",
		color: "var(--accent)",
	},
]

export function FhirSection() {
	return (
		<section
			id="integration"
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
							background: "oklch(from var(--chart-1) l c h / 0.1)",
							border: "1px solid oklch(from var(--chart-1) l c h / 0.25)",
							marginBottom: "16px",
						}}
					>
						<span style={{ fontSize: "11px", fontWeight: 700, color: "var(--chart-1)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
							EMR Integration
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
						Integrates with any FHIR-compliant EMR platform
					</h2>
					<p style={{ fontSize: "17px", color: "var(--muted-foreground)", maxWidth: "540px", margin: "0 auto", lineHeight: 1.6 }}>
						Bidirectional HL7 FHIR R4 integration and SMART on FHIR embeds PCMS directly into
					any EMR clinician workflow — no duplicate data entry, no context switching.
					</p>

					{/* Badges */}
					<div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
						<FhirBadge label="HL7 FHIR R4" sublabel="Data Exchange" color="var(--chart-1)" />
						<FhirBadge label="SMART on FHIR" sublabel="Launch Protocol" color="var(--chart-2)" />
						<FhirBadge label="OAuth 2.0" sublabel="Authorization" color="var(--chart-3)" />
					</div>
				</motion.div>

				{/* Diagram */}
				<FhirDiagram />

				{/* Feature grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
						gap: "16px",
						marginTop: "56px",
					}}
				>
					{INTEGRATION_FEATURES.map((feat) => (
						<motion.div
							key={feat.title}
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
							}}
							style={{
								padding: "20px",
								borderRadius: "var(--radius)",
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderLeft: `3px solid ${feat.color}`,
							}}
						>
							<div
								style={{
									width: "8px",
									height: "8px",
									borderRadius: "50%",
									background: feat.color,
									marginBottom: "12px",
								}}
							/>
							<h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", marginBottom: "8px", lineHeight: 1.3 }}>
								{feat.title}
							</h3>
							<p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
								{feat.description}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
