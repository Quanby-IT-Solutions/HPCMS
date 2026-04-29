"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { StaffUser } from "@repo/contracts"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/core/components/ui/dialog"
import { Input } from "@/core/components/ui/input"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { UserPlus } from "@/core/components/icons"
import { setTenantOverride } from "@/services/orpc/client"
import { useInviteUserMutation, useSetUserRoleMutation, useUsersQuery } from "../api/admin.hooks"

const ROLE_OPTIONS = [
	"patient",
	"case_agent",
	"case_supervisor",
	"tenant_admin",
	"system_admin",
	"clinician",
] as const

type UserRole = (typeof ROLE_OPTIONS)[number]

interface UsersTableProps {
	currentUserRole: string
	currentTenantId?: string | null
}

export function UsersTable({ currentUserRole, currentTenantId }: UsersTableProps) {
	const [query, setQuery] = useState("")
	const [inviteOpen, setInviteOpen] = useState(false)
	const [inviteEmail, setInviteEmail] = useState("")
	const [inviteRole, setInviteRole] = useState<UserRole>("case_agent")
	const [tenantOverride, setTenantOverrideState] = useState<string>("")

	const { data, isLoading } = useUsersQuery({ query: query || undefined })
	const { mutateAsync: inviteUser, isPending: inviting } = useInviteUserMutation()
	const { mutateAsync: setRole } = useSetUserRoleMutation()

	async function handleInvite() {
		try {
			await inviteUser({ email: inviteEmail, role: inviteRole })
			toast.success(`Invited ${inviteEmail}`)
			setInviteOpen(false)
			setInviteEmail("")
		} catch {
			toast.error("Failed to invite user")
		}
	}

	async function handleRoleChange(userId: string, role: UserRole) {
		try {
			await setRole({ userId, role })
			toast.success("Role updated")
		} catch {
			toast.error("Failed to update role")
		}
	}

	function handleTenantOverride(value: string) {
		setTenantOverrideState(value)
		setTenantOverride(value.trim() || null)
	}

	if (isLoading) {
		return (
			<div className="flex flex-col gap-2">
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className="h-12 w-full" />
				))}
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<Input
						placeholder="Search users…"
						value={query}
						onChange={e => setQuery(e.target.value)}
						className="w-64"
					/>
					{currentUserRole === "system_admin" && (
						<Input
							placeholder="Tenant ID override (system_admin)"
							value={tenantOverride}
							onChange={e => handleTenantOverride(e.target.value)}
							className="w-64 font-mono text-xs"
						/>
					)}
				</div>

				<Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
					<DialogTrigger render={<Button size="sm" />}>
						<UserPlus className="mr-1 size-4" />
						Invite User
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Invite User</DialogTitle>
						</DialogHeader>
						<div className="flex flex-col gap-3">
							<Input
								type="email"
								placeholder="Email address"
								value={inviteEmail}
								onChange={e => setInviteEmail(e.target.value)}
							/>
							<select
								className="border-input h-8 rounded-md border px-2 text-sm"
								value={inviteRole}
								onChange={e => setInviteRole(e.target.value as UserRole)}
							>
								{ROLE_OPTIONS.map(r => (
									<option key={r} value={r}>
										{r.replace(/_/g, " ")}
									</option>
								))}
							</select>
						</div>
						<DialogFooter>
							<DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
							<Button disabled={!inviteEmail.trim() || inviting} onClick={handleInvite}>
								{inviting ? "Inviting…" : "Send Invite"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Verified</TableHead>
						<TableHead>Joined</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{(data?.items ?? []).length === 0 ? (
						<TableRow>
							<TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
								No users found
							</TableCell>
						</TableRow>
					) : (
						(data?.items ?? []).map((user: StaffUser) => (
							<TableRow key={user.id}>
								<TableCell className="font-medium">{user.name}</TableCell>
								<TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
								<TableCell>
									<select
										className="border-input h-7 rounded border px-1.5 text-xs"
										value={user.role}
										onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
									>
										{ROLE_OPTIONS.map(r => (
											<option key={r} value={r}>
												{r.replace(/_/g, " ")}
											</option>
										))}
									</select>
								</TableCell>
								<TableCell>
									<Badge variant={user.emailVerified ? "default" : "outline"}>
										{user.emailVerified ? "Verified" : "Pending"}
									</Badge>
								</TableCell>
								<TableCell className="text-muted-foreground text-xs">
									{new Date(user.createdAt).toLocaleDateString()}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			{(data?.total ?? 0) > (data?.limit ?? 20) && (
				<p className="text-muted-foreground text-sm">
					Showing {data?.items.length} of {data?.total} users
				</p>
			)}
		</div>
	)
}
