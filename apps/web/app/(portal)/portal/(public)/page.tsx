"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

function IconArrowRight() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
			<path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

function IconFileText() {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

function IconActivity() {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
			<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

function IconMessageSquare() {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		},
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function PortalLandingPage() {
	return (
		<div className="flex flex-col items-center gap-16 py-8 sm:py-16">
			{/* Hero Section */}
			<motion.section 
				className="flex flex-col items-center text-center gap-6 max-w-3xl"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<motion.div variants={itemVariants} className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
					<span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
					Patient Care Made Simple
				</motion.div>
				
				<motion.h1 
					variants={itemVariants}
					className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
				>
					Welcome to the <br />
					<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
						SLMC Patient Portal
					</span>
				</motion.h1>
				
				<motion.p 
					variants={itemVariants}
					className="text-muted-foreground max-w-2xl text-lg sm:text-xl"
				>
					Manage your healthcare journey in one place. Submit Letter of Authorization requests, track your cases, and message your care team seamlessly.
				</motion.p>
				
				<motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 mt-4">
					<Link
						href={PORTAL_ROUTES.loaNew}
						className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center rounded-full px-8 py-3.5 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95"
					>
						Submit an LOA
						<span className="ml-2"><IconArrowRight /></span>
					</Link>
					<Link
						href={PORTAL_ROUTES.kb}
						className="border-border bg-background text-foreground hover:bg-muted flex items-center justify-center rounded-full border px-8 py-3.5 text-base font-medium shadow-sm transition-all hover:scale-105 active:scale-95"
					>
						Browse Knowledge Base
					</Link>
				</motion.div>
			</motion.section>

			{/* Features Grid */}
			<motion.section 
				className="grid w-full max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<motion.div variants={itemVariants} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
					<div className="relative z-10 flex flex-col gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
							<IconFileText />
						</div>
						<h3 className="text-xl font-bold tracking-tight text-foreground">Submit an LOA</h3>
						<p className="text-muted-foreground leading-relaxed text-sm">
							Upload your admitting order, HMO card, and IDs securely. We'll coordinate directly with your care team and HMO, keeping you updated at every step.
						</p>
					</div>
				</motion.div>

				<motion.div variants={itemVariants} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
					<div className="relative z-10 flex flex-col gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
							<IconActivity />
						</div>
						<h3 className="text-xl font-bold tracking-tight text-foreground">Track Your Requests</h3>
						<p className="text-muted-foreground leading-relaxed text-sm">
							Get real-time status updates, view the complete history of team responses, and reply with one click. No more chasing email threads.
						</p>
					</div>
				</motion.div>

				<motion.div variants={itemVariants} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/50 sm:col-span-2 lg:col-span-1">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
					<div className="relative z-10 flex flex-col gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
							<IconMessageSquare />
						</div>
						<h3 className="text-xl font-bold tracking-tight text-foreground">Ask the Assistant</h3>
						<p className="text-muted-foreground leading-relaxed text-sm">
							Our intelligent portal chatbot can instantly answer common questions and seamlessly route you to a live care agent when you need human support.
						</p>
					</div>
				</motion.div>
			</motion.section>
		</div>
	)
}
