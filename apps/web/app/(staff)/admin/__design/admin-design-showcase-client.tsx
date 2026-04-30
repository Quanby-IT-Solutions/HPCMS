"use client"

import * as React from "react"

import { AdminDataTable } from "@/features/staff-admin/components/admin-data-table"
import { AdminWizard } from "@/features/staff-admin/components/admin-wizard"
import { PermissionMatrix } from "@/features/staff-admin/components/permission-matrix"
import type { PermissionDiff } from "@/features/staff-admin/components/permission-matrix"
import { RuleBuilder } from "@/features/staff-admin/components/rule-builder"
import type { Rule } from "@/features/staff-admin/components/rule-builder"
import { SettingsTabs } from "@/features/staff-admin/components/settings-tabs"

import { Button } from "@/core/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Input } from "@/core/components/ui/input"

interface SampleRow {
	id: number
	name: string
	status: "active" | "inactive" | "pending"
}

const SAMPLE_ROWS: SampleRow[] = [
	{ id: 1, name: "Maria Santos", status: "active" },
	{ id: 2, name: "Juan dela Cruz", status: "pending" },
	{ id: 3, name: "Ana Reyes", status: "inactive" },
]

const STATUS_BADGE: Record<SampleRow["status"], string> = {
	active: "bg-green-100 text-green-800",
	inactive: "bg-gray-100 text-gray-600",
	pending: "bg-yellow-100 text-yellow-800",
}

function DataTableDemo() {
	const [search, setSearch] = React.useState("")
	const [page, setPage] = React.useState(1)

	const filtered = SAMPLE_ROWS.filter(r =>
		r.name.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<AdminDataTable<SampleRow>
			columns={[
				{ key: "id", header: "ID", render: r => r.id },
				{ key: "name", header: "Name", render: r => r.name, sortable: true },
				{
					key: "status",
					header: "Status",
					render: r => (
						<span
							className={[
								"rounded-full px-2 py-0.5 text-xs font-medium capitalize",
								STATUS_BADGE[r.status],
							].join(" ")}
						>
							{r.status}
						</span>
					),
				},
			]}
			rows={filtered}
			totalCount={filtered.length}
			page={page}
			pageSize={10}
			onPageChange={setPage}
			searchValue={search}
			onSearchChange={setSearch}
			rowActions={[
				{ label: "Edit", onClick: r => alert(`Edit ${r.name}`) },
				{ label: "Delete", onClick: r => alert(`Delete ${r.name}`), variant: "destructive" },
			]}
		/>
	)
}

function WizardDemo() {
	const [name, setName] = React.useState("")
	const [finishing, setFinishing] = React.useState(false)
	const [done, setDone] = React.useState(false)

	if (done) {
		return (
			<div className="flex flex-col items-center gap-3 py-8">
				<p className="text-sm font-medium text-green-700">Wizard completed for: {name}</p>
				<Button variant="outline" size="sm" onClick={() => { setDone(false); setName("") }}>
					Reset
				</Button>
			</div>
		)
	}

	return (
		<AdminWizard
			steps={[
				{
					title: "Basic Info",
					validator: () => name.trim().length > 0,
					content: (
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium" htmlFor="wizard-name">
								Name
							</label>
							<Input
								id="wizard-name"
								placeholder="Enter your name"
								value={name}
								onChange={e => setName(e.target.value)}
							/>
							{name.trim().length === 0 && (
								<p className="text-destructive text-xs">Name is required to proceed.</p>
							)}
						</div>
					),
				},
				{
					title: "Summary",
					content: (
						<div className="flex flex-col gap-1">
							<p className="text-sm">Review your information before finishing.</p>
							<p className="text-muted-foreground text-sm">
								Name: <span className="text-foreground font-medium">{name}</span>
							</p>
						</div>
					),
				},
			]}
			onFinish={() => {
				setFinishing(true)
				setTimeout(() => { setFinishing(false); setDone(true) }, 1200)
			}}
			isFinishing={finishing}
		/>
	)
}

function RuleBuilderDemo() {
	const [rule, setRule] = React.useState<Rule>({
		conditions: [{ field: "case_type", operator: "equals", value: "consultation" }],
		action: { type: "assign_team", value: "triage-team" },
	})

	return (
		<div className="flex flex-col gap-3">
			<RuleBuilder value={rule} onChange={setRule} />
			<details className="text-xs">
				<summary className="text-muted-foreground cursor-pointer select-none">
					Current rule JSON
				</summary>
				<pre className="bg-muted mt-1 overflow-auto rounded p-2 text-xs">
					{JSON.stringify(rule, null, 2)}
				</pre>
			</details>
		</div>
	)
}

function PermissionMatrixDemo() {
	const [diffs, setDiffs] = React.useState<PermissionDiff[]>([])

	return (
		<div className="flex flex-col gap-3">
			<PermissionMatrix
				permKeys={["case.create", "case.edit", "case.delete", "report.view"]}
				roles={["admin", "supervisor", "agent"]}
				values={{
					admin: { "case.create": true, "case.edit": true, "case.delete": true, "report.view": true },
					supervisor: { "case.create": true, "case.edit": true, "case.delete": false, "report.view": true },
					agent: { "case.create": true, "case.edit": false, "case.delete": false, "report.view": false },
				}}
				readOnlyRoles={["admin"]}
				onChange={setDiffs}
			/>
			{diffs.length > 0 && (
				<p className="text-muted-foreground text-xs">{diffs.length} pending change(s)</p>
			)}
		</div>
	)
}

function SettingsTabsDemo() {
	const [saved, setSaved] = React.useState(false)
	const [displayName, setDisplayName] = React.useState("HPCMS")

	return (
		<SettingsTabs
			defaultTab="general"
			tabs={[
				{
					key: "general",
					label: "General",
					content: (
						<div className="flex flex-col gap-3">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium" htmlFor="display-name">
									Display Name
								</label>
								<Input
									id="display-name"
									value={displayName}
									onChange={e => { setDisplayName(e.target.value); setSaved(false) }}
								/>
							</div>
						</div>
					),
					saveBar: (
						<div className="flex items-center gap-2">
							<Button size="sm" onClick={() => setSaved(true)}>
								{saved ? "Saved" : "Save Changes"}
							</Button>
							<Button variant="outline" size="sm" onClick={() => { setDisplayName("HPCMS"); setSaved(false) }}>
								Discard
							</Button>
						</div>
					),
				},
				{
					key: "notifications",
					label: "Notifications",
					content: (
						<p className="text-muted-foreground text-sm">
							Notification settings will appear here.
						</p>
					),
				},
			]}
		/>
	)
}

export function AdminDesignShowcaseClient() {
	return (
		<div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8">
			<div>
				<h1 className="text-2xl font-bold">Admin Design System</h1>
				<p className="text-muted-foreground mt-1 text-sm">
					Design primitives for the staff-admin feature.
				</p>
			</div>

			<section className="flex flex-col gap-3">
				<h2 className="text-lg font-semibold">Data Table</h2>
				<Card>
					<CardContent className="pt-4">
						<DataTableDemo />
					</CardContent>
				</Card>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-lg font-semibold">Wizard</h2>
				<WizardDemo />
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-lg font-semibold">Rule Builder</h2>
				<Card>
					<CardHeader>
						<CardTitle>Routing Rule</CardTitle>
					</CardHeader>
					<CardContent>
						<RuleBuilderDemo />
					</CardContent>
				</Card>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-lg font-semibold">Permission Matrix</h2>
				<PermissionMatrixDemo />
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-lg font-semibold">Settings Tabs</h2>
				<Card>
					<CardContent className="pt-4">
						<SettingsTabsDemo />
					</CardContent>
				</Card>
			</section>
		</div>
	)
}
