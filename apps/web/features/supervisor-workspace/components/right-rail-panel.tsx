"use client"

import { useEffect, useState } from "react"

import { ChevronDown, ChevronRight } from "@/core/components/icons"
import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"

interface Props {
	title: string
	storageKey: string
	actions?: React.ReactNode
	isLoading?: boolean
	children: React.ReactNode
}

export function RightRailPanel({ title, storageKey, actions, isLoading, children }: Props) {
	const [collapsed, setCollapsed] = useState(false)

	useEffect(() => {
		try {
			const stored = localStorage.getItem(`rr-panel:${storageKey}`)
			if (stored !== null) setCollapsed(stored === "true")
		} catch {
			// ignore SSR / private-mode errors
		}
	}, [storageKey])

	function toggle() {
		const next = !collapsed
		setCollapsed(next)
		try {
			localStorage.setItem(`rr-panel:${storageKey}`, String(next))
		} catch {
			// ignore
		}
	}

	return (
		<div className="rounded-md border">
			<div className="flex items-center justify-between px-3 py-2">
				<button
					type="button"
					onClick={toggle}
					className="flex items-center gap-1 text-sm font-medium"
				>
					{collapsed ? (
						<ChevronRight className="text-muted-foreground size-3.5" />
					) : (
						<ChevronDown className="text-muted-foreground size-3.5" />
					)}
					{title}
				</button>
				{!collapsed && actions ? (
					<div className="flex items-center gap-1">{actions}</div>
				) : null}
			</div>
			{!collapsed ? (
				<div className="border-t px-3 py-3">
					{isLoading ? (
						<div className="flex flex-col gap-2">
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-4 w-2/3" />
						</div>
					) : (
						children
					)}
				</div>
			) : null}
		</div>
	)
}
