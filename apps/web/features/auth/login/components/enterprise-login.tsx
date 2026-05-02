"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "@tanstack/react-form"

import { useLoginMutation } from "../api/login.hooks"
import { LoginSchema } from "../api/login.schema"

// â”€â”€â”€ SCOPED THEME STYLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STYLES = `
  .pcms-login {
    --bg: oklch(0.12 0.03 268);
    --fg: oklch(0.96 0.01 254);
    --card: oklch(0.165 0.032 268);
    --muted: oklch(0.21 0.025 268);
    --muted-fg: oklch(0.57 0.04 268);
    --border: oklch(1 0 0 / 0.09);
    --primary: oklch(0.46 0.155 270);
    --primary-fg: oklch(0.97 0.01 254);
    --accent: oklch(0.54 0.22 25);
    --destructive: oklch(0.68 0.20 22);
    --ring: oklch(0.46 0.155 270 / 0.38);
    --btn-border: #333333;
    font-family: var(--font-sans, 'Inter', 'DM Sans', system-ui, sans-serif);
  }
  .pcms-login.light {
    --bg: oklch(0.97 0.006 268);
    --fg: oklch(0.18 0.06 270);
    --card: oklch(1 0 0);
    --muted: oklch(0.93 0.012 268);
    --muted-fg: oklch(0.47 0.05 268);
    --border: oklch(0.87 0.015 268);
    --primary: oklch(0.35 0.15 270);
    --primary-fg: oklch(0.98 0.01 254);
    --accent: oklch(0.54 0.22 25);
    --destructive: oklch(0.52 0.22 25);
    --ring: oklch(0.35 0.15 270 / 0.38);
    --btn-border: #E5E7EB;
  }
  .pcms-login *, .pcms-login *::before, .pcms-login *::after { box-sizing: border-box; }
  .pcms-login input { outline: none; background: transparent; border: none; width: 100%; }
  .pcms-login button { font-family: inherit; cursor: pointer; }
  .pcms-login a:focus-visible, .pcms-login button:focus-visible {
    outline: 2px solid var(--ring); outline-offset: 2px; border-radius: 4px;
  }
  .pcms-login .dev-link:hover { background: oklch(0.35 0.15 270 / 0.22) !important; color: oklch(0.88 0.08 270) !important; }
`

// â”€â”€â”€ CONSTANT DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const TRUST_ITEMS = [
	{ label: "FHIR R4 Integrated with Altera Sunrise EMR", icon: "network" },
	{ label: "Data Privacy Act 2012 Compliant", icon: "shield" },
	{ label: "JCI-Accredited Continuity of Care Workflows", icon: "cross" },
	{ label: "Multi-Tenant Isolation Across SLMC Campuses", icon: "lock" },
] as const

// â”€â”€â”€ SVG ICONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const Icon = {
	Sun: () => (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
			<circle cx="7" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.2" />
			{[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
				const r = Math.PI * deg / 180
				const x1 = 7 + Math.cos(r) * 4.2, y1 = 7 + Math.sin(r) * 4.2
				const x2 = 7 + Math.cos(r) * 5.5, y2 = 7 + Math.sin(r) * 5.5
				return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			})}
		</svg>
	),
	Moon: () => (
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
			<path d="M11 9.2C9.9 9.9 8.6 10.3 7.2 10.3 3.8 10.3 1 7.5 1 4.1 1 2.7 1.5 1.4 2.3.5 0 1.4-1.5 3.8-1 6.6-.4 9.5 2.2 11.4 5.1 10.8 7.2 10.4 9.1 9 11 7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" fill="none" />
		</svg>
	),
	User: () => (
		<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
			<circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
			<path d="M2 13.5C2 11 4.5 9 7.5 9S13 11 13 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
		</svg>
	),
	Lock: ({ size = 15 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 15 15" fill="none" aria-hidden>
			<rect x="2.5" y="7" width="10" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
			<path d="M4.5 7V5C4.5 3.07 5.57 2 7.5 2 9.43 2 10.5 3.07 10.5 5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			<circle cx="7.5" cy="10.2" r="1" fill="currentColor" />
		</svg>
	),
	Eye: ({ closed }: { closed: boolean }) => (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
			<path d="M1.5 8C1.5 8 3.5 3.5 8 3.5S14.5 8 14.5 8 12.5 12.5 8 12.5 1.5 8 1.5 8Z" stroke="currentColor" strokeWidth="1.2" />
			<circle cx="8" cy="8" r="1.9" stroke="currentColor" strokeWidth="1.2" />
			<motion.line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"
				animate={{ opacity: closed ? 1 : 0 }} transition={{ duration: 0.18 }} />
		</svg>
	),
	Arrow: () => (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
			<path d="M2.5 7H11.5M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	Shield: ({ size = 14 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
			<path d="M7 1L1.5 3.5V7.5C1.5 10.3 4 12.5 7 13.5 10 12.5 12.5 10.3 12.5 7.5V3.5L7 1Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
			<path d="M4.5 7L6.2 8.8 9.5 5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	Network: ({ size = 14 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
			<circle cx="7" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.1" />
			<circle cx="2" cy="3.5" r="1.3" stroke="currentColor" strokeWidth="1" />
			<circle cx="12" cy="3.5" r="1.3" stroke="currentColor" strokeWidth="1" />
			<circle cx="2" cy="10.5" r="1.3" stroke="currentColor" strokeWidth="1" />
			<circle cx="12" cy="10.5" r="1.3" stroke="currentColor" strokeWidth="1" />
			<line x1="3.3" y1="4.2" x2="5.5" y2="5.8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
			<line x1="10.7" y1="4.2" x2="8.5" y2="5.8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
			<line x1="3.3" y1="9.8" x2="5.5" y2="8.2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
			<line x1="10.7" y1="9.8" x2="8.5" y2="8.2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
		</svg>
	),
	Cross: ({ size = 14 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
			<path d="M7 1.5V12.5M1.5 7H12.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
		</svg>
	),
	MapPin: () => (
		<svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
			<path d="M5.5 1C3.57 1 2 2.57 2 4.5 2 6.8 5.5 10 5.5 10S9 6.8 9 4.5C9 2.57 7.43 1 5.5 1Z" stroke="currentColor" strokeWidth="1" />
			<circle cx="5.5" cy="4.5" r="1.1" stroke="currentColor" strokeWidth="1" />
		</svg>
	),
	Exclamation: () => (
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
			<circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.1" />
			<line x1="6.5" y1="4.2" x2="6.5" y2="7.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			<circle cx="6.5" cy="9" r="0.7" fill="currentColor" />
		</svg>
	),
	AlertTriangle: () => (
		<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
			<path d="M7.5 2L1 13H14L7.5 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
			<line x1="7.5" y1="6.5" x2="7.5" y2="9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			<circle cx="7.5" cy="11" r="0.7" fill="currentColor" />
		</svg>
	),
	Enterprise: () => (
		<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
			<rect x="1.5" y="5" width="12" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
			<path d="M5 5V3C5 2.45 5.45 2 6 2H9C9.55 2 10 2.45 10 3V5" stroke="currentColor" strokeWidth="1.1" />
			<line x1="1.5" y1="9" x2="13.5" y2="9" stroke="currentColor" strokeWidth="1" />
			<rect x="6" y="9" width="3" height="2.5" stroke="currentColor" strokeWidth="1" />
		</svg>
	),
	Fhir: () => (
		<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
			<circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.1" />
			<path d="M1.5 7.5H13.5M7.5 1.5C5.8 3.5 4.8 5.4 4.8 7.5S5.8 11.5 7.5 13.5C9.2 11.5 10.2 9.6 10.2 7.5S9.2 3.5 7.5 1.5Z" stroke="currentColor" strokeWidth="1" />
		</svg>
	),
	Check: ({ drawn }: { drawn: boolean }) => (
		<svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
			<motion.path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="currentColor" strokeWidth="1.4"
				strokeLinecap="round" strokeLinejoin="round"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: drawn ? 1 : 0 }}
				transition={{ duration: 0.22, type: "spring", stiffness: 500, damping: 35 }}
			/>
		</svg>
	),
	Spinner: () => (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
			<motion.circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
				strokeDasharray="14 28"
				animate={{ rotate: 360 }}
				transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
				style={{ transformOrigin: "9px 9px" }}
			/>
			<motion.circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"
				strokeDasharray="7 18" opacity={0.55}
				animate={{ rotate: -360 }}
				transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
				style={{ transformOrigin: "9px 9px" }}
			/>
		</svg>
	),
	SuccessRing: () => (
		<svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
			<motion.circle cx="28" cy="28" r="24"
				stroke="var(--accent)" strokeWidth="2"
				initial={{ pathLength: 0, rotate: -90 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
				style={{ transformOrigin: "28px 28px" }}
			/>
			<motion.path d="M17 28L23.5 35L39 20"
				stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: 0.4, ease: "easeOut", delay: 0.8 }}
			/>
		</svg>
	),
	Mail: ({ size = 15 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 15 15" fill="none" aria-hidden>
			<rect x="1" y="3.5" width="13" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
			<path d="M1.5 4.5L7.5 8L13.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
		</svg>
	),
	Briefcase: ({ size = 15 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 15 15" fill="none" aria-hidden>
			<rect x="2.5" y="5" width="10" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
			<path d="M4.5 5V3C4.5 1.89543 5.39543 1 6.5 1H8.5C9.60457 1 10.5 1.89543 10.5 3V5" stroke="currentColor" strokeWidth="1.2" />
		</svg>
	),
	Hammer: ({ size = 15 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 15 15" fill="none" aria-hidden>
			<path d="M2.5 12.5L7.5 7.5L9.5 9.5L4.5 14.5L2.5 12.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
			<path d="M8.5 6.5L12 3L14 5L10.5 8.5L8.5 6.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
		</svg>
	),
	Box: ({ size = 15 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 15 15" fill="none" aria-hidden>
			<path d="M7.5 1.5L1.5 4.5L7.5 7.5L13.5 4.5L7.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
			<path d="M1.5 4.5V10.5L7.5 13.5V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
			<path d="M13.5 4.5V10.5L7.5 13.5V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
		</svg>
	),
	Clipboard: ({ size = 15 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 15 15" fill="none" aria-hidden>
			<rect x="3" y="3" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
			<path d="M5.5 3V2C5.5 1.44772 5.94772 1 6.5 1H8.5C9.05228 1 9.5 1.44772 9.5 2V3" stroke="currentColor" strokeWidth="1.2" />
			<path d="M5.5 7.5L7 9L9.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	Crown: ({ size = 15 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 15 15" fill="none" aria-hidden>
			<path d="M1.5 12.5H13.5V13.5H1.5V12.5Z" fill="currentColor" />
			<path d="M2.5 11.5L1.5 4.5L5.5 7L7.5 2.5L9.5 7L13.5 4.5L12.5 11.5H2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
		</svg>
	),
	Gear: ({ size = 15 }: { size?: number }) => (
		<svg width={size} height={size} viewBox="0 0 15 15" fill="none" aria-hidden>
			<path d="M7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z" stroke="currentColor" strokeWidth="1.2" />
			<path d="M7.5 2V1M7.5 14V13M2 7.5H1M14 7.5H13M3.5 3.5L2.5 2.5M11.5 11.5L12.5 12.5M11.5 3.5L12.5 2.5M3.5 11.5L2.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	),
} as const

type IconType = typeof TRUST_ITEMS[number]["icon"]
function TrustIcon({ name, size = 14 }: { name: IconType; size?: number }) {
	if (name === "network") return <Icon.Network size={size} />
	if (name === "shield") return <Icon.Shield size={size} />
	if (name === "cross") return <Icon.Cross size={size} />
	return <Icon.Lock size={size} />
}

// â”€â”€â”€ ANIMATED BACKGROUND â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function AnimatedGrid() {
	return (
		<svg width="100%" height="100%" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice"
			style={{ position: "absolute", inset: 0, opacity: 0.055, pointerEvents: "none" }}>
			<defs>
				<pattern id="pg" x="0" y="0" width="52" height="52" patternUnits="userSpaceOnUse">
					<path d="M52 0L0 0 0 52" fill="none" stroke="oklch(0.7 0.12 270)" strokeWidth="0.4" />
				</pattern>
			</defs>
			<motion.rect width="100%" height="120%" fill="url(#pg)"
				animate={{ y: ["0%", "8.66%", "0%"] }}
				transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
			/>
		</svg>
	)
}

function FhirNodes() {
	const nodes = [
		{ x: 75, y: 175, label: "EMR" },
		{ x: 270, y: 115, label: "FHIR" },
		{ x: 455, y: 195, label: "PCMS" },
		{ x: 150, y: 355, label: "LAB" },
		{ x: 370, y: 335, label: "IMG" },
		{ x: 510, y: 475, label: "ADT" },
		{ x: 95, y: 510, label: "PHR" },
		{ x: 295, y: 490, label: "CDS" },
	]
	const edges = [[0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [4, 5], [3, 6], [6, 7], [7, 4]]
	return (
		<svg width="100%" height="100%" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice"
			style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
			{edges.map(([a, b], i) => (
				<motion.line key={i}
					x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
					stroke="oklch(0.5 0.14 270)" strokeWidth="0.7" strokeDasharray="4 7" opacity={0.2}
					animate={{ strokeDashoffset: [0, -22] }}
					transition={{ duration: 3.5 + i * 0.35, repeat: Infinity, ease: "linear" }}
				/>
			))}
			{nodes.map((n, i) => (
				<g key={i}>
					<motion.circle cx={n.x} cy={n.y} r="5.5"
						fill="none" stroke="oklch(0.5 0.14 270)" strokeWidth="0.9" opacity={0.28}
						animate={{ r: [5.5, 7.5, 5.5], opacity: [0.28, 0.5, 0.28] }}
						transition={{ duration: 2.8 + i * 0.25, repeat: Infinity, delay: i * 0.18 }}
					/>
					<circle cx={n.x} cy={n.y} r="2.8" fill="oklch(0.5 0.14 270)" opacity={0.38} />
					<text x={n.x} y={n.y + 15} textAnchor="middle" fontSize="6.5"
						fill="oklch(0.6 0.1 270)" opacity={0.28} fontFamily="monospace">
						{n.label}
					</text>
				</g>
			))}
		</svg>
	)
}

// â”€â”€â”€ TRUST CAROUSEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TrustCarousel() {
	const [idx, setIdx] = useState(0)
	useEffect(() => {
		const t = setInterval(() => setIdx(i => (i + 1) % TRUST_ITEMS.length), 5000)
		return () => clearInterval(t)
	}, [])
	const item = TRUST_ITEMS[idx]
	return (
		<div style={{ height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<AnimatePresence mode="wait">
				<motion.div key={idx}
					initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }}
					transition={{ duration: 0.45 }}
					style={{
						display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 500,
						color: "oklch(0.60 0.04 268)"
					}}>
					<span style={{ color: "oklch(0.48 0.12 270)", flexShrink: 0 }}>
						<TrustIcon name={item.icon} />
					</span>
					{item.label}
				</motion.div>
			</AnimatePresence>
		</div>
	)
}

// â”€â”€â”€ THEME TOGGLE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ThemeToggle({ isLight, onToggle }: { isLight: boolean; onToggle: () => void }) {
	return (
		<motion.button onClick={onToggle} aria-label="Toggle theme"
			whileTap={{ scale: 0.94 }}
			style={{
				display: "flex", alignItems: "center", gap: "5px",
				padding: "4px 8px 4px 7px", borderRadius: "100px",
				background: isLight ? "oklch(0.90 0.012 268)" : "oklch(0.20 0.025 268)",
				border: "1px solid var(--border)", cursor: "pointer",
			}}>
			<motion.span animate={{ color: isLight ? "oklch(0.58 0.18 85)" : "oklch(0.55 0.04 268)" }}
				style={{ display: "flex", alignItems: "center" }}>
				<Icon.Sun />
			</motion.span>
			<div style={{
				position: "relative", width: "30px", height: "16px",
				background: isLight ? "oklch(0.85 0.015 268)" : "oklch(0.16 0.025 268)",
				borderRadius: "100px", border: "1px solid var(--border)", flexShrink: 0
			}}>
				<motion.div
					animate={{ x: isLight ? 14 : 1 }}
					transition={{ type: "spring", stiffness: 500, damping: 38 }}
					style={{
						position: "absolute", top: "1px", width: "12px", height: "12px",
						borderRadius: "50%", background: "var(--primary)"
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

// â”€â”€â”€ SEGMENTED CONTROL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SegmentedControl<T extends string>({
	options, value, onChange, layoutId,
}: {
	options: { label: string; value: T }[]
	value: T
	onChange: (v: T) => void
	layoutId: string
}) {
	return (
		<div style={{ display: "flex", background: "var(--muted)", borderRadius: "7px", padding: "3px", gap: "2px" }}>
			{options.map(opt => (
				<button key={opt.value} type="button" onClick={() => onChange(opt.value)}
					style={{
						position: "relative", flex: 1, padding: "6px 8px",
						fontSize: "11.5px", fontWeight: 600,
						color: value === opt.value ? "var(--primary-fg)" : "var(--muted-fg)",
						background: "transparent", border: "none", borderRadius: "5px",
						cursor: "pointer", zIndex: 1, whiteSpace: "nowrap",
					}}>
					{value === opt.value && (
						<motion.div layoutId={layoutId}
							style={{ position: "absolute", inset: 0, background: "var(--primary)", borderRadius: "5px", zIndex: -1 }}
							transition={{ type: "spring", stiffness: 480, damping: 38 }}
						/>
					)}
					{opt.label}
				</button>
			))}
		</div>
	)
}

// â”€â”€â”€ FLOATING LABEL INPUT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FloatingInput({
	id, label, type, value, onChange, onBlur, icon, right, error,
}: {
	id: string; label: string; type: string; value: string
	onChange: (v: string) => void; onBlur?: () => void
	icon: React.ReactNode; right?: React.ReactNode; error?: string
}) {
	const [focused, setFocused] = useState(false)
	const floated = focused || value.length > 0

	return (
		<div>
			<div style={{
				display: "flex", alignItems: "center",
				border: `1px solid ${error ? "var(--destructive)" : focused ? "var(--primary)" : "var(--border)"}`,
				borderRadius: "8px", background: "var(--bg)", overflow: "hidden",
				boxShadow: focused && !error ? "0 0 0 3px var(--ring)" : "none",
				transition: "border-color 0.15s, box-shadow 0.15s",
			}}>
				<span style={{
					paddingLeft: "12px", flexShrink: 0, display: "flex", alignItems: "center",
					color: focused ? "var(--primary)" : "var(--muted-fg)",
					transition: "color 0.15s",
				}}>{icon}</span>
				<div style={{ position: "relative", flex: 1, height: "50px" }}>
					<motion.label htmlFor={id}
						animate={{
							y: floated ? -9 : 0,
							scale: floated ? 0.78 : 1,
							color: focused ? "var(--primary)" : error ? "var(--destructive)" : "var(--muted-fg)",
						}}
						transition={{ type: "spring", stiffness: 380, damping: 28 }}
						style={{
							position: "absolute", left: "12px", top: floated ? "8px" : "50%",
							transform: "translateY(-50%)", transformOrigin: "left",
							fontSize: "13px", fontWeight: 500, pointerEvents: "none", lineHeight: 1,
						}}>
						{label}
					</motion.label>
					<input id={id} type={type} value={value}
						onChange={e => onChange(e.target.value)}
						onFocus={() => setFocused(true)}
						onBlur={() => { setFocused(false); onBlur?.() }}
						style={{
							position: "absolute", inset: 0, paddingLeft: "12px",
							paddingTop: floated ? "20px" : "0",
							fontSize: "13.5px", color: "var(--fg)", fontWeight: 450,
						}}
						autoComplete={type === "password" ? "current-password" : "email"}
					/>
				</div>
				{right && <span style={{ paddingRight: "8px", flexShrink: 0 }}>{right}</span>}
			</div>
			<AnimatePresence>
				{error && (
					<motion.div initial={{ opacity: 0, height: 0, y: -4 }} animate={{ opacity: 1, height: "auto", y: 0 }}
						exit={{ opacity: 0, height: 0, y: -4 }} transition={{ duration: 0.18 }}
						style={{
							display: "flex", alignItems: "center", gap: "5px",
							color: "var(--destructive)", fontSize: "11.5px", marginTop: "5px", paddingLeft: "2px"
						}}>
						<Icon.Exclamation />
						{error}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

// â”€â”€â”€ DEV ACCESS BADGE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const DEV_ROLES: { role: Role; label: string; email: string; color: string; icon: React.ReactNode }[] = [
	{ role: "system_admin", label: "System Admin", email: "system@hpcms.local", color: "oklch(0.65 0.14 270)", icon: <Icon.Gear size={18} /> },
	{ role: "tenant_admin", label: "Tenant Admin", email: "admin@hpcms.local", color: "oklch(0.72 0.16 290)", icon: <Icon.Crown size={18} /> },
	{ role: "case_supervisor", label: "Supervisor", email: "supervisor@hpcms.local", color: "oklch(0.78 0.17 75)", icon: <Icon.Clipboard size={18} /> },
	{ role: "case_agent", label: "Case Agent", email: "agent@hpcms.local", color: "oklch(0.70 0.14 200)", icon: <Icon.Briefcase size={18} /> },
	{ role: "clinician", label: "Clinician", email: "clinician@hpcms.local", color: "oklch(0.68 0.18 145)", icon: <Icon.Cross size={18} /> },
	{ role: "patient", label: "Patient", email: "patient@hpcms.local", color: "oklch(0.68 0.20 25)", icon: <Icon.User /> },
]

const DEV_PASSWORD = "DevPass123!"

// â”€â”€â”€ LEFT BRANDING PANEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function BrandingPanel() {
	return (
		<div style={{
			position: "relative", minHeight: "100vh",
			display: "flex", flexDirection: "column",
			alignItems: "center", justifyContent: "center",
			overflow: "hidden", padding: "48px 36px",
			background: "linear-gradient(158deg, oklch(0.145 0.045 272) 0%, oklch(0.10 0.032 260) 100%)",
		}}>
			{/* Radial ambient pulse */}
			<motion.div
				animate={{ scale: [1, 1.1, 1], opacity: [0.07, 0.14, 0.07] }}
				transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
				style={{
					position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)",
					width: "400px", height: "400px", borderRadius: "50%",
					background: "radial-gradient(circle, oklch(0.46 0.155 270) 0%, transparent 65%)",
					pointerEvents: "none",
				}}
			/>
			<AnimatedGrid />
			<FhirNodes />

			{/* Main content */}
			<motion.div
				initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, delay: 0.2 }}
				style={{
					position: "relative", zIndex: 2,
					display: "flex", flexDirection: "column", alignItems: "center",
					gap: "22px", textAlign: "center", maxWidth: "370px",
				}}>

				{/* Logomark */}
				<motion.div
					initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
					transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.55 }}
					style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
					<div className="relative size-20">
						<Image src="/logo/stlukes.png" alt="St. Luke's Logo" fill className="object-contain" />
					</div>
					<div>
						<div style={{
							fontSize: "30px", fontWeight: 800, letterSpacing: "-0.035em",
							color: "oklch(0.96 0.01 254)",
							fontFamily: "'Plus Jakarta Sans','Outfit','General Sans',system-ui"
						}}>
							PCMS
						</div>
						<div style={{
							fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em",
							textTransform: "uppercase", marginTop: "3px",
							color: "oklch(0.52 0.10 270)"
						}}>
							Patient Case Management System
						</div>
					</div>
				</motion.div>

				{/* Institution line */}
				<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.0, duration: 0.6 }}
					style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 500 }}>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path d="M8 2V14M2 8H14" stroke="oklch(0.54 0.22 25)" strokeWidth="2.5" strokeLinecap="round" />
					</svg>
					<span style={{ color: "oklch(0.72 0.04 260)" }}>St. Luke's Medical Center</span>
				</motion.div>

				{/* Divider */}
				<motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.15, duration: 0.55 }}
					style={{ width: "100%", height: "1px", background: "oklch(1 0 0 / 0.09)" }} />

				{/* Trust carousel */}
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
					style={{ width: "100%" }}>
					<TrustCarousel />
				</motion.div>

				<div style={{ width: "100%", height: "1px", background: "oklch(1 0 0 / 0.09)" }} />

				{/* Campus indicator */}
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
					style={{
						display: "flex", alignItems: "center", gap: "5px",
						color: "oklch(0.44 0.04 265)", fontSize: "11.5px"
					}}>
					<Icon.MapPin />
					Quezon City Â· Bonifacio Global City
				</motion.div>
			</motion.div>

			{/* Bottom bar: version + dev badge */}
			<div style={{
				position: "absolute", bottom: "20px", left: "24px", right: "24px",
				display: "flex", alignItems: "center", justifyContent: "space-between",
			}}>
				<span style={{ fontSize: "9.5px", color: "oklch(0.38 0.03 264)", letterSpacing: "0.08em" }}>
					PCMS v2.0 Â· Enterprise
				</span>
				{process.env.NODE_ENV === "development" && (
					<span style={{ fontSize: "9.5px", color: "oklch(0.38 0.03 264)", letterSpacing: "0.08em" }}>Build 2.0.0</span>
				)}
			</div>
		</div>
	)
}

// â”€â”€â”€ ENTERPRISE LOGIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type Role = "system_admin" | "tenant_admin" | "case_supervisor" | "case_agent" | "clinician" | "patient"
type Campus = "qc" | "bgc"
type Status = "idle" | "loading" | "success" | "error"

export function EnterpriseLogin() {
	const [isLight, setIsLight] = useState(false)
	const [role, setRole] = useState<Role>("case_agent")
	const [campus, setCampus] = useState<Campus>("qc")
	const [showPass, setShowPass] = useState(false)
	const [rememberDev, setRememberDev] = useState(false)
	const [status, setStatus] = useState<Status>("idle")
	const [errorMsg, setErrorMsg] = useState("")
	const [shakeKey, setShakeKey] = useState(0)

	const { mutateAsync: login } = useLoginMutation()

	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: { onSubmit: LoginSchema },
		onSubmit: async ({ value }) => {
			setStatus("loading")
			setErrorMsg("")
			try {
				await login(value)
				setStatus("success")
			} catch (e: unknown) {
				setStatus("error")
				setErrorMsg(e instanceof Error && e.message ? e.message : "Invalid credentials. Please try again.")
				setShakeKey(k => k + 1)
				setTimeout(() => setStatus("idle"), 120)
			}
		},
	})

	const roleOpts: { label: string; value: Role }[] = [
		{ label: "Sys Admin", value: "system_admin" },
		{ label: "Tenant Admin", value: "tenant_admin" },
		{ label: "Supervisor", value: "case_supervisor" },
		{ label: "Case Agent", value: "case_agent" },
		{ label: "Clinician", value: "clinician" },
		{ label: "Patient", value: "patient" },
	]
	const campusOpts: { label: string; value: Campus }[] = [
		{ label: "Quezon City", value: "qc" },
		{ label: "Global City", value: "bgc" },
	]

	const formVariants = {
		hidden: {},
		visible: { transition: { staggerChildren: 0.07 } },
	}
	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 20 } },
	}

	return (
		<>
			<style>{STYLES}</style>
			<div className={`pcms-login${isLight ? " light" : ""}`}
				style={{ minHeight: "100vh", display: "flex", background: "var(--bg)", color: "var(--fg)" }}>

				{/* â”€â”€ Left Panel â”€â”€ */}
				<div className="hidden lg:block" style={{ flex: "0 0 55%" }}>
					<BrandingPanel />
				</div>

				{/* â”€â”€ Right Panel â”€â”€ */}
				<div style={{
					flex: 1, display: "flex", flexDirection: "column",
					background: "var(--bg)", borderLeft: "1px solid var(--border)",
					position: "relative",
					overflowY: "auto"
				}}>

					{/* Top bar */}
					<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px 0" }}>
						{/* Left: mobile logo + back link */}
						<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
							<div className="flex lg:hidden" style={{ alignItems: "center", gap: "8px" }}>
								<div className="relative size-7">
									<Image src="/logo/stlukes.png" alt="St. Luke's Logo" fill className="object-contain" />
								</div>
								<span style={{
									fontSize: "14px", fontWeight: 800, letterSpacing: "-0.02em",
									fontFamily: "'Plus Jakarta Sans','Outfit',system-ui"
								}}>PCMS</span>
							</div>
							<Link href="/" style={{
								display: "flex", alignItems: "center", gap: "5px",
								fontSize: "13px", fontWeight: 600,
								color: "var(--muted-fg)", textDecoration: "none",
								transition: "color 0.15s",
							}}
								onMouseEnter={e => (e.currentTarget.style.color = "var(--fg)")}
								onMouseLeave={e => (e.currentTarget.style.color = "var(--muted-fg)")}
							>
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
									<path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								Home
							</Link>
						</div>
						<ThemeToggle isLight={isLight} onToggle={() => setIsLight(v => !v)} />
					</div>

					{/* Form area */}
					<div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>

						{status === "success" ? (
							/* â”€â”€ Success â”€â”€ */
							<motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
								style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
								<Icon.SuccessRing />
								<motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1.2 }}
									style={{
										margin: 0, fontSize: "18px", fontWeight: 700,
										fontFamily: "'Plus Jakarta Sans','Outfit',system-ui"
									}}>
									Authenticated
								</motion.p>
								<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.55 }}
									style={{ margin: 0, fontSize: "13px", color: "var(--muted-fg)" }}>
									Redirecting to your dashboard
								</motion.p>
							</motion.div>
						) : (
							/* ── Form ── */
							<motion.div key={shakeKey}
								animate={status === "error" ? { x: [0, -8, 8, -4, 4, 0] } : { x: 0 }}
								transition={{ duration: 0.4 }}
								style={{ width: "100%", maxWidth: "460px" }}>

								<motion.div variants={formVariants} initial="hidden" animate="visible"
									style={{ display: "flex", flexDirection: "column", gap: "26px" }}>

									{/* Header */}
									<motion.div variants={itemVariants}>
										<h1 style={{
											margin: 0, fontSize: "32px", fontWeight: 800, letterSpacing: "-0.04em",
											fontFamily: "'Plus Jakarta Sans','Outfit','General Sans',system-ui", color: "var(--fg)"
										}}>
											Sign In
										</h1>
										<p style={{ margin: "10px 0 0", fontSize: "15px", color: "var(--muted-fg)", fontWeight: 400, lineHeight: 1.4 }}>
											Access the Patient Case Management System
										</p>
									</motion.div>

									{/* Error banner */}
									<AnimatePresence>
										{errorMsg && (
											<motion.div
												initial={{ opacity: 0, y: -14, height: 0 }}
												animate={{ opacity: 1, y: 0, height: "auto" }}
												exit={{ opacity: 0, y: -14, height: 0 }}
												transition={{ duration: 0.24 }}
												style={{
													display: "flex", alignItems: "center", gap: "8px", overflow: "hidden",
													padding: "12px 16px", borderRadius: "8px", fontSize: "13.5px",
													background: "color-mix(in oklch, var(--destructive) 11%, transparent)",
													border: "1px solid color-mix(in oklch, var(--destructive) 28%, transparent)",
													color: "var(--destructive)",
												}}>
												<Icon.AlertTriangle />
												{errorMsg}
											</motion.div>
										)}
									</AnimatePresence>

									<motion.div variants={itemVariants} style={{
										background: "var(--card)",
										border: "1px solid color-mix(in oklch, var(--border) 40%, transparent)",
										borderRadius: "16px", padding: "32px", paddingBottom: "24px",
									}}>
										{/* Fields */}
										<form onSubmit={e => { e.preventDefault(); void form.handleSubmit() }}
											style={{ display: "flex", flexDirection: "column" }}>

											<form.Field name="email">
												{field => (
													<div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
														<label htmlFor="email" style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--fg)" }}>
															Email or Employee ID
														</label>
														<div style={{ position: "relative" }}>
															<span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--muted-fg)" }}>
																<Icon.Mail size={16} />
															</span>
															<input id="email" type="email" placeholder="name@company.com"
																value={field.state.value} onChange={e => field.handleChange(e.target.value)}
																style={{
																	width: "100%", padding: "13px 16px 13px 44px", borderRadius: "8px",
																	border: "1px solid color-mix(in oklch, var(--border) 35%, transparent)",
																	background: "color-mix(in oklch, var(--bg) 60%, transparent)",
																	color: "var(--fg)", fontSize: "14.5px", outline: "none",
																	transition: "border-color 0.2s"
																}}
																onFocus={e => e.target.style.borderColor = "var(--primary)"}
																onBlur={e => {
																	e.target.style.borderColor = "color-mix(in oklch, var(--border) 35%, transparent)"
																	field.handleBlur()
																}}
															/>
														</div>
														{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
															<span style={{ color: "var(--destructive)", fontSize: "12px" }}>{String(field.state.meta.errors[0])}</span>
														)}
													</div>
												)}
											</form.Field>

											<form.Field name="password">
												{field => (
													<div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
														<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
															<label htmlFor="password" style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--fg)" }}>
																Password
															</label>
															<Link href="/password-reset" style={{ fontSize: "13.5px", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
																Forgot Password?
															</Link>
														</div>
														<div style={{ position: "relative" }}>
															<span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--muted-fg)" }}>
																<Icon.Lock size={16} />
															</span>
															<input id="password" type={showPass ? "text" : "password"} placeholder="••••••••"
																value={field.state.value} onChange={e => field.handleChange(e.target.value)}
																style={{
																	width: "100%", padding: "13px 44px", borderRadius: "8px",
																	border: "1px solid color-mix(in oklch, var(--border) 35%, transparent)",
																	background: "color-mix(in oklch, var(--bg) 60%, transparent)",
																	color: "var(--fg)", fontSize: "15px", outline: "none",
																	transition: "border-color 0.2s", letterSpacing: "2px"
																}}
																onFocus={e => e.target.style.borderColor = "var(--primary)"}
																onBlur={e => {
																	e.target.style.borderColor = "color-mix(in oklch, var(--border) 35%, transparent)"
																	field.handleBlur()
																}}
															/>
															<button type="button" onClick={() => setShowPass(v => !v)}
																aria-label={showPass ? "Hide password" : "Show password"}
																style={{
																	position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
																	background: "none", border: "none", color: "var(--muted-fg)", cursor: "pointer", padding: 0
																}}>
																<Icon.Eye closed={!showPass} />
															</button>
														</div>
														{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
															<span style={{ color: "var(--destructive)", fontSize: "12px" }}>{String(field.state.meta.errors[0])}</span>
														)}
													</div>
												)}
											</form.Field>

											{/* Remember Device */}
											<motion.div variants={itemVariants} style={{ display: "flex", alignItems: "center", marginBottom: "28px" }}>
												<button type="button" onClick={() => setRememberDev(v => !v)}
													style={{
														display: "flex", alignItems: "center", gap: "8px",
														background: "none", border: "none", cursor: "pointer", padding: 0,
														color: "var(--muted-fg)", fontSize: "13.5px", fontWeight: 600
													}}>
													<div style={{
														width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0,
														border: `1.5px solid ${rememberDev ? "var(--primary)" : "color-mix(in oklch, var(--border) 50%, transparent)"}`,
														background: rememberDev ? "var(--primary)" : "transparent",
														display: "flex", alignItems: "center", justifyContent: "center",
														transition: "background 0.15s, border-color 0.15s",
													}}>
														<span style={{ color: "var(--primary-fg)" }}>
															<Icon.Check drawn={rememberDev} />
														</span>
													</div>
													Remember this device
												</button>
											</motion.div>

											{/* Submit */}
											<motion.button type="submit" disabled={status === "loading"}
												whileHover={status !== "loading" ? { scale: 1.01, y: -1 } : {}}
												whileTap={status !== "loading" ? { scale: 0.98 } : {}}
												style={{
													width: "100%", height: "48px",
													display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
													background: "var(--primary)", color: "var(--primary-fg)",
													border: "none", borderRadius: "8px",
													fontSize: "15px", fontWeight: 700,
													cursor: status === "loading" ? "not-allowed" : "pointer",
													opacity: status === "loading" ? 0.72 : 1,
												}}>
												{status === "loading" ? <Icon.Spinner /> : "Sign In"}
											</motion.button>
										</form>

										{/* Divider */}
										<div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "28px 0" }}>
											<div style={{ flex: 1, height: "1px", background: "color-mix(in oklch, var(--border) 30%, transparent)" }} />
											<span style={{ fontSize: "11px", color: "var(--muted-fg)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
												OR
											</span>
											<div style={{ flex: 1, height: "1px", background: "color-mix(in oklch, var(--border) 30%, transparent)" }} />
										</div>

										{/* SSO Buttons */}
										<motion.div variants={itemVariants} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
											<motion.button type="button"
												whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }}
												style={{
													width: "100%", height: "48px",
													display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
													background: "transparent", color: "var(--fg)",
													border: "1px solid color-mix(in oklch, var(--border) 50%, transparent)", borderRadius: "8px",
													fontSize: "14.5px", fontWeight: 700, cursor: "pointer",
												}}>
												<Icon.Enterprise />
												Sign in with SLMC SSO
											</motion.button>
											<div>
												<motion.button type="button"
													whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }}
													style={{
														width: "100%", height: "48px",
														display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
														background: "transparent", color: "var(--muted-fg)",
														border: "1px solid color-mix(in oklch, var(--border) 50%, transparent)", borderRadius: "8px",
														fontSize: "14.5px", fontWeight: 700, cursor: "pointer",
													}}>
													<Icon.Fhir />
													Launch from EMR
												</motion.button>
												<p style={{
													margin: "6px 0 0", textAlign: "center", fontSize: "11px",
													color: "var(--muted-fg)", opacity: 0.65
												}}>
													Available when launched from Altera Sunrise workflows
												</p>
											</div>
										</motion.div>

										<div style={{
											borderBottom: "1px dashed color-mix(in oklch, var(--border) 50%, transparent)",
											margin: "32px 0 24px"
										}} />

										<div style={{ textAlign: "center", fontSize: "11px", color: "var(--muted-fg)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "16px" }}>
											DEV QUICK ACCESS
										</div>

										<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
											{DEV_ROLES.map(r => (
												<motion.button type="button" key={r.role}
													whileHover={{ y: -2, background: "color-mix(in oklch, var(--bg) 90%, transparent)" }}
													whileTap={{ scale: 0.96 }}
													onClick={() => {
														form.setFieldValue("email", r.email)
														form.setFieldValue("password", DEV_PASSWORD)
														setRole(r.role)
													}}
													style={{
														display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px",
														padding: "16px 10px", borderRadius: "10px",
														border: "1px solid color-mix(in oklch, var(--border) 25%, transparent)",
														background: "color-mix(in oklch, var(--bg) 40%, transparent)",
														cursor: "pointer", outline: "none", transition: "border-color 0.2s"
													}}
													onFocus={e => e.currentTarget.style.borderColor = r.color}
													onBlur={e => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--border) 25%, transparent)"}
												>
													<span style={{ color: r.color }}>{r.icon}</span>
													<span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--fg)", opacity: 0.9, textAlign: "center", lineHeight: 1.1 }}>{r.label}</span>
												</motion.button>
											))}
										</div>

										{/* Footer */}
										<motion.div variants={itemVariants}
											style={{
												display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
												paddingTop: "24px", marginTop: "16px"
											}}>
											<span style={{
												display: "flex", alignItems: "center", gap: "5px",
												fontSize: "11px", color: "var(--muted-fg)", fontWeight: 500
											}}>
												<Icon.Lock size={11} />
												Protected by AES-256 encryption
											</span>
											<a href="mailto:pcms-admin@stlukes.com.ph"
												style={{ fontSize: "11px", color: "var(--muted-fg)", textDecoration: "none", opacity: 0.8, fontWeight: 500 }}>
												Need access? Contact your system administrator
											</a>
										</motion.div>

									</motion.div>

								</motion.div>
							</motion.div>
						)}

					</div>
				</div>
			</div>
		</>
	)
}
