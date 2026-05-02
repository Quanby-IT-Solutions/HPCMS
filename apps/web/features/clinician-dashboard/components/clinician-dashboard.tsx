"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { useClinicianContext } from "@/features/clinician-shared/components/clinician-launch-provider"

// -- INLINE SVGS --
function InboxIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
			<path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
		</svg>
	)
}

function ClockUserIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	)
}

function ArrowUpCircleIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<polyline points="16 12 12 8 8 12" />
			<line x1="12" x2="12" y1="16" y2="8" />
		</svg>
	)
}

function CheckCircleIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
			<polyline points="22 4 12 14.01 9 11.01" />
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

// -- MOCK DATA --
const KPI_DATA = [
	{ id: "open", label: "My Open Cases", count: 12, icon: InboxIcon, colorClass: "text-primary" },
	{ id: "pending", label: "Awaiting My Input", count: 3, icon: ClockUserIcon, colorClass: "text-accent" },
	{ id: "escalated", label: "Escalated to Me", count: 1, icon: ArrowUpCircleIcon, colorClass: "text-destructive" },
	{ id: "resolved", label: "Resolved This Week", count: 8, icon: CheckCircleIcon, colorClass: "text-chart-5" },
]

type Priority = "Critical" | "High" | "Medium" | "Low"
const CASES = [
	{ id: "CASE-2941", patientId: "patient-1", name: "Maria Santos", mrn: "MRN-849201", type: "LOA Request", status: "Pending Clinician", priority: "Critical" as Priority, time: "2h overdue", note: "Needs attending physician signature for HMO approval." },
	{ id: "CASE-2938", patientId: "patient-2", name: "Juan Dela Cruz", mrn: "MRN-102934", type: "Care Coord", status: "In Progress", priority: "High" as Priority, time: "4h", note: "Waiting on lab results before scheduling discharge." },
	{ id: "CASE-2915", patientId: "patient-3", name: "Elena Ramos", mrn: "MRN-559102", type: "Billing", status: "Open", priority: "Medium" as Priority, time: "1d", note: "Patient requesting breakdown of room charges." },
]

function getPriorityColor(p: Priority) {
	if (p === "Critical") return "bg-destructive"
	if (p === "High") return "bg-[var(--chart-4)]" // Amber equivalent
	if (p === "Medium") return "bg-primary"
	return "bg-muted"
}

// -- ANIMATIONS --
const stripVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1, delayChildren: 0.05 },
	},
}

const listVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.02 },
	},
}

const rowVariants = {
	hidden: { opacity: 0, y: 5 },
	show: { opacity: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" } },
}

export function ClinicianDashboard() {
	const { setPatientContext } = useClinicianContext()
	const [activeFilter, setActiveFilter] = useState("All")

	const filteredCases = activeFilter === "All" ? CASES : CASES.filter(c => c.priority === activeFilter || c.status === activeFilter)

	return (
		<div className="mx-auto flex w-full max-w-[960px] flex-col gap-4 p-4 sm:gap-6 sm:p-6">
			{/* KPI STRIP */}
			<motion.div 
				variants={stripVariants} 
				initial="hidden" 
				animate="show" 
				className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
			>
				{KPI_DATA.map((kpi) => {
					const Icon = kpi.icon
					const isEscalated = kpi.id === "escalated" && kpi.count > 0
					return (
						<motion.button 
							key={kpi.id} 
							variants={rowVariants}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className={`bg-card flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${isEscalated ? "border-destructive ring-destructive/20 ring-1" : "border-border hover:border-primary/50"}`}
						>
							<Icon className={`size-5 shrink-0 ${kpi.colorClass}`} />
							<div className="flex flex-col">
								<span className="text-foreground text-base font-bold leading-none sm:text-lg">
									{kpi.count}
								</span>
								<span className="text-muted-foreground mt-0.5 text-[10px] uppercase tracking-wide sm:text-xs">
									{kpi.label}
								</span>
							</div>
						</motion.button>
					)
				})}
			</motion.div>

			{/* CASE LIST SECTION */}
			<div className="flex flex-col gap-2">
				{/* FILTER BAR */}
				<div className="bg-secondary/50 flex flex-wrap gap-2 rounded-md p-1.5">
					{["All", "Critical", "Pending Clinician"].map(f => (
						<button 
							key={f}
							onClick={() => setActiveFilter(f)}
							className={`rounded-sm px-3 py-1 text-xs font-medium transition-colors ${activeFilter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"}`}
						>
							{f}
						</button>
					))}
				</div>

				{/* LIST */}
				<motion.div variants={listVariants} initial="hidden" animate="show" className="border-border flex flex-col rounded-lg border">
					<AnimatePresence mode="popLayout">
						{filteredCases.map((c, i) => {
							const isOverdue = c.time.includes("overdue")
							const isPending = c.status === "Pending Clinician"
							return (
								<motion.button
									key={c.id}
									layout
									variants={rowVariants}
									initial="hidden"
									animate="show"
									exit={{ opacity: 0, scale: 0.98 }}
									onClick={() => setPatientContext(c.patientId)}
									className={`hover:bg-card group relative flex w-full flex-col gap-1 overflow-hidden p-3 text-left transition-colors sm:flex-row sm:items-center sm:gap-4 ${i !== filteredCases.length - 1 ? "border-border border-b" : ""}`}
								>
									{/* Priority Edge Bar */}
									<div className={`absolute bottom-0 left-0 top-0 w-[3px] ${getPriorityColor(c.priority)}`} />
									
									<div className="flex w-full min-w-0 flex-col gap-1 pl-2 sm:flex-row sm:items-center sm:pl-0">
										{/* Case ID & Patient */}
										<div className="flex w-full shrink-0 flex-col sm:w-[220px]">
											<div className="flex items-center gap-2">
												<span className="text-foreground text-sm font-semibold truncate">{c.name}</span>
												<span className="text-muted-foreground font-mono text-[10px]">{c.mrn}</span>
											</div>
											<span className="text-muted-foreground font-mono text-[10px]">{c.id}</span>
										</div>

										{/* Badges */}
										<div className="mt-1 flex shrink-0 items-center gap-2 sm:mt-0 sm:w-[220px]">
											<span className="bg-chart-1/10 text-chart-1 rounded px-1.5 py-0.5 text-[10px] font-bold">
												{c.type}
											</span>
											<span className={`rounded px-1.5 py-0.5 text-[10px] font-bold flex items-center ${isPending ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
												{isPending && <span className="bg-primary mr-1 size-1.5 animate-pulse rounded-full" />}
												{c.status}
											</span>
										</div>

										{/* SLA & Note Preview */}
										<div className="mt-1 flex min-w-0 flex-1 items-center gap-3 sm:mt-0">
											<span className={`shrink-0 text-[10px] font-bold tabular-nums ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
												{c.time}
											</span>
											<span className="text-muted-foreground truncate text-xs italic">
												{c.note}
											</span>
										</div>
									</div>
								</motion.button>
							)
						})}
					</AnimatePresence>
					{filteredCases.length === 0 && (
						<div className="text-muted-foreground p-8 text-center text-sm">
							No cases match the selected filters.
						</div>
					)}
				</motion.div>
			</div>

			{/* RECENT HANDOFFS (Optional JCI strip) */}
			<motion.div variants={rowVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-4 flex flex-col gap-2">
				<h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Recent Handoffs</h3>
				<div className="bg-card border-border flex flex-col gap-2 rounded-lg border p-3">
					<div className="flex items-start gap-3">
						<ArrowRightIcon className="text-muted-foreground mt-0.5 size-3 shrink-0" />
						<div className="flex flex-col gap-0.5 text-xs">
							<span className="text-foreground font-medium">Dr. Lim → You (CASE-2941)</span>
							<span className="text-muted-foreground italic">"Handing over case. Patient needs HMO clearance before discharge."</span>
						</div>
						<span className="text-muted-foreground ml-auto shrink-0 text-[10px]">10m ago</span>
					</div>
				</div>
			</motion.div>
		</div>
	)
}
