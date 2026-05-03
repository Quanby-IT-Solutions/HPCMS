"use client"

import * as React from "react"

import { Button } from "@/core/components/ui/button"
import { Checkbox } from "@/core/components/ui/checkbox"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"

export interface PermissionDiff {
	role: string
	permKey: string
	enabled: boolean
}

interface PermissionMatrixProps {
	permKeys: string[]
	roles: string[]
	values: Record<string, Record<string, boolean>>
	readOnlyRoles?: string[]
	onChange: (diffs: PermissionDiff[]) => void
}

function formatLabel(key: string): string {
	return key
		.split(".")
		.map(part => part.charAt(0).toUpperCase() + part.slice(1))
		.join(": ")
}

export function PermissionMatrix({
	permKeys,
	roles,
	values,
	readOnlyRoles = [],
	onChange,
}: PermissionMatrixProps) {
	const [local, setLocal] = React.useState<Record<string, Record<string, boolean>>>(() => {
		const copy: Record<string, Record<string, boolean>> = {}
		for (const role of roles) {
			copy[role] = { ...(values[role] ?? {}) }
		}
		return copy
	})

	// Re-sync when the upstream values prop changes (e.g. initial data hydration)
	const valuesRef = React.useRef(values)
	React.useEffect(() => {
		if (values === valuesRef.current) return
		valuesRef.current = values
		const copy: Record<string, Record<string, boolean>> = {}
		for (const role of roles) {
			copy[role] = { ...(values[role] ?? {}) }
		}
		setLocal(copy)
		setDiffs([])
	}, [values, roles])

	const [diffs, setDiffs] = React.useState<PermissionDiff[]>([])

	function toggle(role: string, permKey: string) {
		if (readOnlyRoles.includes(role)) return
		const next = { ...local, [role]: { ...local[role], [permKey]: !local[role]?.[permKey] } }
		setLocal(next)

		const enabled = next[role]?.[permKey] ?? false
		const newDiff: PermissionDiff = { role, permKey, enabled }
		const updatedDiffs = diffs.filter(d => !(d.role === role && d.permKey === permKey))
		const originalValue = values[role]?.[permKey] ?? false
		const finalDiffs = enabled !== originalValue ? [...updatedDiffs, newDiff] : updatedDiffs
		setDiffs(finalDiffs)
		onChange(finalDiffs)
	}

	function setAllForPerm(permKey: string, enabled: boolean) {
		const writableRoles = roles.filter(r => !readOnlyRoles.includes(r))
		const next = { ...local }
		for (const role of writableRoles) {
			next[role] = { ...next[role], [permKey]: enabled }
		}
		setLocal(next)

		let updatedDiffs = [...diffs]
		for (const role of writableRoles) {
			updatedDiffs = updatedDiffs.filter(d => !(d.role === role && d.permKey === permKey))
			const originalValue = values[role]?.[permKey] ?? false
			if (enabled !== originalValue) {
				updatedDiffs.push({ role, permKey, enabled })
			}
		}
		setDiffs(updatedDiffs)
		onChange(updatedDiffs)
	}

	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-48">Permission</TableHead>
						<TableHead className="w-28">Actions</TableHead>
						{roles.map(role => (
							<TableHead
								key={role}
								className={[
									"text-center",
									readOnlyRoles.includes(role) ? "bg-muted/40 text-muted-foreground" : "",
								].join(" ")}
							>
								{formatLabel(role)}
								{readOnlyRoles.includes(role) && (
									<span className="block text-xs font-normal">(read-only)</span>
								)}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{permKeys.map(permKey => (
						<TableRow key={permKey}>
							<TableCell className="font-medium">{formatLabel(permKey)}</TableCell>
							<TableCell>
								<div className="flex gap-1">
									<Button
										variant="outline"
										size="xs"
										onClick={() => setAllForPerm(permKey, true)}
									>
										All
									</Button>
									<Button
										variant="outline"
										size="xs"
										onClick={() => setAllForPerm(permKey, false)}
									>
										None
									</Button>
								</div>
							</TableCell>
							{roles.map(role => {
								const isReadOnly = readOnlyRoles.includes(role)
								const checked = local[role]?.[permKey] ?? false
								return (
									<TableCell
										key={role}
										className={[
											"text-center",
											isReadOnly ? "bg-muted/40" : "",
										].join(" ")}
									>
										<div className="flex justify-center">
											<Checkbox
												checked={checked}
												disabled={isReadOnly}
												onCheckedChange={() => toggle(role, permKey)}
											/>
										</div>
									</TableCell>
								)
							})}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
