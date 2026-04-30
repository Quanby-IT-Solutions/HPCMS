"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "@/core/components/icons"

import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/alert"

interface LockoutBannerProps {
	lockedUntilMs: number
}

function formatCountdown(ms: number) {
	const total = Math.max(0, Math.ceil(ms / 1000))
	const m = Math.floor(total / 60)
	const s = total % 60
	return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export function LockoutBanner({ lockedUntilMs }: LockoutBannerProps) {
	const [remaining, setRemaining] = useState<number | null>(null)

	useEffect(() => {
		const t0 = setTimeout(() => setRemaining(lockedUntilMs - Date.now()), 0)
		const interval = setInterval(() => {
			setRemaining(lockedUntilMs - Date.now())
		}, 1000)
		return () => {
			clearTimeout(t0)
			clearInterval(interval)
		}
	}, [lockedUntilMs])

	if (remaining === null || remaining <= 0) return null

	return (
		<Alert variant="destructive">
			<AlertCircle className="size-4" />
			<AlertTitle>Account temporarily locked</AlertTitle>
			<AlertDescription>
				Too many failed attempts. Try again in {formatCountdown(remaining)}.
			</AlertDescription>
		</Alert>
	)
}
