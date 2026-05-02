"use client"

import { motion } from "framer-motion"

function GridBackground() {
	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				overflow: "hidden",
				pointerEvents: "none",
			}}
		>
			<svg
				style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }}
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<pattern id="cta-grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
						<path d="M 48 0 L 0 0 0 48" fill="none" stroke="var(--primary)" strokeWidth="0.5" />
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#cta-grid)" />
			</svg>

			{/* Drifting blobs */}
			<motion.div
				animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
				transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
				style={{
					position: "absolute",
					top: "10%",
					left: "15%",
					width: "280px",
					height: "280px",
					borderRadius: "50%",
					background: "var(--primary)",
					opacity: 0.06,
					filter: "blur(60px)",
				}}
			/>
			<motion.div
				animate={{ x: [0, -25, 15, 0], y: [0, 25, -15, 0] }}
				transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
				style={{
					position: "absolute",
					bottom: "10%",
					right: "15%",
					width: "240px",
					height: "240px",
					borderRadius: "50%",
					background: "var(--accent)",
					opacity: 0.06,
					filter: "blur(60px)",
				}}
			/>
		</div>
	)
}

export function CtaSection() {
	return (
		<section
			id="contact"
			style={{
				background: "var(--background)",
				padding: "96px 24px",
				borderTop: "1px solid var(--border)",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<GridBackground />

			<div
				style={{
					maxWidth: "760px",
					margin: "0 auto",
					textAlign: "center",
					position: "relative",
					zIndex: 1,
				}}
			>
				<motion.div
					initial={{ opacity: 0, y: 32 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
				>
					{/* Badge */}
					<div
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: "8px",
							padding: "4px 14px",
							borderRadius: "4px",
							background: "oklch(from var(--primary) l c h / 0.1)",
							border: "1px solid oklch(from var(--primary) l c h / 0.3)",
							marginBottom: "24px",
						}}
					>
						<span style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
							Purpose-Built for SLMC
						</span>
					</div>

					{/* Headline */}
					<h2
						style={{
							fontSize: "clamp(30px, 4.5vw, 54px)",
							fontWeight: 900,
							color: "var(--foreground)",
							letterSpacing: "-0.025em",
							lineHeight: 1.1,
							marginBottom: "20px",
							fontFamily: "var(--font-sans), system-ui, sans-serif",
						}}
					>
						Ready to transform patient
						<br />
						<span style={{ color: "var(--primary)" }}>case management at SLMC?</span>
					</h2>

					{/* Sub-copy */}
					<p
						style={{
							fontSize: "17px",
							color: "var(--muted-foreground)",
							lineHeight: 1.7,
							maxWidth: "560px",
							margin: "0 auto 36px",
						}}
					>
						PCMS is purpose-engineered for St. Luke's Medical Center's operational excellence —
						not a generic platform adapted to healthcare, but a clinical precision system built
						from the ground up for SLMC's workflows, systems, and scale.
					</p>

					{/* CTAs */}
					<div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
						<motion.a
							href="#contact"
							whileHover={{ scale: 1.03, boxShadow: "0 0 28px oklch(from var(--primary) l c h / 0.35)" }}
							whileTap={{ scale: 0.97 }}
							transition={{ type: "spring", stiffness: 300, damping: 28 }}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "8px",
								padding: "13px 28px",
								borderRadius: "var(--radius)",
								background: "var(--primary)",
								color: "oklch(0.985 0.003 247)",
								fontWeight: 700,
								fontSize: "15px",
								textDecoration: "none",
								letterSpacing: "0.01em",
								fontFamily: "var(--font-sans), system-ui, sans-serif",
							}}
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							Request a Demo
						</motion.a>

						<motion.a
							href="mailto:pcms@stlukes.com.ph"
							whileHover={{ scale: 1.03, borderColor: "var(--primary)" }}
							whileTap={{ scale: 0.97 }}
							transition={{ type: "spring", stiffness: 300, damping: 28 }}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "8px",
								padding: "13px 28px",
								borderRadius: "var(--radius)",
								background: "transparent",
								color: "var(--foreground)",
								fontWeight: 600,
								fontSize: "15px",
								textDecoration: "none",
								border: "1.5px solid var(--border)",
								letterSpacing: "0.01em",
								fontFamily: "var(--font-sans), system-ui, sans-serif",
							}}
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
								<rect x="1.5" y="3" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
								<path d="M1.5 5.5L8 9.5L14.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
							</svg>
							Contact the Team
						</motion.a>
					</div>
				</motion.div>

				{/* Supporting metrics */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					style={{
						display: "flex",
						justifyContent: "center",
						gap: "40px",
						marginTop: "52px",
						flexWrap: "wrap",
						paddingTop: "32px",
						borderTop: "1px solid var(--border)",
					}}
				>
					{[
						{ value: "2", label: "Hospital Campuses" },
						{ value: "8+", label: "Core Modules" },
						{ value: "FHIR R4", label: "EMR Integration" },
					].map((stat) => (
						<div key={stat.label} style={{ textAlign: "center" }}>
							<div
								style={{
									fontSize: "24px",
									fontWeight: 900,
									color: "var(--primary)",
									letterSpacing: "-0.02em",
									fontFamily: "var(--font-sans), system-ui, sans-serif",
								}}
							>
								{stat.value}
							</div>
							<div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px" }}>
								{stat.label}
							</div>
						</div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
