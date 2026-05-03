"use client"

import { useEffect, useState } from "react"

import { NotificationsBell } from "./notifications-bell"

/**
 * Client-only wrapper that defers rendering until after hydration.
 *
 * Base UI's Popover / Checkbox components generate auto-IDs via useId()
 * which differ between SSR and CSR, causing hydration mismatches.
 * By rendering nothing on the initial server pass and mounting only
 * after the first client effect, we sidestep the ID collision entirely.
 */
export function NotificationsBellClient() {
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])
	if (!mounted) return null
	return <NotificationsBell />
}
