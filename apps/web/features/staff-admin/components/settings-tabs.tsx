"use client"

import * as React from "react"

import { cn } from "@/core/lib/utils"

interface SettingsTab {
	key: string
	label: string
	content: React.ReactNode
	saveBar?: React.ReactNode
}

interface SettingsTabsProps {
	tabs: SettingsTab[]
	defaultTab?: string
}

export function SettingsTabs({ tabs, defaultTab }: SettingsTabsProps) {
	const [activeKey, setActiveKey] = React.useState<string>(
		defaultTab ?? tabs[0]?.key ?? ""
	)

	const activeTab = tabs.find(t => t.key === activeKey)

	return (
		<div className="flex min-h-0 gap-6">
			<nav className="flex min-w-40 flex-col gap-1 py-1">
				{tabs.map(tab => (
					<button
						key={tab.key}
						type="button"
						onClick={() => setActiveKey(tab.key)}
						className={cn(
							"rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
							activeKey === tab.key
								? "bg-muted text-foreground"
								: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
						)}
					>
						{tab.label}
					</button>
				))}
			</nav>

			<div className="flex flex-1 flex-col gap-4">
				<div className="flex-1">{activeTab?.content}</div>
				{activeTab?.saveBar && (
					<div className="border-t pt-4">{activeTab.saveBar}</div>
				)}
			</div>
		</div>
	)
}
