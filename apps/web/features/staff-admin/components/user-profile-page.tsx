"use client"

import * as React from "react"
import { toast } from "sonner"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"

import {
	useAdminUserQuery,
	useUserSessionsQuery,
	useActivateUserMutation,
	useTerminateSessionMutation,
} from "@/features/staff-admin/api/admin.hooks"

import { UserDeactivationModal } from "./user-deactivation-modal"

interface UserProfilePageProps {
	userId: string
}

function formatDate(value: Date | string | null | undefined): string {
	if (!value) return "Never"
	try {
		return new Date(value).toLocaleString()
	} catch {
		return String(value)
	}
}

function formatRole(role: string): string {
	return role.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
}

export function UserProfilePage({ userId }: UserProfilePageProps) {
	const [deactivateOpen, setDeactivateOpen] = React.useState(false)

	const { data, isLoading } = useAdminUserQuery(userId)
	const { data: sessionsData } = useUserSessionsQuery(userId)
	const activateMutation = useActivateUserMutation()
	const terminateSessionMutation = useTerminateSessionMutation()

	const sessions = sessionsData?.sessions ?? []

	if (isLoading) {
		return (
			<div className="flex flex-col gap-6">
				<div className="flex items-center gap-4">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-5 w-20" />
				</div>
				<div className="grid grid-cols-2 gap-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="flex flex-col gap-1">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-5 w-40" />
						</div>
					))}
				</div>
			</div>
		)
	}

	if (!data) return null

	const status = (data as { status?: string }).status ?? "active"
	const jobTitle = (data as { jobTitle?: string | null }).jobTitle
	const department = (data as { department?: string | null }).department
	const lastLogin = (data as { lastLogin?: Date | string | null }).lastLogin
	const tenants = (data as { tenants?: Array<{ tenantId: string; tenantName: string }> }).tenants ?? []
	const changeHistory = (
		data as {
			changeHistory?: Array<{
				id: string
				field: string
				oldValue: string | null
				newValue: string | null
				changedBy: string
				changedAt: string
				reason: string | null
			}>
		}
	).changeHistory ?? []
	const openCaseCount = (data as { openCaseCount?: number }).openCaseCount ?? 0

	const statusBadge = {
		active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
		pending_activation: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
		inactive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
	}[status as "active" | "pending_activation" | "inactive"] ?? "bg-muted text-muted-foreground"

	const statusLabel = {
		active: "Active",
		pending_activation: "Pending Activation",
		inactive: "Inactive",
	}[status as "active" | "pending_activation" | "inactive"] ?? status

	const sortedHistory = [...changeHistory].sort(
		(a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
	)

	return (
		<div className="flex flex-col gap-8">
			{/* Header */}
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<h1 className="text-2xl font-bold">{data.name}</h1>
					<span
						className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge}`}
					>
						{statusLabel}
					</span>
				</div>

				<div className="flex gap-2">
					{status === "active" && (
						<Button
							variant="destructive"
							size="sm"
							onClick={() => setDeactivateOpen(true)}
						>
							Deactivate
						</Button>
					)}
					{status === "inactive" && (
						<Button
							size="sm"
							disabled={activateMutation.isPending}
							onClick={() => {
								activateMutation.mutate(
									{ userId },
									{
										onSuccess: () => toast.success("User activated"),
										onError: err =>
											toast.error(err instanceof Error ? err.message : "Failed to activate user"),
									}
								)
							}}
						>
							{activateMutation.isPending ? "Activating..." : "Activate"}
						</Button>
					)}
				</div>
			</div>

			{/* Info grid */}
			<div className="grid grid-cols-2 gap-x-8 gap-y-4">
				<div>
					<p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Email</p>
					<p className="mt-0.5 text-sm">{data.email}</p>
				</div>
				<div>
					<p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Role</p>
					<p className="mt-0.5 text-sm">{formatRole(data.role)}</p>
				</div>
				<div>
					<p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
						Job Title
					</p>
					<p className="mt-0.5 text-sm">{jobTitle ?? <span className="text-muted-foreground">—</span>}</p>
				</div>
				<div>
					<p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
						Department
					</p>
					<p className="mt-0.5 text-sm">{department ?? <span className="text-muted-foreground">—</span>}</p>
				</div>
				<div>
					<p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Tenants</p>
					<div className="mt-0.5 flex flex-wrap gap-1">
						{tenants.length === 0 ? (
							<span className="text-muted-foreground text-sm">—</span>
						) : (
							tenants.map(t => (
								<Badge key={t.tenantId} variant="outline" className="text-xs">
									{t.tenantName}
								</Badge>
							))
						)}
					</div>
				</div>
				<div>
					<p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
						Last Login
					</p>
					<p className="mt-0.5 text-sm">{formatDate(lastLogin)}</p>
				</div>
			</div>

			{/* Active Sessions */}
			{sessions.length > 0 && (
				<div className="flex flex-col gap-3">
					<h2 className="text-base font-semibold">Active Sessions</h2>
					<div className="rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>IP Address</TableHead>
									<TableHead>Last Activity</TableHead>
									<TableHead className="w-24" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{sessions.map(session => (
									<TableRow key={session.sessionId}>
										<TableCell className="font-mono text-xs">
											{session.ip ?? "Unknown"}
										</TableCell>
										<TableCell className="text-sm">{session.lastActivity}</TableCell>
										<TableCell>
											<Button
												variant="destructive"
												size="sm"
												disabled={terminateSessionMutation.isPending}
												onClick={() => {
													terminateSessionMutation.mutate(
														{ sessionId: session.sessionId },
														{
															onSuccess: () => toast.success("Session terminated"),
															onError: err =>
																toast.error(
																	err instanceof Error
																		? err.message
																		: "Failed to terminate session"
																),
														}
													)
												}}
											>
												Terminate
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			)}

			{/* Change History */}
			{sortedHistory.length > 0 && (
				<div className="flex flex-col gap-3">
					<h2 className="text-base font-semibold">Change History</h2>
					<div className="flex flex-col gap-2">
						{sortedHistory.map(item => (
							<div key={item.id} className="rounded-lg border px-4 py-3 text-sm">
								<div className="flex items-start justify-between gap-2">
									<div className="flex flex-col gap-0.5">
										<span className="font-medium capitalize">{item.field.replace(/_/g, " ")}</span>
										<span className="text-muted-foreground">
											{item.oldValue ?? "—"} → {item.newValue ?? "—"}
										</span>
										{item.reason && (
											<span className="text-muted-foreground text-xs">
												Reason: {item.reason}
											</span>
										)}
									</div>
									<div className="text-muted-foreground shrink-0 text-right text-xs">
										<div>{item.changedBy}</div>
										<div>{formatDate(item.changedAt)}</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Deactivation modal */}
			{status === "active" && (
				<UserDeactivationModal
					open={deactivateOpen}
					onOpenChange={setDeactivateOpen}
					userId={userId}
					userName={data.name}
					openCaseCount={openCaseCount}
					activeSessions={sessions.map(s => ({
						sessionId: s.sessionId,
						ip: s.ip,
						lastActivity: s.lastActivity,
					}))}
				/>
			)}
		</div>
	)
}
