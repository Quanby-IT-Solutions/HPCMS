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
	DialogDescription,
	DialogClose,
} from "@/core/components/ui/dialog"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Switch } from "@/core/components/ui/switch"
import { Checkbox } from "@/core/components/ui/checkbox"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import {
	useSecurityPolicyQuery,
	useUpdateSecurityPolicyMutation,
	useActiveSessionsQuery,
	useTerminateSessionMutation,
	useResetMfaMutation,
} from "@/features/staff-admin/api/admin.hooks"
import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { SettingsTabs } from "@/features/staff-admin/components/settings-tabs"

const ALL_ROLES = [
	"system_admin",
	"tenant_admin",
	"case_supervisor",
	"case_agent",
	"clinician",
	"patient",
] as const

type Role = (typeof ALL_ROLES)[number]

function formatRole(role: string): string {
	return role
		.split("_")
		.map(p => p.charAt(0).toUpperCase() + p.slice(1))
		.join(" ")
}

type MfaEnforcement = "required" | "optional" | "disabled"
type MfaMethod = "sms" | "totp" | "email"

// ─── Audit confirm dialog ──────────────────────────────────────────────────────

interface AuditConfirmDialogProps {
	open: boolean
	onConfirm: () => void
	onCancel: () => void
}

function AuditConfirmDialog({ open, onConfirm, onCancel }: AuditConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={o => { if (!o) onCancel() }}>
			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>Confirm Change</DialogTitle>
					<DialogDescription>
						This change will be recorded in the audit log. Proceed?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose render={<Button variant="outline" onClick={onCancel} />}>Cancel</DialogClose>
					<Button onClick={onConfirm}>Proceed</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

// ─── Tab 1: Password Policy ────────────────────────────────────────────────────

interface PasswordForm {
	minLength: number
	requireUpper: boolean
	requireLower: boolean
	requireDigit: boolean
	requireSymbol: boolean
	expirationDays: number | null
	reuseHistoryCount: number
}

function PasswordPolicyTab() {
	const query = useSecurityPolicyQuery()
	const updatePolicy = useUpdateSecurityPolicyMutation()
	const [form, setForm] = React.useState<PasswordForm>({
		minLength: 12,
		requireUpper: true,
		requireLower: true,
		requireDigit: true,
		requireSymbol: true,
		expirationDays: 90,
		reuseHistoryCount: 5,
	})
	const [savedAt, setSavedAt] = React.useState<string | null>(null)
	const [auditOpen, setAuditOpen] = React.useState(false)

	React.useEffect(() => {
		if (query.data?.passwordPolicy) {
			const pp = query.data.passwordPolicy
			setForm({
				minLength: pp.minLength,
				requireUpper: pp.requireUpper,
				requireLower: pp.requireLower,
				requireDigit: pp.requireDigit,
				requireSymbol: pp.requireSymbol,
				expirationDays: pp.expirationDays,
				reuseHistoryCount: pp.reuseHistoryCount,
			})
		}
	}, [query.data])

	async function doSave() {
		await updatePolicy.mutateAsync({ tab: "password", passwordPolicy: form })
		const now = new Date()
		setSavedAt(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`)
	}

	return (
		<>
			<AuditConfirmDialog
				open={auditOpen}
				onConfirm={async () => {
					setAuditOpen(false)
					await doSave()
				}}
				onCancel={() => setAuditOpen(false)}
			/>
			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1">
						<Label htmlFor="min-length">Minimum Length</Label>
						<Input
							id="min-length"
							type="number"
							min={8}
							max={64}
							value={form.minLength}
							onChange={e => setForm(f => ({ ...f, minLength: Number(e.target.value) }))}
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="reuse-count">Reuse History Count</Label>
						<Input
							id="reuse-count"
							type="number"
							min={0}
							max={24}
							value={form.reuseHistoryCount}
							onChange={e => setForm(f => ({ ...f, reuseHistoryCount: Number(e.target.value) }))}
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="expiry-days">Expiration Days</Label>
						<Input
							id="expiry-days"
							type="number"
							placeholder="Never"
							value={form.expirationDays ?? ""}
							onChange={e =>
								setForm(f => ({
									...f,
									expirationDays: e.target.value === "" ? null : Number(e.target.value),
								}))
							}
						/>
					</div>
				</div>

				<div className="space-y-3">
					{(
						[
							{ key: "requireUpper" as const, label: "Require uppercase" },
							{ key: "requireLower" as const, label: "Require lowercase" },
							{ key: "requireDigit" as const, label: "Require digit" },
							{ key: "requireSymbol" as const, label: "Require symbol" },
						] as { key: keyof Pick<PasswordForm, "requireUpper" | "requireLower" | "requireDigit" | "requireSymbol">; label: string }[]
					).map(({ key, label }) => (
						<div key={key} className="flex items-center gap-3">
							<Switch
								checked={form[key]}
								onCheckedChange={v => setForm(f => ({ ...f, [key]: v }))}
							/>
							<Label>{label}</Label>
						</div>
					))}
				</div>
			</div>

			<div className="mt-4 flex items-center gap-3 border-t pt-4">
				<Button
					size="sm"
					onClick={() => setAuditOpen(true)}
					disabled={updatePolicy.isPending}
				>
					{updatePolicy.isPending ? "Saving…" : "Save Password Policy"}
				</Button>
				{savedAt && (
					<span className="text-muted-foreground text-sm">Saved at {savedAt}</span>
				)}
			</div>
		</>
	)
}

// ─── Tab 2: Session Policy ─────────────────────────────────────────────────────

function SessionPolicyTab() {
	const query = useSecurityPolicyQuery()
	const updatePolicy = useUpdateSecurityPolicyMutation()
	const [idleTimeouts, setIdleTimeouts] = React.useState<Record<string, number>>({})
	const [warningOffset, setWarningOffset] = React.useState(5)
	const [forceLogout, setForceLogout] = React.useState(true)
	const [savedAt, setSavedAt] = React.useState<string | null>(null)
	const [auditOpen, setAuditOpen] = React.useState(false)

	React.useEffect(() => {
		if (query.data?.sessionPolicy) {
			const sp = query.data.sessionPolicy
			setIdleTimeouts(sp.idleTimeoutMinutes)
			setWarningOffset(sp.warningBannerOffsetMinutes)
			setForceLogout(sp.forceLogoutIdle)
		}
	}, [query.data])

	async function doSave() {
		await updatePolicy.mutateAsync({
			tab: "session",
			sessionPolicy: {
				idleTimeoutMinutes: idleTimeouts,
				warningBannerOffsetMinutes: warningOffset,
				forceLogoutIdle: forceLogout,
			},
		})
		const now = new Date()
		setSavedAt(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`)
	}

	const displayRoles = ALL_ROLES.filter(r => r !== "patient")

	return (
		<>
			<AuditConfirmDialog
				open={auditOpen}
				onConfirm={async () => {
					setAuditOpen(false)
					await doSave()
				}}
				onCancel={() => setAuditOpen(false)}
			/>
			<div className="space-y-4">
				<div>
					<p className="text-sm font-medium mb-2">Idle Timeout per Role (minutes)</p>
					<div className="rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Role</TableHead>
									<TableHead className="w-40">Timeout (min)</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{displayRoles.map(role => (
									<TableRow key={role}>
										<TableCell>{formatRole(role)}</TableCell>
										<TableCell>
											<Input
												type="number"
												min={1}
												className="h-8 w-28"
												value={idleTimeouts[role] ?? ""}
												onChange={e =>
													setIdleTimeouts(prev => ({ ...prev, [role]: Number(e.target.value) }))
												}
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1">
						<Label htmlFor="warning-offset">Warning Banner Offset (minutes)</Label>
						<Input
							id="warning-offset"
							type="number"
							min={1}
							value={warningOffset}
							onChange={e => setWarningOffset(Number(e.target.value))}
						/>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Switch checked={forceLogout} onCheckedChange={setForceLogout} />
					<Label>Force logout on idle</Label>
				</div>
			</div>

			<div className="mt-4 flex items-center gap-3 border-t pt-4">
				<Button size="sm" onClick={() => setAuditOpen(true)} disabled={updatePolicy.isPending}>
					{updatePolicy.isPending ? "Saving…" : "Save Session Policy"}
				</Button>
				{savedAt && (
					<span className="text-muted-foreground text-sm">Saved at {savedAt}</span>
				)}
			</div>
		</>
	)
}

// ─── Tab 3: MFA Policy ────────────────────────────────────────────────────────

function MfaPolicyTab() {
	const query = useSecurityPolicyQuery()
	const updatePolicy = useUpdateSecurityPolicyMutation()
	const [enforcement, setEnforcement] = React.useState<Record<string, MfaEnforcement>>({})
	const [allowedMethods, setAllowedMethods] = React.useState<MfaMethod[]>(["totp", "email"])
	const [savedAt, setSavedAt] = React.useState<string | null>(null)
	const [auditOpen, setAuditOpen] = React.useState(false)

	React.useEffect(() => {
		if (query.data?.mfaPolicy) {
			setEnforcement(query.data.mfaPolicy.enforcement as Record<string, MfaEnforcement>)
			setAllowedMethods(query.data.mfaPolicy.allowedMethods as MfaMethod[])
		}
	}, [query.data])

	function toggleMethod(method: MfaMethod) {
		setAllowedMethods(prev =>
			prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
		)
	}

	async function doSave() {
		await updatePolicy.mutateAsync({
			tab: "mfa",
			mfaPolicy: { enforcement, allowedMethods },
		})
		const now = new Date()
		setSavedAt(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`)
	}

	const displayRoles = ALL_ROLES.filter(r => r !== "patient")

	return (
		<>
			<AuditConfirmDialog
				open={auditOpen}
				onConfirm={async () => {
					setAuditOpen(false)
					await doSave()
				}}
				onCancel={() => setAuditOpen(false)}
			/>
			<div className="space-y-4">
				<div>
					<p className="text-sm font-medium mb-2">MFA Enforcement per Role</p>
					<div className="grid gap-2">
						{displayRoles.map(role => (
							<div key={role} className="flex items-center justify-between gap-4">
								<span className="text-sm">{formatRole(role)}</span>
								<Select
									value={enforcement[role] ?? "optional"}
									onValueChange={v =>
										setEnforcement(prev => ({ ...prev, [role]: v as MfaEnforcement }))
									}
								>
									<SelectTrigger size="sm" className="w-36">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="required">Required</SelectItem>
										<SelectItem value="optional">Optional</SelectItem>
										<SelectItem value="disabled">Disabled</SelectItem>
									</SelectContent>
								</Select>
							</div>
						))}
					</div>
				</div>

				<div>
					<p className="text-sm font-medium mb-2">Allowed Methods</p>
					<div className="flex gap-6">
						{(["sms", "totp", "email"] as MfaMethod[]).map(method => (
							<div key={method} className="flex items-center gap-2">
								<Checkbox
									id={`method-${method}`}
									checked={allowedMethods.includes(method)}
									onCheckedChange={() => toggleMethod(method)}
								/>
								<Label htmlFor={`method-${method}`}>{method.toUpperCase()}</Label>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="mt-4 flex items-center gap-3 border-t pt-4">
				<Button size="sm" onClick={() => setAuditOpen(true)} disabled={updatePolicy.isPending}>
					{updatePolicy.isPending ? "Saving…" : "Save MFA Policy"}
				</Button>
				{savedAt && (
					<span className="text-muted-foreground text-sm">Saved at {savedAt}</span>
				)}
			</div>
		</>
	)
}

// ─── Tab 4: Concurrent Sessions ───────────────────────────────────────────────

interface ActiveSession {
	id: string
	sessionId: string
	userId: string
	userName: string
	role: string
	ip: string | null
	lastActivity: string
}

function ConcurrencyTab() {
	const query = useSecurityPolicyQuery()
	const updatePolicy = useUpdateSecurityPolicyMutation()
	const sessionsQuery = useActiveSessionsQuery()
	const terminateSession = useTerminateSessionMutation()
	const resetMfa = useResetMfaMutation()

	const [maxSessions, setMaxSessions] = React.useState<Record<string, number>>({})
	const [singleSessionRoles, setSingleSessionRoles] = React.useState<string[]>([])
	const [savedAt, setSavedAt] = React.useState<string | null>(null)
	const [auditOpen, setAuditOpen] = React.useState(false)

	React.useEffect(() => {
		if (query.data?.concurrencyPolicy) {
			setMaxSessions(query.data.concurrencyPolicy.maxSessionsPerRole)
			setSingleSessionRoles(query.data.concurrencyPolicy.singleSessionRoles)
		}
	}, [query.data])

	function toggleSingleSession(role: string) {
		setSingleSessionRoles(prev =>
			prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
		)
	}

	async function doSave() {
		await updatePolicy.mutateAsync({
			tab: "concurrency",
			concurrencyPolicy: {
				maxSessionsPerRole: maxSessions,
				singleSessionRoles,
			},
		})
		const now = new Date()
		setSavedAt(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`)
	}

	const displayRoles = ALL_ROLES.filter(r => r !== "patient")
	const elevatedRoles: Role[] = ["system_admin", "tenant_admin", "case_supervisor"]

	// Map sessions to include an `id` field for AdminDataTable
	const sessions: ActiveSession[] = (sessionsQuery.data?.sessions ?? []).map(s => ({
		id: s.sessionId,
		...s,
	}))

	const sessionColumns = [
		{
			key: "userName",
			header: "User",
			render: (row: ActiveSession) => row.userName,
			sortable: true,
		},
		{
			key: "role",
			header: "Role",
			render: (row: ActiveSession) => formatRole(row.role),
			sortable: true,
		},
		{
			key: "ip",
			header: "IP",
			render: (row: ActiveSession) => row.ip ?? "—",
		},
		{
			key: "lastActivity",
			header: "Last Activity",
			render: (row: ActiveSession) => row.lastActivity,
			sortable: true,
		},
	]

	const sessionActions = [
		{
			label: "Terminate",
			variant: "destructive" as const,
			onClick: (row: ActiveSession) => {
				terminateSession.mutate({ sessionId: row.sessionId })
				toast.success(`Session for ${row.userName} terminated`)
			},
		},
		{
			label: "Reset MFA",
			onClick: (row: ActiveSession) => {
				resetMfa.mutate({ userId: row.userId })
				toast.success(`MFA reset for ${row.userName}`)
			},
		},
	]

	return (
		<>
			<AuditConfirmDialog
				open={auditOpen}
				onConfirm={async () => {
					setAuditOpen(false)
					await doSave()
				}}
				onCancel={() => setAuditOpen(false)}
			/>
			<div className="space-y-4">
				<div>
					<p className="text-sm font-medium mb-2">Max Sessions per Role</p>
					<div className="rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Role</TableHead>
									<TableHead className="w-40">Max Sessions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{displayRoles.map(role => (
									<TableRow key={role}>
										<TableCell>{formatRole(role)}</TableCell>
										<TableCell>
											<Input
												type="number"
												min={1}
												className="h-8 w-28"
												value={maxSessions[role] ?? ""}
												onChange={e =>
													setMaxSessions(prev => ({ ...prev, [role]: Number(e.target.value) }))
												}
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>

				<div>
					<p className="text-sm font-medium mb-2">Single-Session Roles</p>
					<div className="flex flex-wrap gap-4">
						{elevatedRoles.map(role => (
							<div key={role} className="flex items-center gap-2">
								<Checkbox
									id={`single-${role}`}
									checked={singleSessionRoles.includes(role)}
									onCheckedChange={() => toggleSingleSession(role)}
								/>
								<Label htmlFor={`single-${role}`}>{formatRole(role)}</Label>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="mt-4 flex items-center gap-3 border-t pt-4">
				<Button size="sm" onClick={() => setAuditOpen(true)} disabled={updatePolicy.isPending}>
					{updatePolicy.isPending ? "Saving…" : "Save Concurrency Policy"}
				</Button>
				{savedAt && (
					<span className="text-muted-foreground text-sm">Saved at {savedAt}</span>
				)}
			</div>

			<div className="mt-6">
				<p className="text-sm font-medium mb-3">Active Sessions</p>
				<AdminDataTable
					columns={sessionColumns}
					rows={sessions}
					rowActions={sessionActions}
					isLoading={sessionsQuery.isLoading}
					emptyMessage="No active sessions."
				/>
			</div>
		</>
	)
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SecuritySettingsPage() {
	const tabs = [
		{
			key: "password",
			label: "Password Policy",
			content: <PasswordPolicyTab />,
		},
		{
			key: "session",
			label: "Session Policy",
			content: <SessionPolicyTab />,
		},
		{
			key: "mfa",
			label: "MFA Policy",
			content: <MfaPolicyTab />,
		},
		{
			key: "concurrency",
			label: "Concurrent Sessions",
			content: <ConcurrencyTab />,
		},
	]

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-xl font-semibold">Security Settings</h1>
				<p className="text-muted-foreground text-sm">
					Configure password, session, MFA, and concurrency policies.
				</p>
			</div>
			<SettingsTabs tabs={tabs} defaultTab="password" />
		</div>
	)
}
