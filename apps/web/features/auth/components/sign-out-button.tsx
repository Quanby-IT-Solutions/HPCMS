"use client"

import { useSignOutMutation } from "@/features/auth/api/session.hooks"

export function SignOutButton() {
	const { mutate: signOut, isPending } = useSignOutMutation()

	return (
		<button
			type="button"
			onClick={() => signOut()}
			disabled={isPending}
			className="text-muted-foreground hover:text-foreground cursor-pointer text-sm disabled:opacity-50"
		>
			{isPending ? "Signing out..." : "Sign out"}
		</button>
	)
}
