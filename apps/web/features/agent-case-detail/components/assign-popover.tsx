"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import {
	Popover,
	PopoverContent,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/core/components/ui/popover"
import { useUsersQuery } from "@/features/staff-admin/api/admin.hooks"
import { useAssignCaseMutation } from "../api/cases.hooks"

interface AssignPopoverProps {
	caseRef: string
}

export function AssignPopover({ caseRef }: AssignPopoverProps) {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState("")

	const { data } = useUsersQuery({ query: query || undefined, limit: 20 })
	const { mutateAsync: assign, isPending } = useAssignCaseMutation()

	async function handleAssign(userId: string) {
		try {
			await assign({ ref: caseRef, assigneeUserId: userId })
			toast.success("Case assigned")
			setOpen(false)
		} catch {
			toast.error("Failed to assign case")
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger render={<Button variant="outline" size="sm" />}>Assign</PopoverTrigger>
			<PopoverContent className="w-72">
				<PopoverHeader>
					<PopoverTitle>Assign Case</PopoverTitle>
				</PopoverHeader>
				<Input
					placeholder="Search staff…"
					value={query}
					onChange={e => setQuery(e.target.value)}
				/>
				<div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
					{(data?.items ?? []).map(user => (
						<button
							key={user.id}
							className="hover:bg-muted flex flex-col rounded px-2 py-1.5 text-left text-sm"
							disabled={isPending}
							onClick={() => handleAssign(user.id)}
						>
							<span className="font-medium">{user.name}</span>
							<span className="text-muted-foreground text-xs">{user.email}</span>
						</button>
					))}
					{(data?.items ?? []).length === 0 && (
						<p className="text-muted-foreground py-2 text-center text-xs">No users found</p>
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
}
