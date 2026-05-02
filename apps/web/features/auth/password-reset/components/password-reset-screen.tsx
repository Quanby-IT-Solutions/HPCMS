"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useMutation } from "@tanstack/react-query"

import { authClient } from "@/services/better-auth/auth-client"

// ─── SCOPED THEME ─────────────────────────────────────────────────────────────

const STYLES = `
	.pcms-reset {
		--bg: oklch(0.12 0.03 268);
		--fg: oklch(0.96 0.01 254);
		--card: oklch(0.165 0.032 268);
		--muted: oklch(0.21 0.025 268);
		--muted-fg: oklch(0.57 0.04 268);
		--border: oklch(1 0 0 / 0.09);
		--primary: oklch(0.46 0.155 270);
		--primary-fg: oklch(0.97 0.01 254);
		--accent: oklch(0.62 0.13 195);
		--destructive: oklch(0.68 0.20 22);
		--ring: oklch(0.46 0.155 270 / 0.38);
		font-family: var(--font-sans, 'Inter', 'DM Sans', system-ui, sans-serif);
	}
	.pcms-reset.light {
		--bg: oklch(0.97 0.006 268);
		--fg: oklch(0.18 0.06 270);
		--card: oklch(1 0 0);
		--muted: oklch(0.93 0.012 268);
		--muted-fg: oklch(0.47 0.05 268);
		--border: oklch(0.87 0.015 268);
		--primary: oklch(0.35 0.15 270);
		--primary-fg: oklch(0.98 0.01 254);
		--accent: oklch(0.55 0.13 195);
		--destructive: oklch(0.52 0.22 25);
		--ring: oklch(0.35 0.15 270 / 0.38);
	}
	.pcms-reset *, .pcms-reset *::before, .pcms-reset *::after { box-sizing: border-box; }
	.pcms-reset input { outline: none; background: transparent; border: none; width: 100%; color: inherit; font: inherit; }
	.pcms-reset button { font-family: inherit; cursor: pointer; }
	.pcms-reset a:focus-visible, .pcms-reset button:focus-visible {
		outline: 2px solid var(--ring); outline-offset: 2px; border-radius: 6px;
	}
	.pcms-reset .display-font {
		font-family: 'Plus Jakarta Sans', 'Outfit', 'Satoshi', system-ui, sans-serif;
	}
`

// ─── INLINE ICONS ─────────────────────────────────────────────────────────────

const Icon = {
	Sun: () => (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
			<circle cx="7" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.2" />
			{[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
				const r = (Math.PI * deg) / 180
				const x1 = 7 + Math.cos(r) * 4.2,
					y1 = 7 + Math.sin(r) * 4.2
				const x2 = 7 + Math.cos(r) * 5.5,
					y2 = 7 + Math.sin(r) * 5.5
				return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			})}
		</svg>
	),
	Moon: () => (
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
			<path d="M11 9.2C9.9 9.9 8.6 10.3 7.2 10.3 3.8 10.3 1 7.5 1 4.1 1 2.7 1.5 1.4 2.3.5 0 1.4-1.5 3.8-1 6.6-.4 9.5 2.2 11.4 5.1 10.8 7.2 10.4 9.1 9 11 7"
				stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" fill="none" />
		</svg>
	),
	Mail: ({ size = 16 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
			<rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
			<path d="M2 4.5L8 8.5L14 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
		</svg>
	),
	ShieldKey: ({ size = 52 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 52 52" fill="none" aria-hidden>
			<path d="M26 4L8 11V25C8 35.5 16 44 26 47.5 36 44 44 35.5 44 25V11L26 4Z"
				stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
			{/* Key inside */}
			<circle cx="22" cy="24" r="4" stroke="currentColor" strokeWidth="1.5" />
			<path d="M25 25L33 25M33 25V28M30 25V27.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	MailCheck: ({ size = 56 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
			{/* envelope */}
			<motion.rect x="6" y="14" width="44" height="30" rx="3"
				stroke="currentColor" strokeWidth="1.6" fill="none"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			/>
			<motion.path d="M7 16L28 31L49 16"
				stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 }}
			/>
			{/* check badge */}
			<motion.circle cx="42" cy="40" r="9"
				fill="var(--accent)" stroke="var(--accent)" strokeWidth="1.4"
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.85, type: "spring", stiffness: 360, damping: 22 }}
				style={{ transformOrigin: "42px 40px" }}
			/>
			<motion.path d="M38 40L41 43L46 37"
				stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: 0.4, ease: "easeOut", delay: 1.05 }}
			/>
		</svg>
	),
	AlertTriangle: ({ size = 15 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 15 15" fill="none" aria-hidden>
			<path d="M7.5 2L1 13H14L7.5 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
			<line x1="7.5" y1="6.5" x2="7.5" y2="9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			<circle cx="7.5" cy="11" r="0.7" fill="currentColor" />
		</svg>
	),
	Exclamation: ({ size = 12 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 13 13" fill="none" aria-hidden>
			<circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.1" />
			<line x1="6.5" y1="4.2" x2="6.5" y2="7.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			<circle cx="6.5" cy="9" r="0.7" fill="currentColor" />
		</svg>
	),
	Lock: ({ size = 11 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 15 15" fill="none" aria-hidden>
			<rect x="2.5" y="7" width="10" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
			<path d="M4.5 7V5C4.5 3.07 5.57 2 7.5 2 9.43 2 10.5 3.07 10.5 5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
		</svg>
	),
	Spinner: () => (
		<svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
			<motion.circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
				strokeDasharray="14 28"
				animate={{ rotate: 360 }}
				transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
				style={{ transformOrigin: "9px 9px" }}
			/>
		</svg>
	),
	ArrowLeft: ({ size = 13 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
			<path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
} as const

// ─── BACKGROUND ───────────────────────────────────────────────────────────────

function AnimatedGrid() {
	return (
		<svg width="100%" height="100%" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice"
			style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none" }} aria-hidden>
			<defs>
				<pattern id="reset-grid" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
					<path d="M56 0L0 0 0 56" fill="none" stroke="oklch(0.7 0.12 270)" strokeWidth="0.4" />
				</pattern>
			</defs>
			<motion.rect width="100%" height="120%" fill="url(#reset-grid)"
				animate={{ y: ["0%", "9.33%", "0%"] }}
				transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
			/>
		</svg>
	)
}

function NodeNetwork({ reduced }: { reduced: boolean }) {
	const nodes = [
		{ x: 120, y: 140 }, { x: 680, y: 110 }, { x: 90, y: 640 },
		{ x: 720, y: 660 }, { x: 400, y: 80 }, { x: 380, y: 720 },
	] as const
	const edges = [[0, 4], [4, 1], [0, 2], [1, 3], [2, 5], [5, 3], [4, 5]] as const
	if (reduced) return null
	return (
		<svg width="100%" height="100%" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice"
			style={{ position: "absolute", inset: 0, opacity: 0.32, pointerEvents: "none" }} aria-hidden>
			{edges.map(([a, b], i) => {
				const na = nodes[a]
				const nb = nodes[b]
				if (!na || !nb) return null
				return (
					<motion.line key={i}
						x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
						stroke="var(--primary)" strokeWidth="0.7" strokeDasharray="3 6"
						initial={{ pathLength: 0, opacity: 0 }}
						animate={{ pathLength: 1, opacity: 0.55 }}
						transition={{ duration: 1.6, delay: 0.2 + i * 0.12, ease: "easeOut" }}
					/>
				)
			})}
			{nodes.map((n, i) => (
				<motion.circle key={i} cx={n.x} cy={n.y} r="3"
					fill="none" stroke="var(--primary)" strokeWidth="1"
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 0.7 }}
					transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 280, damping: 22 }}
					style={{ transformOrigin: `${n.x}px ${n.y}px` }}
				/>
			))}
		</svg>
	)
}

function RadialPulse({ reduced }: { reduced: boolean }) {
	return (
		<motion.div aria-hidden
			animate={reduced ? undefined : { opacity: [0.42, 0.62, 0.42], scale: [1, 1.06, 1] }}
			transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
			style={{
				position: "absolute", top: "50%", left: "50%",
				width: "min(720px, 90vw)", height: "min(720px, 90vw)",
				transform: "translate(-50%, -50%)",
				background: "radial-gradient(circle, var(--primary) 0%, transparent 62%)",
				opacity: 0.42, pointerEvents: "none", filter: "blur(10px)",
			}}
		/>
	)
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────

function ThemeToggle({ isLight, onToggle }: { isLight: boolean; onToggle: () => void }) {
	return (
		<motion.button onClick={onToggle} aria-label="Toggle theme"
			whileTap={{ scale: 0.94 }}
			style={{
				display: "flex", alignItems: "center", gap: "5px",
				padding: "4px 8px 4px 7px", borderRadius: "100px",
				background: isLight ? "oklch(0.90 0.012 268)" : "oklch(0.20 0.025 268)",
				border: "1px solid var(--border)",
			}}>
			<motion.span animate={{ color: isLight ? "oklch(0.58 0.18 85)" : "oklch(0.55 0.04 268)" }}
				style={{ display: "flex", alignItems: "center" }}>
				<Icon.Sun />
			</motion.span>
			<div style={{
				position: "relative", width: "30px", height: "16px",
				background: isLight ? "oklch(0.85 0.015 268)" : "oklch(0.16 0.025 268)",
				borderRadius: "100px", border: "1px solid var(--border)", flexShrink: 0,
			}}>
				<motion.div
					animate={{ x: isLight ? 14 : 1 }}
					transition={{ type: "spring", stiffness: 500, damping: 38 }}
					style={{
						position: "absolute", top: "1px", width: "12px", height: "12px",
						borderRadius: "50%", background: "var(--primary)",
					}}
				/>
			</div>
			<motion.span animate={{ color: isLight ? "oklch(0.55 0.04 268)" : "oklch(0.80 0.04 268)" }}
				style={{ display: "flex", alignItems: "center" }}>
				<Icon.Moon />
			</motion.span>
		</motion.button>
	)
}

// ─── EMAIL FIELD ──────────────────────────────────────────────────────────────

function EmailField({
	value, onChange, error, disabled, focused, setFocused,
}: {
	value: string
	onChange: (v: string) => void
	error: string | null
	disabled: boolean
	focused: boolean
	setFocused: (v: boolean) => void
}) {
	const isFloated = focused || value.length > 0
	const borderColor = error ? "var(--destructive)" : focused ? "var(--ring)" : "var(--border)"
	const iconColor = error ? "var(--destructive)" : focused ? "var(--primary)" : "var(--muted-fg)"

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
			<div style={{
				position: "relative", display: "flex", alignItems: "center",
				height: "52px", padding: "0 14px 0 42px", borderRadius: "10px",
				background: "color-mix(in oklch, var(--bg) 55%, transparent)",
				border: `1px solid ${borderColor}`,
				boxShadow: focused && !error ? "0 0 0 4px var(--ring)" : "none",
				transition: "border-color 0.18s, box-shadow 0.2s",
			}}>
				<motion.span aria-hidden
					animate={{ color: iconColor }}
					style={{ position: "absolute", left: "14px", display: "flex", alignItems: "center" }}>
					<Icon.Mail />
				</motion.span>

				<motion.label htmlFor="reset-email"
					animate={{
						top: isFloated ? "6px" : "50%",
						y: isFloated ? 0 : "-50%",
						fontSize: isFloated ? "10.5px" : "14px",
						color: error
							? "var(--destructive)"
							: focused ? "var(--primary)" : "var(--muted-fg)",
						letterSpacing: isFloated ? "0.06em" : "0",
						fontWeight: isFloated ? 700 : 500,
					}}
					transition={{ type: "spring", stiffness: 400, damping: 32 }}
					style={{
						position: "absolute", left: "42px", pointerEvents: "none",
						textTransform: isFloated ? "uppercase" : "none",
					}}>
					Email address
				</motion.label>

				<input
					id="reset-email"
					type="email"
					autoComplete="email"
					inputMode="email"
					disabled={disabled}
					value={value}
					onChange={e => onChange(e.target.value)}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					aria-invalid={!!error}
					aria-describedby={error ? "reset-email-error" : undefined}
					style={{
						paddingTop: isFloated ? "14px" : "0",
						fontSize: "14.5px",
						color: "var(--fg)",
						transition: "padding-top 0.18s",
					}}
				/>
			</div>

			<div aria-live="polite" style={{ minHeight: "16px" }}>
				<AnimatePresence>
					{error && (
						<motion.div
							key="err"
							id="reset-email-error"
							initial={{ opacity: 0, y: -4, height: 0 }}
							animate={{ opacity: 1, y: 0, height: "auto" }}
							exit={{ opacity: 0, y: -4, height: 0 }}
							transition={{ duration: 0.18 }}
							style={{
								display: "flex", alignItems: "center", gap: "6px",
								color: "var(--destructive)", fontSize: "12px", fontWeight: 500,
							}}>
							<Icon.Exclamation />
							{error}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────

function isValidEmail(v: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function PasswordResetScreen() {
	const reduced = useReducedMotion() ?? false
	const [isLight, setIsLight] = useState(false)
	const [email, setEmail] = useState("")
	const [emailError, setEmailError] = useState<string | null>(null)
	const [focused, setFocused] = useState(false)
	const [submitted, setSubmitted] = useState("")
	const [shake, setShake] = useState(0)

	useEffect(() => {
		document.documentElement.style.background = isLight ? "oklch(0.97 0.006 268)" : "oklch(0.12 0.03 268)"
	}, [isLight])

	const { mutate, isPending, isError, error, isSuccess, reset } = useMutation({
		mutationFn: async (emailValue: string) => {
			const result = await authClient.requestPasswordReset({
				email: emailValue,
				redirectTo: "/password-reset/new",
			})
			if (result.error) throw new Error(result.error.message || "Failed to send reset link")
			return result
		},
		onSuccess: () => setSubmitted(email),
		onError: () => setShake(s => s + 1),
	})

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setEmailError(null)
		if (isError) reset()
		const trimmed = email.trim()
		if (!trimmed) {
			setEmailError("Email is required")
			setShake(s => s + 1)
			return
		}
		if (!isValidEmail(trimmed)) {
			setEmailError("Please enter a valid email address")
			setShake(s => s + 1)
			return
		}
		mutate(trimmed)
	}

	const containerVariants = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { staggerChildren: reduced ? 0 : 0.07, delayChildren: 0.1 } },
	}
	const itemVariants = {
		hidden: { opacity: 0, y: 14 },
		show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
	}

	return (
		<>
			<style dangerouslySetInnerHTML={{ __html: STYLES }} />
			<div className={`pcms-reset${isLight ? " light" : ""}`} style={{
				position: "relative", minHeight: "100svh", width: "100%",
				background: "var(--bg)", color: "var(--fg)", overflow: "hidden",
				display: "flex", flexDirection: "column",
			}}>
				{/* Atmospheric background */}
				<RadialPulse reduced={reduced} />
				<AnimatedGrid />
				<NodeNetwork reduced={reduced} />

				{/* Top bar */}
				<div style={{
					position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between",
					padding: "20px 24px 0", zIndex: 2,
				}}>
					<Link href="/login" style={{
						display: "flex", alignItems: "center", gap: "5px",
						fontSize: "13px", fontWeight: 600,
						color: "var(--muted-fg)", textDecoration: "none",
						transition: "color 0.15s",
					}}
						onMouseEnter={e => (e.currentTarget.style.color = "var(--fg)")}
						onMouseLeave={e => (e.currentTarget.style.color = "var(--muted-fg)")}
					>
						<Icon.ArrowLeft />
						Back to login
					</Link>
					<ThemeToggle isLight={isLight} onToggle={() => setIsLight(v => !v)} />
				</div>

				{/* Content */}
				<div style={{
					position: "relative", zIndex: 1, flex: 1,
					display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
					padding: "32px 16px",
				}}>
					{/* Logo */}
					<motion.div
						initial={{ opacity: 0, y: -10, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
						style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", marginBottom: "28px" }}
					>
						<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
							<svg width="34" height="34" viewBox="0 0 26 26" fill="none" aria-hidden>
								<rect x="1" y="1" width="24" height="24" rx="7" fill="var(--primary)" opacity="0.14" />
								<rect x="1" y="1" width="24" height="24" rx="7" stroke="var(--primary)" strokeWidth="1" opacity="0.55" />
								<path d="M13 5V21M5 13H21" stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round" />
							</svg>
							<span className="display-font" style={{
								fontSize: "22px", fontWeight: 800, letterSpacing: "-0.03em",
								color: "var(--fg)",
							}}>PCMS</span>
						</div>
						<span style={{
							fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em",
							color: "var(--muted-fg)", textTransform: "uppercase",
						}}>St. Luke&apos;s Medical Center</span>
					</motion.div>

					{/* Card */}
					<motion.div
						key={shake}
						initial={{ opacity: 0, y: 20 }}
						animate={shake > 0 && !reduced
							? { opacity: 1, y: 0, x: [0, -6, 6, -3, 3, 0] }
							: { opacity: 1, y: 0 }}
						transition={shake > 0
							? { x: { duration: 0.4, ease: "easeInOut" }, opacity: { duration: 0.4 }, y: { type: "spring", stiffness: 100, damping: 20 } }
							: { type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
						style={{
							position: "relative", width: "100%", maxWidth: "420px",
							background: "var(--card)",
							border: "1px solid var(--border)",
							borderRadius: "16px",
							padding: "36px 32px 24px",
							boxShadow: isLight
								? "0 18px 48px -22px oklch(0.30 0.10 270 / 0.30), 0 4px 12px -8px oklch(0.30 0.10 270 / 0.18)"
								: "0 28px 64px -20px oklch(0 0 0 / 0.55), 0 4px 12px -6px oklch(0 0 0 / 0.4)",
						}}>
						<AnimatePresence mode="wait" initial={false}>
							{!isSuccess ? (
								<motion.div
									key="form"
									variants={containerVariants}
									initial="hidden"
									animate="show"
									exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
								>
									{/* Header icon */}
									<motion.div variants={itemVariants}
										initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
										animate={{ opacity: 1, scale: 1, rotate: 0 }}
										transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.5 }}
										style={{
											display: "flex", justifyContent: "center", marginBottom: "18px",
											color: "var(--primary)",
										}}>
										<Icon.ShieldKey />
									</motion.div>

									<motion.h1 variants={itemVariants} className="display-font" style={{
										margin: 0, textAlign: "center",
										fontSize: "24px", fontWeight: 700, letterSpacing: "-0.02em",
										color: "var(--fg)",
									}}>Reset your password</motion.h1>

									<motion.p variants={itemVariants} style={{
										margin: "10px 0 24px", textAlign: "center",
										fontSize: "13.5px", lineHeight: 1.55,
										color: "var(--muted-fg)", textWrap: "balance",
									}}>Enter your email address and we&apos;ll send you a link to reset your password.</motion.p>

									{/* Error banner */}
									<AnimatePresence>
										{isError && (
											<motion.div
												key="banner"
												initial={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
												animate={{ opacity: 1, y: 0, height: "auto", marginBottom: 16 }}
												exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
												transition={{ duration: 0.22 }}
												role="alert"
												style={{
													display: "flex", alignItems: "flex-start", gap: "10px",
													padding: "10px 12px",
													background: "color-mix(in oklch, var(--destructive) 12%, transparent)",
													border: "1px solid color-mix(in oklch, var(--destructive) 30%, transparent)",
													borderLeft: "3px solid var(--destructive)",
													borderRadius: "8px",
													color: "var(--destructive)",
													fontSize: "12.5px", fontWeight: 500, lineHeight: 1.45,
												}}>
												<span style={{ marginTop: "1px", flexShrink: 0 }}><Icon.AlertTriangle /></span>
												<span>{error instanceof Error ? error.message : "We couldn't send the reset link. Please try again."}</span>
											</motion.div>
										)}
									</AnimatePresence>

									{/* Form */}
									<motion.form variants={itemVariants} onSubmit={handleSubmit} noValidate>
										<EmailField
											value={email}
											onChange={v => { setEmail(v); if (emailError) setEmailError(null) }}
											error={emailError}
											disabled={isPending}
											focused={focused}
											setFocused={setFocused}
										/>

										<motion.button type="submit" disabled={isPending}
											whileHover={isPending ? undefined : { scale: 1.02, y: -1 }}
											whileTap={isPending ? undefined : { scale: 0.98 }}
											style={{
												marginTop: "16px", width: "100%", height: "48px",
												display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
												background: "var(--primary)", color: "var(--primary-fg)",
												border: "none", borderRadius: "10px",
												fontSize: "14.5px", fontWeight: 700, letterSpacing: "-0.005em",
												opacity: isPending ? 0.78 : 1,
												cursor: isPending ? "not-allowed" : "pointer",
												boxShadow: "0 8px 22px -10px var(--primary)",
												transition: "opacity 0.15s",
											}}>
											<AnimatePresence mode="wait" initial={false}>
												{isPending ? (
													<motion.span key="loading"
														initial={{ opacity: 0, y: 4 }}
														animate={{ opacity: 1, y: 0 }}
														exit={{ opacity: 0, y: -4 }}
														transition={{ duration: 0.16 }}
														style={{ display: "flex", alignItems: "center", gap: "8px" }}>
														<Icon.Spinner />
														Sending...
													</motion.span>
												) : (
													<motion.span key="idle"
														initial={{ opacity: 0, y: 4 }}
														animate={{ opacity: 1, y: 0 }}
														exit={{ opacity: 0, y: -4 }}
														transition={{ duration: 0.16 }}>
														Send Reset Link
													</motion.span>
												)}
											</AnimatePresence>
										</motion.button>
									</motion.form>

									{/* Return link */}
									<motion.div variants={itemVariants} style={{
										marginTop: "20px", textAlign: "center",
										fontSize: "13px", color: "var(--muted-fg)",
									}}>
										Remember your password?{" "}
										<Link href="/login" style={{
											color: "var(--fg)", fontWeight: 600,
											textDecoration: "underline", textUnderlineOffset: "3px",
											textDecorationColor: "color-mix(in oklch, var(--fg) 35%, transparent)",
											transition: "color 0.15s, text-decoration-color 0.15s",
										}}
											onMouseEnter={e => {
												e.currentTarget.style.color = "var(--primary)"
												e.currentTarget.style.textDecorationColor = "var(--primary)"
											}}
											onMouseLeave={e => {
												e.currentTarget.style.color = "var(--fg)"
												e.currentTarget.style.textDecorationColor = "color-mix(in oklch, var(--fg) 35%, transparent)"
											}}
										>Return to login</Link>
									</motion.div>
								</motion.div>
							) : (
								<motion.div
									key="success"
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -8 }}
									transition={{ duration: 0.32, ease: "easeOut" }}
								>
									{/* Success icon */}
									<div style={{
										position: "relative",
										display: "flex", justifyContent: "center", marginBottom: "18px",
										color: "var(--accent)",
									}}>
										<Icon.MailCheck />
										{!reduced && (
											<motion.span aria-hidden
												initial={{ scale: 1, opacity: 0.35 }}
												animate={{ scale: 1.5, opacity: 0 }}
												transition={{ duration: 0.9, delay: 1.3, ease: "easeOut" }}
												style={{
													position: "absolute", top: "50%", left: "50%",
													width: "56px", height: "56px",
													transform: "translate(-50%, -50%)",
													borderRadius: "50%",
													border: "2px solid var(--accent)",
												}}
											/>
										)}
									</div>

									<motion.h1 className="display-font"
										initial={{ opacity: 0, y: 6 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: reduced ? 0 : 0.45, duration: 0.3 }}
										style={{
											margin: 0, textAlign: "center",
											fontSize: "24px", fontWeight: 700, letterSpacing: "-0.02em",
											color: "var(--fg)",
										}}>Check your email</motion.h1>

									<motion.p
										initial={{ opacity: 0, y: 6 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: reduced ? 0 : 0.55, duration: 0.3 }}
										style={{
											margin: "10px 0 22px", textAlign: "center",
											fontSize: "13.5px", lineHeight: 1.55,
											color: "var(--muted-fg)", textWrap: "balance",
										}}>
										We sent a password reset link to{" "}
										<strong style={{ color: "var(--fg)", fontWeight: 600, wordBreak: "break-all" }}>
											{submitted}
										</strong>
										. Check your inbox and follow the link to reset your password.
									</motion.p>

									<motion.div
										initial={{ opacity: 0, y: 6 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: reduced ? 0 : 0.7, duration: 0.3 }}
										style={{ textAlign: "center" }}
									>
										<Link href="/login" style={{
											fontSize: "13px", fontWeight: 600,
											color: "var(--muted-fg)",
											textDecoration: "underline", textUnderlineOffset: "3px",
											textDecorationColor: "color-mix(in oklch, var(--muted-fg) 40%, transparent)",
											transition: "color 0.15s, text-decoration-color 0.15s",
										}}
											onMouseEnter={e => {
												e.currentTarget.style.color = "var(--primary)"
												e.currentTarget.style.textDecorationColor = "var(--primary)"
											}}
											onMouseLeave={e => {
												e.currentTarget.style.color = "var(--muted-fg)"
												e.currentTarget.style.textDecorationColor = "color-mix(in oklch, var(--muted-fg) 40%, transparent)"
											}}
										>Return to login</Link>
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Security footer */}
						<div style={{
							marginTop: "26px", paddingTop: "16px",
							borderTop: "1px solid var(--border)",
							display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
							color: "var(--muted-fg)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.01em",
						}}>
							<Icon.Lock />
							This is a secure system. All access attempts are logged.
						</div>
					</motion.div>
				</div>
			</div>
		</>
	)
}
