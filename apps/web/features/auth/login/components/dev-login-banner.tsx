"use client"

import { useLoginMutation } from "../api/login.hooks"

const DEV_PASSWORD = "DevPass123!"

const DEV_USERS = [
	{ label: "Sys Admin", email: "system@hpcms.local" },
	{ label: "Tenant Admin", email: "admin@hpcms.local" },
	{ label: "Supervisor", email: "supervisor@hpcms.local" },
	{ label: "Case Agent", email: "agent@hpcms.local" },
	{ label: "Clinician", email: "clinician@hpcms.local" },
	{ label: "Patient", email: "patient@hpcms.local" },
]

export function DevLoginBanner() {
	const { mutateAsync: login, isPending } = useLoginMutation()

	return (
		<div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3">
			<p className="mb-2 text-xs font-semibold text-yellow-700 dark:text-yellow-400">
				DEV — Quick Access
			</p>
			<div className="flex flex-wrap gap-1.5">
				{DEV_USERS.map(user => (
					<button
						key={user.email}
						type="button"
						disabled={isPending}
						onClick={() => login({ email: user.email, password: DEV_PASSWORD })}
						className="cursor-pointer rounded bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-800 hover:bg-yellow-500/40 disabled:opacity-50 dark:text-yellow-300"
					>
						{user.label}
					</button>
				))}
			</div>
		</div>
	)
}
