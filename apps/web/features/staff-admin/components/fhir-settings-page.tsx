"use client"

import * as React from "react"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Card, CardContent } from "@/core/components/ui/card"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Spinner } from "@/core/components/ui/spinner"
import {
	useAuditLogsQuery,
	useFhirOAuthQuery,
	useFhirPermissionsQuery,
	useFhirTestConnectionMutation,
	useUpdateFhirOAuthMutation,
	useUpdateFhirPermissionsMutation,
} from "@/features/staff-admin/api/admin.hooks"

import { AdminDataTable } from "./admin-data-table"
import { PermissionMatrix } from "./permission-matrix"
import { SettingsTabs } from "./settings-tabs"

// ─── Resource Permissions Tab ─────────────────────────────────────────────────

function ResourcePermissionsTab() {
	const { data } = useFhirPermissionsQuery()
	const updateMutation = useUpdateFhirPermissionsMutation()

	const permissions = data?.permissions ?? []
	const resourceTypes = React.useMemo(() => permissions.map(p => p.resourceType), [permissions])

	const initialValues = React.useMemo(() => {
		const read: Record<string, boolean> = {}
		const write: Record<string, boolean> = {}
		for (const p of permissions) {
			read[p.resourceType] = p.read
			write[p.resourceType] = p.write
		}
		return { read, write }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const [localValues, setLocalValues] = React.useState<Record<string, Record<string, boolean>>>(initialValues)
	const [savedAt, setSavedAt] = React.useState<string | null>(null)

	React.useEffect(() => {
		setLocalValues(initialValues)
	}, [initialValues])

	function handleChange(diffs: { role: string; permKey: string; enabled: boolean }[]) {
		setLocalValues(prev => {
			const next = { ...prev }
			for (const diff of diffs) {
				next[diff.role] = { ...next[diff.role], [diff.permKey]: diff.enabled }
			}
			return next
		})
	}

	function applyReadOnlyPreset() {
		setLocalValues(prev => {
			const writeObj: Record<string, boolean> = {}
			for (const rt of resourceTypes) {
				writeObj[rt] = false
			}
			return { ...prev, write: writeObj }
		})
	}

	function handleSave() {
		const permsArray = resourceTypes.map(rt => ({
			resourceType: rt,
			read: localValues["read"]?.[rt] ?? false,
			write: localValues["write"]?.[rt] ?? false,
		}))
		updateMutation.mutate(
			{ permissions: permsArray },
			{
				onSuccess: () => {
					const now = new Date()
					setSavedAt(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`)
				},
			}
		)
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<p className="text-muted-foreground text-sm">
						Configure which FHIR resource types can be read or written.
					</p>
					<Button variant="outline" size="sm" onClick={applyReadOnlyPreset}>
						Read-only mode preset
					</Button>
				</div>
				{resourceTypes.length > 0 && (
					<PermissionMatrix
						permKeys={resourceTypes}
						roles={["read", "write"]}
						values={localValues}
						readOnlyRoles={[]}
						onChange={handleChange}
					/>
				)}
			</div>

			<div className="flex items-center gap-3 border-t pt-4">
				<Button onClick={handleSave} disabled={updateMutation.isPending}>
					{updateMutation.isPending && <Spinner className="mr-1.5" />}
					Save Permissions
				</Button>
				{savedAt && (
					<span className="text-muted-foreground text-sm">Saved at {savedAt}</span>
				)}
			</div>
		</div>
	)
}

// ─── OAuth Settings Tab ───────────────────────────────────────────────────────

function OAuthSettingsTab() {
	const { data } = useFhirOAuthQuery()
	const updateMutation = useUpdateFhirOAuthMutation()

	const [authServerUrl, setAuthServerUrl] = React.useState("")
	const [clientId, setClientId] = React.useState("")
	const [newClientSecret, setNewClientSecret] = React.useState("")
	const [revealMasked, setRevealMasked] = React.useState(false)
	const [allowedScopes, setAllowedScopes] = React.useState("")
	const [tokenExpiry, setTokenExpiry] = React.useState(3600)
	const [refreshExpiry, setRefreshExpiry] = React.useState(86400)
	const [savedAt, setSavedAt] = React.useState<string | null>(null)

	React.useEffect(() => {
		if (!data) return
		setAuthServerUrl(data.authServerUrl)
		setClientId(data.clientId)
		setAllowedScopes(data.allowedScopes.join(", "))
		setTokenExpiry(data.tokenExpirySeconds)
		setRefreshExpiry(data.refreshExpirySeconds)
	}, [data])

	function handleSave() {
		const payload: {
			authServerUrl: string
			clientId: string
			allowedScopes: string[]
			tokenExpirySeconds: number
			refreshExpirySeconds: number
			clientSecret?: string
		} = {
			authServerUrl,
			clientId,
			allowedScopes: allowedScopes.split(",").map(s => s.trim()).filter(Boolean),
			tokenExpirySeconds: tokenExpiry,
			refreshExpirySeconds: refreshExpiry,
		}
		if (newClientSecret.length > 0) {
			payload.clientSecret = newClientSecret
		}
		updateMutation.mutate(payload, {
			onSuccess: () => {
				const now = new Date()
				setSavedAt(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`)
				setNewClientSecret("")
			},
		})
	}

	const scopeChips = allowedScopes.split(",").map(s => s.trim()).filter(Boolean)

	return (
		<div className="flex flex-col gap-4">
			<div className="grid gap-3">
				<div className="flex flex-col gap-1.5">
					<Label>SMART Auth Server URL</Label>
					<Input
						value={authServerUrl}
						onChange={e => setAuthServerUrl(e.target.value)}
						placeholder="https://fhir.example.com/oauth2"
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label>Client ID</Label>
					<Input
						value={clientId}
						onChange={e => setClientId(e.target.value)}
						placeholder="client-id"
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label>Client Secret</Label>
					<div className="flex items-center gap-2">
						<div className="flex-1 font-mono text-sm border rounded-md px-3 py-2 bg-muted/40 tracking-widest">
							{revealMasked
								? (data?.clientSecretMasked ?? "••••••••")
								: "••••••••"}
						</div>
						<Button
							variant="outline"
							size="sm"
							type="button"
							onClick={() => setRevealMasked(v => !v)}
						>
							{revealMasked ? "Hide" : "Reveal"}
						</Button>
					</div>
					<Input
						value={newClientSecret}
						onChange={e => setNewClientSecret(e.target.value)}
						placeholder="Enter new secret to change"
						type="password"
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label>Allowed Scopes (comma-separated)</Label>
					<Input
						value={allowedScopes}
						onChange={e => setAllowedScopes(e.target.value)}
						placeholder="openid, fhirUser, launch/patient"
					/>
					{scopeChips.length > 0 && (
						<div className="flex flex-wrap gap-1 mt-1">
							{scopeChips.map(scope => (
								<Badge key={scope} variant="secondary">{scope}</Badge>
							))}
						</div>
					)}
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="flex flex-col gap-1.5">
						<Label>Token Expiry (seconds)</Label>
						<Input
							type="number"
							value={tokenExpiry}
							onChange={e => setTokenExpiry(Number(e.target.value))}
							min={0}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label>Refresh Expiry (seconds)</Label>
						<Input
							type="number"
							value={refreshExpiry}
							onChange={e => setRefreshExpiry(Number(e.target.value))}
							min={0}
						/>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-3 border-t pt-4">
				<Button onClick={handleSave} disabled={updateMutation.isPending}>
					{updateMutation.isPending && <Spinner className="mr-1.5" />}
					Save OAuth Settings
				</Button>
				{savedAt && (
					<span className="text-muted-foreground text-sm">Saved at {savedAt}</span>
				)}
			</div>
		</div>
	)
}

// ─── Connection Status Tab ────────────────────────────────────────────────────

function ConnectionStatusTab() {
	const testMutation = useFhirTestConnectionMutation()
	const [lastTestedAt, setLastTestedAt] = React.useState<string | null>(null)

	function handleTest() {
		testMutation.mutate(undefined, {
			onSettled: () => {
				setLastTestedAt(new Date().toLocaleTimeString())
			},
		})
	}

	const result = testMutation.data

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-3">
				<Button onClick={handleTest} disabled={testMutation.isPending}>
					{testMutation.isPending && <Spinner className="mr-1.5" />}
					Test Connection
				</Button>
				{lastTestedAt && (
					<span className="text-muted-foreground text-sm">Last tested: {lastTestedAt}</span>
				)}
			</div>

			{result && (
				<Card>
					<CardContent className="pt-4 flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<Badge variant={result.success ? "default" : "destructive"}>
								{result.success ? "Success" : "Failed"}
							</Badge>
							{result.status !== null && (
								<span className="text-sm font-medium">HTTP {result.status}</span>
							)}
							{result.responseTimeMs !== null && (
								<span className="text-muted-foreground text-sm">{result.responseTimeMs}ms</span>
							)}
						</div>
						{result.errorDetail && (
							<p className="text-destructive text-sm">{result.errorDetail}</p>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	)
}

// ─── Audit Log Tab ────────────────────────────────────────────────────────────

interface AuditLogRow {
	id: number
	actionKey: string
	actorUserId: string | null
	createdAt: Date
}

function AuditLogTab() {
	const { data, isLoading } = useAuditLogsQuery({ targetType: "fhir_settings" })

	const rows: AuditLogRow[] = (data?.items ?? []).map(item => ({
		id: item.id,
		actionKey: item.actionKey,
		actorUserId: item.actorUserId,
		createdAt: item.createdAt,
	}))

	return (
		<AdminDataTable
			columns={[
				{
					key: "actionKey",
					header: "Action",
					render: row => row.actionKey,
				},
				{
					key: "actorUserId",
					header: "Actor",
					render: row => row.actorUserId ?? "—",
				},
				{
					key: "createdAt",
					header: "Date",
					render: row => new Date(row.createdAt).toLocaleString(),
				},
			]}
			rows={rows}
			isLoading={isLoading}
			emptyMessage="No audit log entries found."
		/>
	)
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function FhirSettingsPage() {
	return (
		<SettingsTabs
			tabs={[
				{
					key: "resource-permissions",
					label: "Resource Permissions",
					content: <ResourcePermissionsTab />,
				},
				{
					key: "oauth-settings",
					label: "OAuth Settings",
					content: <OAuthSettingsTab />,
				},
				{
					key: "connection-status",
					label: "Connection Status",
					content: <ConnectionStatusTab />,
				},
				{
					key: "audit-log",
					label: "Audit Log",
					content: <AuditLogTab />,
				},
			]}
		/>
	)
}
