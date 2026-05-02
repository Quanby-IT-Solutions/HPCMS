"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"

import { useSignOutMutation } from "@/features/auth/api/session.hooks"
import { useClinicianContext } from "./clinician-launch-provider"

// -- CUSTOM INLINE SVGS --

function SearchIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	)
}

function SunMoonToggle({ isDark }: { isDark: boolean }) {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
			<AnimatePresence mode="wait">
				{isDark ? (
					<motion.g key="moon" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }} transition={{ duration: 0.15 }}>
						<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
					</motion.g>
				) : (
					<motion.g key="sun" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }} transition={{ duration: 0.15 }}>
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2" />
						<path d="M12 20v2" />
						<path d="m4.93 4.93 1.41 1.41" />
						<path d="m17.66 17.66 1.41 1.41" />
						<path d="M2 12h2" />
						<path d="M20 12h2" />
						<path d="m6.34 17.66-1.41 1.41" />
						<path d="m19.07 4.93-1.41 1.41" />
					</motion.g>
				)}
			</AnimatePresence>
		</svg>
	)
}

export function ClinicianHeader() {
	const { isEmbedded, setPatientContext } = useClinicianContext()
	const { mutate: signOut } = useSignOutMutation()
	const { theme, setTheme } = useTheme()
	const [searchFocused, setSearchFocused] = useState(false)
	const [searchQuery, setSearchQuery] = useState("")
	const [avatarOpen, setAvatarOpen] = useState(false)

	// Do not render anything if embedded inside the EMR
	if (isEmbedded) return null

	const isDark = theme === "dark"

	// Mock search results
	const results = [
		{ id: "patient-1", name: "Maria Santos", mrn: "MRN-849201", dob: "1978-05-12", cases: 2 },
		{ id: "patient-2", name: "Juan Dela Cruz", mrn: "MRN-102934", dob: "1965-11-23", cases: 0 },
	]

	const filtered = results.filter(r => 
		r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
		r.mrn.toLowerCase().includes(searchQuery.toLowerCase())
	)

	return (
		<header className="bg-card border-border relative z-50 flex h-[48px] items-center justify-between border-b px-4 transition-colors">
			{/* LEFT: Logo & Label */}
			<div className="flex shrink-0 items-center gap-3">
				<Link href="/clinician" onClick={() => setPatientContext(null)} className="text-foreground hover:text-primary transition-colors flex items-center">
					<div className="relative size-6 shrink-0">
						<Image src="/logo/stlukes.png" alt="St. Luke's Logo" fill className="object-contain" />
					</div>
				</Link>
				<span className="text-muted-foreground hidden text-[11px] font-semibold uppercase tracking-wider sm:inline-block">
					Clinical View
				</span>
			</div>

			{/* CENTER: Quick Search */}
			<div className="relative hidden w-full max-w-sm sm:block">
				<motion.div 
					animate={{ width: searchFocused ? "100%" : "90%" }}
					transition={{ duration: 0.15, ease: "easeOut" }}
					className={`relative mx-auto flex h-8 items-center rounded-md border bg-background px-3 transition-colors ${searchFocused ? "border-ring ring-ring/20 ring-2" : "border-border"}`}
				>
					<SearchIcon className="text-muted-foreground mr-2 size-3.5 shrink-0" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onFocus={() => setSearchFocused(true)}
						onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
						placeholder="Search patient name or MRN..."
						className="placeholder:text-muted-foreground flex-1 bg-transparent text-xs outline-none"
					/>
				</motion.div>

				<AnimatePresence>
					{searchFocused && searchQuery.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 4 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -4 }}
							transition={{ duration: 0.1 }}
							className="bg-card border-border absolute left-0 right-0 top-10 overflow-hidden rounded-md border shadow-lg"
						>
							{filtered.length > 0 ? (
								<ul className="flex max-h-[300px] flex-col overflow-y-auto p-1">
									{filtered.map(r => (
										<li key={r.id}>
											<button
												className="hover:bg-muted focus:bg-muted w-full rounded-sm px-3 py-2 text-left outline-none transition-colors"
												onClick={() => {
													setPatientContext(r.id)
													setSearchQuery("")
													setSearchFocused(false)
												}}
											>
												<div className="flex items-center justify-between">
													<span className="text-foreground text-sm font-semibold">{r.name}</span>
													{r.cases > 0 && (
														<span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-bold">
															{r.cases} Case{r.cases > 1 ? "s" : ""}
														</span>
													)}
												</div>
												<div className="text-muted-foreground flex gap-2 text-[11px] font-mono">
													<span>{r.mrn}</span>
													<span>•</span>
													<span>DOB: {r.dob}</span>
												</div>
											</button>
										</li>
									))}
								</ul>
							) : (
								<div className="text-muted-foreground p-3 text-center text-xs">No patients found.</div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* RIGHT: Campus, Theme, Avatar */}
			<div className="flex shrink-0 items-center gap-3">
				{/* Search Icon (Mobile Only) */}
				<button className="text-muted-foreground hover:text-foreground sm:hidden">
					<SearchIcon className="size-4" />
				</button>

				<span className="bg-accent/20 text-accent hidden rounded-full px-2 py-0.5 text-[10px] font-bold sm:inline-block">
					BGC
				</span>
				
				<button 
					onClick={() => setTheme(isDark ? "light" : "dark")}
					className="border-border hover:bg-muted flex h-6 w-10 items-center justify-center rounded-full border bg-transparent transition-colors"
				>
					<SunMoonToggle isDark={isDark} />
				</button>

				<div className="relative">
					<button 
						onClick={() => setAvatarOpen(!avatarOpen)}
						className="bg-primary text-primary-foreground hover:bg-primary/90 flex size-7 items-center justify-center rounded-full text-xs font-bold transition-colors"
					>
						MD
					</button>

					<AnimatePresence>
						{avatarOpen && (
							<>
								<div className="fixed inset-0 z-40" onClick={() => setAvatarOpen(false)} />
								<motion.div
									initial={{ opacity: 0, y: 4, scale: 0.95 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: 4, scale: 0.95 }}
									transition={{ duration: 0.15, ease: "easeOut" }}
									className="bg-card border-border absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-md border shadow-lg"
								>
									<div className="border-border flex flex-col border-b px-3 py-2">
										<span className="text-foreground text-sm font-semibold">Dr. Maria Santos</span>
										<span className="text-muted-foreground text-xs">Internal Medicine</span>
									</div>
									<div className="p-1">
										<button 
											onClick={() => {
												setAvatarOpen(false)
												signOut()
											}}
											className="text-destructive hover:bg-destructive/10 w-full rounded-sm px-2 py-1.5 text-left text-xs font-medium transition-colors"
										>
											Sign Out
										</button>
									</div>
								</motion.div>
							</>
						)}
					</AnimatePresence>
				</div>
			</div>
		</header>
	)
}
