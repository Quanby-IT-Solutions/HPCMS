"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { useMyRequestsQuery } from "@/features/portal-my-requests/api/cases.hooks"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

// --- INLINE SVGS ---

function DocUploadIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
			<polyline points="14 2 14 8 20 8" />
			<path d="M12 12v6" />
			<path d="m9 15 3-3 3 3" />
		</svg>
	)
}

function InboxSearchIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
			<path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
			<circle cx="15" cy="5" r="3" />
			<path d="m17 7 2 2" />
		</svg>
	)
}

function BookSearchIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
			<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
			<circle cx="16" cy="8" r="2" />
			<path d="m17.5 9.5 1.5 1.5" />
		</svg>
	)
}

function HeadsetIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
			<path d="M21 16v2a4 4 0 0 1-4 4h-5" />
		</svg>
	)
}

function ArrowRightIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M5 12h14" />
			<path d="m12 5 7 7-7 7" />
		</svg>
	)
}

function EmptyStateIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<path d="M14 2v6h6" />
			<path d="m9 15 2 2 4-4" />
		</svg>
	)
}

// --- ANIMATION VARIANTS ---

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		},
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 15 },
	show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 30 } },
}

export function DashboardPage() {
	const router = useRouter()
	const requestsQ = useMyRequestsQuery(1, 5)
	const cases = requestsQ.data?.items ?? []

	// Derive mocked timeline from cases or use static data for design demo
	const recentTimeline = [
		{ id: 1, type: "email", text: "Your LOA request #4521 was approved", time: "2 hours ago", color: "bg-chart-1" },
		{ id: 2, type: "chat", text: "Support replied to your inquiry", time: "Yesterday", color: "bg-chart-3" },
		{ id: 3, type: "portal", text: "You submitted a new billing question", time: "3 days ago", color: "bg-chart-4" },
	]

	const kbArticles = [
		{ id: 1, category: "LOA", title: "How to track your HMO approval", excerpt: "Learn the steps to monitor your Letter of Authorization status in real-time." },
		{ id: 2, category: "Billing", title: "Understanding your final hospital bill", excerpt: "A simple guide to reading the line items on your discharge statement." },
	]

	const getStatusColor = (status: string) => {
		const s = status.toLowerCase()
		if (s.includes("open")) return "bg-primary/10 text-primary"
		if (s.includes("progress")) return "bg-chart-4/10 text-chart-4" // Amber/Yellow equivalent
		if (s.includes("pending") || s.includes("action")) return "bg-accent/10 text-accent border border-accent/20"
		if (s.includes("resolv") || s.includes("clos")) return "bg-chart-2/10 text-chart-2" // Green/Teal equivalent
		return "bg-muted text-muted-foreground"
	}

	return (
		<motion.div 
			variants={containerVariants} 
			initial="hidden" 
			animate="show" 
			className="flex flex-col gap-10 pb-8"
		>
			{/* 1. Welcome Section */}
			<motion.section variants={itemVariants}>
				<h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
					Welcome back, Patient
				</h1>
				<p className="text-muted-foreground mt-2 text-lg">
					Manage your cases, requests, and health services
				</p>
			</motion.section>

			{/* 2. Quick Actions Row */}
			<motion.section variants={containerVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<motion.div variants={itemVariants} whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }} whileTap={{ scale: 0.98 }} className="bg-card border-border hover:border-primary/50 group relative cursor-pointer overflow-hidden rounded-2xl border p-5 transition-colors" onClick={() => router.push(PORTAL_ROUTES.loaNew)}>
					<div className="bg-primary/10 text-primary mb-4 inline-flex rounded-xl p-3">
						<DocUploadIcon className="size-8" />
					</div>
					<h3 className="text-foreground mb-1 text-base font-bold">Submit LOA Request</h3>
					<p className="text-muted-foreground text-sm">Submit a Letter of Authorization for your HMO</p>
				</motion.div>

				<motion.div variants={itemVariants} whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }} whileTap={{ scale: 0.98 }} className="bg-card border-border hover:border-chart-3/50 group relative cursor-pointer overflow-hidden rounded-2xl border p-5 transition-colors" onClick={() => router.push(PORTAL_ROUTES.requests)}>
					<div className="bg-chart-3/10 text-chart-3 mb-4 inline-flex rounded-xl p-3">
						<InboxSearchIcon className="size-8" />
					</div>
					<h3 className="text-foreground mb-1 text-base font-bold">Track My Cases</h3>
					<p className="text-muted-foreground text-sm">View status updates on your open requests</p>
				</motion.div>

				<motion.div variants={itemVariants} whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }} whileTap={{ scale: 0.98 }} className="bg-card border-border hover:border-chart-5/50 group relative cursor-pointer overflow-hidden rounded-2xl border p-5 transition-colors" onClick={() => router.push(PORTAL_ROUTES.kb)}>
					<div className="bg-chart-5/10 text-chart-5 mb-4 inline-flex rounded-xl p-3">
						<BookSearchIcon className="size-8" />
					</div>
					<h3 className="text-foreground mb-1 text-base font-bold">Knowledge Base</h3>
					<p className="text-muted-foreground text-sm">Find answers to common medical and service questions</p>
				</motion.div>

				<motion.div variants={itemVariants} whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }} whileTap={{ scale: 0.98 }} className="bg-card border-border hover:border-chart-2/50 group relative cursor-pointer overflow-hidden rounded-2xl border p-5 transition-colors" onClick={() => router.push(PORTAL_ROUTES.chat)}>
					<div className="bg-chart-2/10 text-chart-2 mb-4 inline-flex rounded-xl p-3">
						<HeadsetIcon className="size-8" />
					</div>
					<h3 className="text-foreground mb-1 text-base font-bold">Contact Support</h3>
					<p className="text-muted-foreground text-sm">Reach our patient support team</p>
				</motion.div>
			</motion.section>

			{/* Middle Content Grid */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				{/* 3. Active Cases Summary */}
				<motion.section variants={itemVariants} className="flex flex-col gap-4 lg:col-span-2">
					<div className="flex items-center justify-between">
						<h2 className="text-foreground text-xl font-bold">Your Active Cases</h2>
						<Link href={PORTAL_ROUTES.requests} className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
							View All
						</Link>
					</div>

					<div className="flex flex-col gap-3">
						{requestsQ.isLoading ? (
							<div className="border-border animate-pulse rounded-2xl border p-6 text-center">Loading cases...</div>
						) : cases.length === 0 ? (
							<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border-border border-dashed flex flex-col items-center justify-center gap-3 rounded-2xl border py-12 text-center">
								<div className="bg-muted text-muted-foreground rounded-full p-4">
									<EmptyStateIcon className="size-10" />
								</div>
								<div>
									<h3 className="text-foreground font-semibold">No active cases</h3>
									<p className="text-muted-foreground mt-1 text-sm">When you submit a request or contact support, your cases will appear here.</p>
								</div>
								<button onClick={() => router.push(PORTAL_ROUTES.loaNew)} className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 rounded-full px-5 py-2 text-sm font-medium transition-colors">
									Submit a Request
								</button>
							</motion.div>
						) : (
							cases.map((c) => {
								const isPendingAction = c.status.toLowerCase().includes("action") || c.status.toLowerCase().includes("pending")
								return (
									<motion.div
										key={c.id}
										whileHover={{ x: 4 }}
										onClick={() => router.push(PORTAL_ROUTES.requestDetail(c.caseRef))}
										className={`bg-card border-border hover:border-primary/30 group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition-all sm:p-5 ${isPendingAction ? "border-l-4 border-l-accent" : ""}`}
									>
										<div className="flex flex-col gap-2 sm:gap-3">
											<div className="flex flex-wrap items-center gap-2">
												<span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 font-mono text-xs font-medium">
													{c.caseRef}
												</span>
												<span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusColor(c.status)}`}>
													{isPendingAction && (
														<span className="bg-accent mr-1.5 inline-block size-1.5 animate-pulse rounded-full" />
													)}
													{c.status.replace(/_/g, " ")}
												</span>
											</div>
											<h4 className="text-foreground font-medium">
												{c.caseType ? c.caseType.replace(/_/g, " ") : "Service Request"}
											</h4>
											<p className="text-muted-foreground text-xs">
												Last updated: {new Date(c.updatedAt || c.submittedAt).toLocaleDateString()}
											</p>
										</div>
										<div className="text-muted-foreground group-hover:text-primary transition-colors">
											<ArrowRightIcon className="size-5" />
										</div>
									</motion.div>
								)
							})
						)}
					</div>
				</motion.section>

				{/* 4. Recent Communications Timeline */}
				<motion.section variants={itemVariants} className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<h2 className="text-foreground text-xl font-bold">Recent Activity</h2>
						<Link href="#" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
							View All
						</Link>
					</div>
					<div className="bg-card border-border rounded-2xl border p-5">
						<div className="relative pl-6">
							{/* Vertical Line */}
							<div className="bg-border absolute bottom-2 left-2 top-2 w-px" />
							
							{recentTimeline.map((item, index) => (
								<motion.div 
									key={item.id}
									initial={{ opacity: 0, x: -10 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
									className="relative mb-6 last:mb-0"
								>
									{/* Dot */}
									<div className={`${item.color} absolute -left-[21px] top-1.5 size-2.5 rounded-full ring-4 ring-[var(--card)]`} />
									<p className="text-foreground text-sm">{item.text}</p>
									<p className="text-muted-foreground mt-0.5 text-xs">{item.time}</p>
								</motion.div>
							))}
						</div>
					</div>
				</motion.section>
			</div>

			{/* 5. Knowledge Base Highlights */}
			<motion.section variants={itemVariants} className="mt-4 flex flex-col gap-4">
				<h2 className="text-foreground text-xl font-bold">Helpful Resources</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{kbArticles.map((article) => (
						<motion.div
							key={article.id}
							whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
							onClick={() => router.push(PORTAL_ROUTES.kb)}
							className="bg-card border-border group cursor-pointer rounded-2xl border p-5 transition-all"
						>
							<span className="text-chart-1 bg-chart-1/10 mb-3 inline-block rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide">
								{article.category}
							</span>
							<h3 className="text-foreground group-hover:text-primary mb-2 font-semibold transition-colors">
								{article.title}
							</h3>
							<p className="text-muted-foreground text-sm line-clamp-2">
								{article.excerpt}
							</p>
						</motion.div>
					))}
				</div>
			</motion.section>
		</motion.div>
	)
}
