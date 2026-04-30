"use client"

import { ExternalLink } from "@/core/components/icons"
import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"

type PatientTab = "overview" | "communications" | "cases" | "programs" | "devices" | "audit" | "consent"

const TABS: { key: PatientTab; label: string }[] = [
	{ key: "overview", label: "Overview" },
	{ key: "communications", label: "Communications" },
	{ key: "cases", label: "Cases" },
	{ key: "programs", label: "Programs" },
	{ key: "devices", label: "Devices" },
	{ key: "audit", label: "Audit" },
	{ key: "consent", label: "Consent" },
]

interface Props {
	patientName: string
	mrn?: string | null
	age?: number | null
	sex?: string | null
	ethnicity?: string | null
	emrUrl?: string | null
	consentRestriction?: boolean
	activeTab: PatientTab
	onTabChange: (tab: PatientTab) => void
	rightRail?: React.ReactNode
	children: React.ReactNode
	hiddenTabs?: PatientTab[]
}

export function PatientProfileShell({
	patientName,
	mrn,
	age,
	sex,
	ethnicity,
	emrUrl,
	consentRestriction,
	activeTab,
	onTabChange,
	rightRail,
	children,
	hiddenTabs = [],
}: Props) {
	const visibleTabs = TABS.filter(t => !hiddenTabs.includes(t.key))
	const demographics = [age ? `${age} yo` : null, sex, ethnicity]
		.filter(Boolean)
		.join(" · ")

	return (
		<div className="flex min-h-screen flex-col">
			<div className="border-b bg-background sticky top-0 z-10">
				<div className="flex items-start justify-between px-6 pt-4 pb-0">
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<h1 className="text-xl font-bold">{patientName}</h1>
							{mrn ? (
								<Badge variant="outline" className="font-mono text-[11px]">
									MRN: {mrn}
								</Badge>
							) : null}
						</div>
						{demographics ? (
							<p className="text-muted-foreground text-sm">{demographics}</p>
						) : null}
					</div>
					{emrUrl ? (
						<a
							href={emrUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1 text-xs text-primary"
						>
							<ExternalLink className="size-3" />
							Open in EMR
						</a>
					) : null}
				</div>
				{consentRestriction && (
					<div className="bg-red-50 border-b border-red-200 px-4 py-1.5 text-xs text-red-700 font-medium">
						Consent restriction active — some actions may be blocked.
					</div>
				)}
				<nav className="mt-3 flex gap-0 overflow-x-auto px-6">
					{visibleTabs.map(t => (
						<button
							key={t.key}
							type="button"
							onClick={() => onTabChange(t.key)}
							className={`border-b-2 px-3 py-2 text-sm whitespace-nowrap transition-colors ${
								activeTab === t.key
									? "border-primary text-foreground font-medium"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
						>
							{t.label}
						</button>
					))}
				</nav>
			</div>
			<div className="flex flex-1 gap-6 p-6">
				<div className="min-w-0 flex-1">{children}</div>
				{rightRail ? <aside className="flex w-72 shrink-0 flex-col gap-3">{rightRail}</aside> : null}
			</div>
		</div>
	)
}
