"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { useClinicianContext } from "@/features/clinician-shared/components/clinician-launch-provider"

// -- INLINE SVGS --
function ExternalLinkIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
			<polyline points="15 3 21 3 21 9" />
			<line x1="10" x2="21" y1="14" y2="3" />
		</svg>
	)
}

function ArrowLeftIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="m15 18-6-6 6-6" />
		</svg>
	)
}

function ChevronIcon({ className, expanded }: { className?: string; expanded?: boolean }) {
	return (
		<motion.svg animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.15 }} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<polyline points="9 18 15 12 9 6" />
		</motion.svg>
	)
}

function FHIROrSyncIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
			<path d="M3 3v5h5" />
		</svg>
	)
}

// -- TABS --
const TABS = ["Cases", "Timeline", "Clinical", "Documents", "Programs"] as const
type Tab = typeof TABS[number]

export function PatientPanel() {
	const { patientId, isEmbedded, setPatientContext } = useClinicianContext()
	const [activeTab, setActiveTab] = useState<Tab>("Cases")

	if (!patientId) return null

	return (
		<div className="flex h-full flex-col">
			{/* PATIENT IDENTITY BAR (Sticky) */}
			<div className="bg-card border-border sticky top-0 z-40 flex shrink-0 flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
				<div className="flex min-w-0 flex-1 items-center gap-3">
					{!isEmbedded && (
						<button 
							onClick={() => setPatientContext(null)} 
							className="text-muted-foreground hover:bg-muted mr-1 rounded-md p-1 transition-colors hover:text-foreground"
							title="Back to Dashboard"
						>
							<ArrowLeftIcon className="size-4" />
						</button>
					)}
					<h2 className="text-foreground truncate text-base font-semibold sm:text-lg">Maria Santos</h2>
					<span className="text-muted-foreground shrink-0 font-mono text-xs">MRN-849201</span>
					<span className="text-muted-foreground shrink-0 text-xs">45F</span>
					{isEmbedded && (
						<span className="bg-accent/10 text-accent shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase">
							EMR Linked
						</span>
					)}
				</div>
				<div className="flex shrink-0 items-center gap-3">
					<span className="bg-accent/20 text-accent rounded-full px-2 py-0.5 text-[10px] font-bold">BGC</span>
					{!isEmbedded && (
						<button className="text-muted-foreground hover:text-primary flex items-center gap-1 text-[11px] font-medium transition-colors">
							Open in EMR <ExternalLinkIcon className="size-3" />
						</button>
					)}
				</div>
			</div>

			{/* INTERNAL TAB NAVIGATION */}
			<div className="border-border shrink-0 border-b px-4">
				<nav className="no-scrollbar flex overflow-x-auto">
					{TABS.map((tab) => {
						const isActive = activeTab === tab
						return (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`relative whitespace-nowrap px-4 py-2.5 text-[13px] font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
							>
								{tab}
								{isActive && (
									<motion.div
										layoutId="clinician-tab-indicator"
										transition={{ duration: 0.15, ease: "easeOut" }}
										className="bg-primary absolute bottom-0 left-0 right-0 h-[2px]"
									/>
								)}
							</button>
						)
					})}
				</nav>
			</div>

			{/* TAB CONTENT AREA */}
			<div className="relative flex-1 overflow-y-auto bg-background p-4 sm:p-6">
				<AnimatePresence mode="wait">
					<motion.div
						key={activeTab}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.1 }}
					>
						{activeTab === "Cases" && <CasesTab />}
						{activeTab === "Timeline" && <TimelineTab />}
						{activeTab === "Clinical" && <ClinicalTab />}
						{activeTab === "Documents" && <DocumentsTab />}
						{activeTab === "Programs" && <ProgramsTab />}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	)
}

// ----------------------------------------------------------------------
// TAB: CASES
// ----------------------------------------------------------------------
function CasesTab() {
	const [activeNoteInput, setActiveNoteInput] = useState<string | null>(null)

	const cases = [
		{ id: "CASE-2941", type: "LOA Request", status: "Pending Clinician", priority: "Critical", time: "2h overdue", note: "Needs signature for HMO.", assigned: "Unassigned" },
		{ id: "CASE-2801", type: "Billing", status: "In Progress", priority: "Medium", time: "1d", note: "Waiting on statement.", assigned: "John Agent" },
	]

	return (
		<div className="flex flex-col gap-3">
			{cases.map((c, i) => {
				const isCritical = c.priority === "Critical"
				return (
					<motion.div
						key={c.id}
						initial={{ opacity: 0, y: 5 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.15, delay: i * 0.05 }}
						className="bg-card border-border hover:border-primary/40 group relative flex flex-col gap-2 rounded-lg border p-4 transition-colors"
					>
						<div className={`absolute bottom-0 left-0 top-0 w-[3px] ${isCritical ? "bg-destructive" : "bg-primary"}`} />
						<div className="flex flex-wrap items-center justify-between gap-2 pl-2">
							<div className="flex items-center gap-2">
								<span className="text-foreground font-mono text-xs font-semibold">{c.id}</span>
								<span className="bg-chart-1/10 text-chart-1 rounded px-1.5 py-0.5 text-[10px] font-bold">{c.type}</span>
								<span className={`rounded px-1.5 py-0.5 text-[10px] font-bold flex items-center ${c.status === "Pending Clinician" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
									{c.status}
								</span>
							</div>
							<div className="text-muted-foreground flex items-center gap-3 text-[10px]">
								<span className={isCritical ? "font-bold text-destructive" : ""}>{c.time}</span>
								<span>Assigned: {c.assigned}</span>
							</div>
						</div>
						<p className="text-muted-foreground pl-2 text-xs italic">Latest: {c.note}</p>
						
						{/* Hover Quick Actions */}
						<div className="mt-2 flex items-center gap-2 pl-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
							<button onClick={() => setActiveNoteInput(c.id)} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded px-2 py-1 text-[10px] font-medium transition-colors">
								Add Note
							</button>
							<button className="bg-destructive/10 text-destructive hover:bg-destructive/20 rounded px-2 py-1 text-[10px] font-medium transition-colors">
								Escalate
							</button>
						</div>

						{/* Inline Note Form */}
						<AnimatePresence>
							{activeNoteInput === c.id && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									className="mt-2 pl-2 overflow-hidden"
								>
									<textarea className="border-input bg-background w-full rounded-md border p-2 text-xs outline-none focus:border-primary" placeholder="Type case note here..." rows={2} />
									<div className="mt-2 flex justify-end gap-2">
										<button onClick={() => setActiveNoteInput(null)} className="text-muted-foreground text-[10px]">Cancel</button>
										<button onClick={() => setActiveNoteInput(null)} className="bg-primary text-primary-foreground rounded px-3 py-1 text-[10px] font-bold">Save Note</button>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				)
			})}
		</div>
	)
}

// ----------------------------------------------------------------------
// TAB: TIMELINE
// ----------------------------------------------------------------------
function TimelineTab() {
	return (
		<div className="relative pl-6">
			<div className="bg-border absolute bottom-0 left-[11px] top-2 w-[2px]" />
			{[1, 2, 3].map((_, i) => (
				<motion.div
					key={i}
					initial={{ opacity: 0, x: -5 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ delay: i * 0.05 }}
					className="relative mb-6 last:mb-0"
				>
					<div className="bg-chart-2 absolute -left-[29px] top-0.5 flex size-5 items-center justify-center rounded-full ring-4 ring-background">
						<div className="bg-background size-2 rounded-full" />
					</div>
					<div className="flex flex-col gap-0.5">
						<span className="text-muted-foreground text-[10px]">Oct 12, 14:30</span>
						<span className="text-foreground text-xs font-medium">Patient submitted LOA request via portal</span>
						<span className="text-primary mt-1 inline-block w-fit cursor-pointer font-mono text-[10px]">CASE-2941</span>
					</div>
				</motion.div>
			))}
		</div>
	)
}

// ----------------------------------------------------------------------
// TAB: CLINICAL (FHIR)
// ----------------------------------------------------------------------
function CollapsibleSection({ title, count, defaultOpen = false, children }: any) {
	const [isOpen, setIsOpen] = useState(defaultOpen)
	return (
		<div className="border-border mb-4 rounded-lg border">
			<button onClick={() => setIsOpen(!isOpen)} className="bg-card flex w-full items-center justify-between p-3 text-left">
				<div className="flex items-center gap-2">
					<span className="text-foreground text-sm font-semibold">{title}</span>
					<span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px]">{count}</span>
				</div>
				<ChevronIcon expanded={isOpen} className="text-muted-foreground size-4" />
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
						<div className="bg-background p-3 text-xs">{children}</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

function ClinicalTab() {
	return (
		<div className="flex flex-col">
			<div className="text-muted-foreground mb-4 flex items-center justify-between text-[10px]">
				<span className="flex items-center gap-1"><FHIROrSyncIcon className="size-3" /> Synced with Altera Sunrise (2 mins ago)</span>
				<button className="hover:text-foreground">Force Refresh</button>
			</div>
			
			<CollapsibleSection title="Active Conditions (FHIR)" count={2} defaultOpen>
				<div className="flex flex-col gap-2">
					<div className="border-border flex justify-between border-b pb-2">
						<span className="font-semibold text-foreground">Type 2 Diabetes Mellitus</span>
						<span className="text-muted-foreground">E11.9</span>
					</div>
					<div className="border-border flex justify-between border-b pb-2">
						<span className="font-semibold text-foreground">Hypertension</span>
						<span className="text-muted-foreground">I10</span>
					</div>
				</div>
			</CollapsibleSection>

			<CollapsibleSection title="Medications" count={1} defaultOpen>
				<div className="flex justify-between">
					<span className="font-semibold text-foreground">Metformin 500mg</span>
					<span className="text-muted-foreground">PO BID</span>
				</div>
			</CollapsibleSection>

			<CollapsibleSection title="Allergies" count={0}>
				<span className="text-muted-foreground italic">No known allergies.</span>
			</CollapsibleSection>
		</div>
	)
}

// ----------------------------------------------------------------------
// TAB: DOCUMENTS & PROGRAMS (Simplified for dense layout)
// ----------------------------------------------------------------------
function DocumentsTab() {
	const documents = [
		{ id: "doc-1", name: "LOA Request Form", type: "LOA", uploadedBy: "Maria Santos", date: "2026-04-25", size: "245 KB", status: "Verified" },
		{ id: "doc-2", name: "HMO Reply — Additional Docs Required", type: "Correspondence", uploadedBy: "PhilHealth", date: "2026-04-28", size: "124 KB", status: "Pending Review" },
		{ id: "doc-3", name: "Lab Results — HbA1c Panel", type: "Lab Result", uploadedBy: "St. Luke's Lab", date: "2026-04-20", size: "89 KB", status: "Verified" },
		{ id: "doc-4", name: "Prescription — Metformin 500mg", type: "Prescription", uploadedBy: "Dr. Garcia", date: "2026-03-15", size: "32 KB", status: "Verified" },
		{ id: "doc-5", name: "Insurance Member ID Card", type: "ID Document", uploadedBy: "Maria Santos", date: "2026-01-10", size: "1.2 MB", status: "Verified" },
	]

	return (
		<div className="flex flex-col gap-3">
			{documents.map((doc, i) => {
				const isPending = doc.status === "Pending Review"
				return (
					<motion.div
						key={doc.id}
						initial={{ opacity: 0, y: 5 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.15, delay: i * 0.04 }}
						className="bg-card border-border group flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:border-primary/40"
					>
						<div className="flex flex-col gap-0.5">
							<div className="flex items-center gap-2">
								<span className="text-foreground text-xs font-medium">{doc.name}</span>
								<span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${isPending ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"}`}>
									{doc.status}
								</span>
							</div>
							<div className="text-muted-foreground flex items-center gap-3 text-[10px]">
								<span>{doc.type}</span>
								<span>·</span>
								<span>{doc.uploadedBy}</span>
								<span>·</span>
								<span>{doc.date}</span>
								<span>·</span>
								<span>{doc.size}</span>
							</div>
						</div>
						<button className="text-primary text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-100">
							View
						</button>
					</motion.div>
				)
			})}
		</div>
	)
}

function ProgramsTab() {
	const programs = [
		{
			id: "prog-1",
			name: "Cardiac Rehabilitation",
			status: "Active",
			coordinator: "J. Reyes",
			startDate: "2026-03-01",
			nextSession: "2026-05-05",
			progress: 65,
		},
		{
			id: "prog-2",
			name: "Hypertension Management",
			status: "Active",
			coordinator: "A. Santos",
			startDate: "2026-04-15",
			nextSession: "2026-05-08",
			progress: 30,
		},
		{
			id: "prog-3",
			name: "Diabetes Education Program",
			status: "Completed",
			coordinator: "Dr. Garcia",
			startDate: "2025-11-01",
			nextSession: null,
			progress: 100,
		},
	]

	return (
		<div className="flex flex-col gap-3">
			{programs.map((prog, i) => {
				const isCompleted = prog.status === "Completed"
				return (
					<motion.div
						key={prog.id}
						initial={{ opacity: 0, y: 5 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.15, delay: i * 0.04 }}
						className="bg-card border-border group rounded-lg border p-4 transition-colors hover:border-primary/40"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="text-foreground text-sm font-semibold">{prog.name}</span>
								<span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${isCompleted ? "bg-muted text-muted-foreground" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"}`}>
									{prog.status}
								</span>
							</div>
							<button className="text-primary text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-100">
								View Details
							</button>
						</div>
						<div className="text-muted-foreground mt-1.5 flex items-center gap-3 text-[10px]">
							<span>Coordinator: {prog.coordinator}</span>
							<span>·</span>
							<span>Started: {prog.startDate}</span>
							{prog.nextSession && (
								<>
									<span>·</span>
									<span>Next: {prog.nextSession}</span>
								</>
							)}
						</div>
						{/* Progress bar */}
						<div className="mt-3 flex items-center gap-2">
							<div className="bg-muted h-1.5 flex-1 rounded-full overflow-hidden">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${prog.progress}%` }}
									transition={{ duration: 0.5, delay: i * 0.1 }}
									className={`h-full rounded-full ${isCompleted ? "bg-muted-foreground" : "bg-primary"}`}
								/>
							</div>
							<span className="text-muted-foreground text-[10px] tabular-nums">{prog.progress}%</span>
						</div>
					</motion.div>
				)
			})}
		</div>
	)
}
