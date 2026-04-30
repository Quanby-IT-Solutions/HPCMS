"use client"

import { useState } from "react"

import { ChevronDown, RotateCcw } from "@/core/components/icons"
import { Button } from "@/core/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/core/components/ui/collapsible"
import { cn } from "@/core/lib/utils"

interface ClinicianCardProps {
	title: string
	children: React.ReactNode
	defaultOpen?: boolean
	lastSyncedAt?: Date | string | null
	onRefresh?: () => void
	isRefreshing?: boolean
	headerAction?: React.ReactNode
}

function formatLastSynced(value: Date | string | null | undefined): string {
	if (!value) return "Not yet synced"
	const date = value instanceof Date ? value : new Date(value)
	if (Number.isNaN(date.getTime())) return "Not yet synced"
	const minutes = Math.round((Date.now() - date.getTime()) / 60_000)
	if (minutes < 1) return "Synced just now"
	if (minutes < 60) return `Synced ${minutes}m ago`
	const hours = Math.round(minutes / 60)
	if (hours < 24) return `Synced ${hours}h ago`
	return `Synced ${date.toLocaleDateString()}`
}

export function ClinicianCard({
	title,
	children,
	defaultOpen = true,
	lastSyncedAt,
	onRefresh,
	isRefreshing = false,
	headerAction,
}: ClinicianCardProps) {
	const [open, setOpen] = useState(defaultOpen)

	return (
		<Card size="sm" className="gap-0">
			<Collapsible open={open} onOpenChange={setOpen}>
				<CardHeader className="flex flex-row items-center justify-between gap-2 border-b py-2">
					<CollapsibleTrigger
						render={
							<button
								type="button"
								className="flex flex-1 items-center gap-2 text-left"
								aria-expanded={open}
							/>
						}
					>
						<ChevronDown
							className={cn(
								"text-muted-foreground size-4 shrink-0 transition-transform",
								open ? "rotate-0" : "-rotate-90"
							)}
						/>
						<CardTitle>{title}</CardTitle>
					</CollapsibleTrigger>
					<div className="flex items-center gap-1">
						{headerAction}
						{onRefresh ? (
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								onClick={onRefresh}
								disabled={isRefreshing}
								aria-label={`Refresh ${title}`}
							>
								<RotateCcw className={cn("size-4", isRefreshing && "animate-spin")} />
							</Button>
						) : null}
					</div>
				</CardHeader>
				<CollapsibleContent>
					<CardContent className="py-3">{children}</CardContent>
					{lastSyncedAt !== undefined ? (
						<div className="text-muted-foreground border-t px-3 py-1.5 text-[10px]">
							{formatLastSynced(lastSyncedAt)}
						</div>
					) : null}
				</CollapsibleContent>
			</Collapsible>
		</Card>
	)
}
