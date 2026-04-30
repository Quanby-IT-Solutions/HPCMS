"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/core/components/ui/dialog"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Switch } from "@/core/components/ui/switch"
import { Textarea } from "@/core/components/ui/textarea"
import { useAdminUsersQuery, useAssignUserTenantMutation } from "@/features/staff-admin/api/admin.hooks"

interface TenantAccessModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	tenantId: string
	tenantName: string
}

type AccessLevel = "none" | "read_only" | "full"

interface UserSelection {
	userId: string
	accessLevel: AccessLevel
	crossFacility: boolean
	justification: string
}

const SEED_USERS = [
	{ id: "u1", name: "System Admin", email: "system@hpcms.local" },
	{ id: "u2", name: "Tenant Admin", email: "admin@hpcms.local" },
	{ id: "u3", name: "Case Supervisor", email: "supervisor@hpcms.local" },
	{ id: "u4", name: "Case Agent", email: "agent@hpcms.local" },
	{ id: "u5", name: "Clinician", email: "clinician@hpcms.local" },
]

export function TenantAccessModal({
	open,
	onOpenChange,
	tenantId,
	tenantName,
}: TenantAccessModalProps) {
	const [filterQuery, setFilterQuery] = React.useState("")
	const [selections, setSelections] = React.useState<Record<string, UserSelection>>({})

	const { data: usersData } = useAdminUsersQuery({ query: filterQuery })
	const assignMutation = useAssignUserTenantMutation()

	const users = usersData?.items ?? SEED_USERS

	const filteredUsers = users.filter(
		u =>
			u.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
			u.email.toLowerCase().includes(filterQuery.toLowerCase())
	)

	function getSelection(userId: string): UserSelection {
		return (
			selections[userId] ?? {
				userId,
				accessLevel: "none",
				crossFacility: false,
				justification: "",
			}
		)
	}

	function updateSelection(userId: string, patch: Partial<UserSelection>) {
		setSelections(prev => ({
			...prev,
			[userId]: { ...getSelection(userId), ...patch },
		}))
	}

	async function handleSave() {
		const entries = Object.values(selections).filter(s => s.accessLevel !== "none")

		if (entries.length === 0) {
			toast.info("No access changes to save.")
			return
		}

		// Validate cross-facility justifications
		const missingJustification = entries.find(
			e => e.crossFacility && !e.justification.trim()
		)
		if (missingJustification) {
			toast.error("Cross-facility access requires a justification.")
			return
		}

		try {
			for (const entry of entries) {
				await assignMutation.mutateAsync({
					tenantId,
					userId: entry.userId,
					accessLevel: entry.accessLevel,
					crossFacility: entry.crossFacility,
					justification: entry.justification || undefined,
				})
			}
			toast.success("Access assignments saved.")
			onOpenChange(false)
		} catch {
			toast.error("Failed to save access assignments.")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Manage Access — {tenantName}</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					<div>
						<Label htmlFor="user-filter" className="mb-1.5 block text-sm font-medium">
							Filter users
						</Label>
						<Input
							id="user-filter"
							placeholder="Search by name or email…"
							value={filterQuery}
							onChange={e => setFilterQuery(e.target.value)}
						/>
					</div>

					<div className="flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
						{filteredUsers.length === 0 ? (
							<p className="text-muted-foreground py-4 text-center text-sm">No users found.</p>
						) : (
							filteredUsers.map(user => {
								const sel = getSelection(user.id)
								return (
									<div
										key={user.id}
										className="bg-muted/40 flex flex-col gap-2 rounded-lg border p-3"
									>
										<div className="flex items-center justify-between gap-2">
											<div className="min-w-0">
												<p className="truncate text-sm font-medium">{user.name}</p>
												<p className="text-muted-foreground truncate text-xs">{user.email}</p>
											</div>
											<Select
												value={sel.accessLevel}
												onValueChange={(val: AccessLevel | null) => {
													if (val) updateSelection(user.id, { accessLevel: val })
												}}
											>
												<SelectTrigger className="w-32">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="none">None</SelectItem>
													<SelectItem value="read_only">Read-Only</SelectItem>
													<SelectItem value="full">Full</SelectItem>
												</SelectContent>
											</Select>
										</div>

										{sel.accessLevel !== "none" && (
											<div className="flex flex-col gap-2">
												<div className="flex items-center gap-2">
													<Switch
														checked={sel.crossFacility}
														onCheckedChange={val =>
															updateSelection(user.id, { crossFacility: val })
														}
														id={`cf-${user.id}`}
													/>
													<Label htmlFor={`cf-${user.id}`} className="text-sm">
														Cross-facility access
													</Label>
												</div>

												{sel.crossFacility && (
													<div>
														<Label
															htmlFor={`just-${user.id}`}
															className="mb-1 block text-xs font-medium"
														>
															Justification <span className="text-destructive">*</span>
														</Label>
														<Textarea
															id={`just-${user.id}`}
															placeholder="Explain why cross-facility access is required…"
															value={sel.justification}
															onChange={e =>
																updateSelection(user.id, { justification: e.target.value })
															}
															className="min-h-16 text-sm"
														/>
													</div>
												)}
											</div>
										)}
									</div>
								)
							})
						)}
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={assignMutation.isPending}>
						{assignMutation.isPending ? "Saving…" : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
