"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import type { QueueRow } from "@repo/contracts"

import { Button } from "@/core/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/core/components/ui/dialog"
import { Label } from "@/core/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Textarea } from "@/core/components/ui/textarea"

interface Props {
	row: QueueRow
	canReassign: boolean
}

const STATUS_TRANSITIONS = ["in_review", "approved", "rejected", "closed"] as const

export function QueueRowActions({ row, canReassign }: Props) {
	const router = useRouter()
	const [statusDialogOpen, setStatusDialogOpen] = useState(false)
	const [nextStatus, setNextStatus] = useState<(typeof STATUS_TRANSITIONS)[number]>("in_review")
	const [note, setNote] = useState("")

	function openDetail(e: React.MouseEvent) {
		e.stopPropagation()
		router.push(`/agent/cases/${row.caseRef}`)
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={e => e.stopPropagation()}
							aria-label={`Actions for ${row.caseRef}`}
						/>
					}
				>
					<span aria-hidden>⋯</span>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={openDetail}>Open detail</DropdownMenuItem>
					<DropdownMenuItem
						onClick={e => {
							e.stopPropagation()
							setStatusDialogOpen(true)
						}}
					>
						Update status…
					</DropdownMenuItem>
					{canReassign ? (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={e => {
									e.stopPropagation()
									router.push(`/agent/cases/${row.caseRef}?reassign=open`)
								}}
							>
								Reassign…
							</DropdownMenuItem>
						</>
					) : null}
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update {row.caseRef}</DialogTitle>
						<DialogDescription>
							Quick status transition. For full resolution, open the case detail.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1">
							<Label htmlFor="quick-status">New status</Label>
							<Select
								value={nextStatus}
								onValueChange={v =>
									v && setNextStatus(v as (typeof STATUS_TRANSITIONS)[number])
								}
							>
								<SelectTrigger id="quick-status">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{STATUS_TRANSITIONS.map(s => (
										<SelectItem key={s} value={s}>
											{s.replace(/_/g, " ")}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="quick-note">Note (optional)</Label>
							<Textarea
								id="quick-note"
								rows={3}
								value={note}
								onChange={e => setNote(e.target.value)}
								maxLength={500}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setStatusDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							onClick={() => {
								// Real call lands when CA-BE-04/05 ship; for now jump to detail.
								setStatusDialogOpen(false)
								router.push(`/agent/cases/${row.caseRef}`)
							}}
						>
							Apply
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
