"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

import { ThreadsList } from "@/features/portal-chat/components/threads-list"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

function PlusIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<line x1="12" x2="12" y1="5" y2="19" />
			<line x1="5" x2="19" y1="12" y2="12" />
		</svg>
	)
}

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.05,
		},
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 15 },
	show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 30 } },
}

export default function PortalChatListPage() {
	const router = useRouter()

	return (
		<motion.div 
			variants={containerVariants} 
			initial="hidden" 
			animate="show" 
			className="flex flex-col gap-6 pb-12"
		>
			<motion.header variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-foreground text-3xl font-bold tracking-tight">Secure Messages</h1>
					<p className="text-muted-foreground mt-2 text-lg">
						Conversations with the SLMC care team.
					</p>
				</div>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => router.push(PORTAL_ROUTES.loaNew)}
					className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-medium shadow-sm transition-colors"
				>
					<PlusIcon className="size-5" />
					<span>Start New Request</span>
				</motion.button>
			</motion.header>

			<motion.main variants={itemVariants}>
				<ThreadsList />
			</motion.main>
		</motion.div>
	)
}
