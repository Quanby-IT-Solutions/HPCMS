"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

import { Skeleton } from "@/core/components/ui/skeleton"
import { usePortalChatThreadsQuery } from "@/features/portal-chat/api/chat.hooks"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

function MessageCircleIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
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

function EmptyInboxIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
			<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
			<path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
		</svg>
	)
}

function formatRelative(d: Date | string): string {
	const date = d instanceof Date ? d : new Date(d)
	const minutes = Math.round((Date.now() - date.getTime()) / 60_000)
	if (minutes < 1) return "just now"
	if (minutes < 60) return `${minutes}m ago`
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return `${hours}h ago`
	const days = Math.floor(hours / 24)
	if (days < 7) return `${days}d ago`
	return date.toLocaleDateString()
}

const listVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 15 },
	show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 30 } },
}

export function ThreadsList() {
	const { data, isLoading } = usePortalChatThreadsQuery()

	if (isLoading || !data) {
		return (
			<div className="flex flex-col gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="bg-card border-border flex flex-col gap-2 rounded-2xl border p-5">
						<Skeleton className="h-6 w-1/3 rounded-md" />
						<Skeleton className="h-4 w-2/3 rounded-md" />
					</div>
				))}
			</div>
		)
	}

	if (data.threads.length === 0) {
		return (
			<motion.div 
				initial={{ opacity: 0, scale: 0.95 }} 
				animate={{ opacity: 1, scale: 1 }} 
				className="bg-card border-border border-dashed flex flex-col items-center justify-center gap-3 rounded-2xl border py-16 text-center"
			>
				<div className="bg-muted text-muted-foreground rounded-full p-5">
					<EmptyInboxIcon className="size-12" />
				</div>
				<div>
					<h3 className="text-foreground text-lg font-semibold">No secure messages</h3>
					<p className="text-muted-foreground mx-auto mt-1 max-w-sm text-sm">
						Your secure inbox is empty. We will notify you here if the care team needs to reach out regarding your cases.
					</p>
				</div>
			</motion.div>
		)
	}

	return (
		<motion.ul 
			variants={listVariants}
			initial="hidden"
			animate="show"
			className="flex flex-col gap-4"
		>
			<AnimatePresence>
				{data.threads.map(t => (
					<motion.li 
						key={t.id}
						variants={itemVariants}
						whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
					>
						<Link
							href={PORTAL_ROUTES.chatThread(t.id)}
							className="bg-card border-border hover:border-primary/40 group flex items-center justify-between gap-4 rounded-2xl border p-5 transition-colors"
						>
							<div className="flex flex-1 items-start gap-4">
								<div className="bg-primary/10 text-primary mt-1 hidden rounded-full p-2.5 sm:block">
									<MessageCircleIcon className="size-5" />
								</div>
								
								<div className="flex min-w-0 flex-col gap-1">
									<div className="flex flex-wrap items-center gap-2">
										<p className="text-foreground text-base font-semibold">
											{t.subject}
										</p>
										{t.unreadCount > 0 && (
											<span className="bg-primary text-primary-foreground flex h-5 items-center justify-center rounded-full px-2 text-xs font-bold">
												<span className="bg-primary-foreground mr-1 size-1.5 animate-pulse rounded-full" />
												{t.unreadCount} New
											</span>
										)}
									</div>
									
									<p className="text-muted-foreground line-clamp-1 text-sm">
										{t.preview}
									</p>
									
									<div className="mt-2 flex items-center gap-3">
										{t.caseRef && (
											<span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 font-mono text-xs font-medium">
												Case: {t.caseRef}
											</span>
										)}
										<span className="text-muted-foreground text-xs font-medium">
											Last activity: {formatRelative(t.lastMessageAt)}
										</span>
									</div>
								</div>
							</div>
							
							<div className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors">
								<ArrowRightIcon className="size-5" />
							</div>
						</Link>
					</motion.li>
				))}
			</AnimatePresence>
		</motion.ul>
	)
}
