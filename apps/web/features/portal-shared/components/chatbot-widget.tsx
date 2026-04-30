"use client"

import Link from "next/link"
import { useState } from "react"

import { Bell, X } from "@/core/components/icons"
import { Button } from "@/core/components/ui/button"
import { PORTAL_ROUTES } from "@/features/portal-shared/lib/portal-routes"

/**
 * Floating chatbot launcher mounted on every authenticated patient page.
 * Per CA-FE-10 spec: dashboard launcher + ubiquitous floating widget.
 * The full chat experience lives at /portal/chatbot.
 */
export function ChatbotWidget() {
	const [open, setOpen] = useState(false)

	return (
		<div className="fixed bottom-4 right-4 z-40">
			{open ? (
				<div className="bg-card flex w-72 flex-col gap-3 rounded-lg border p-4 shadow-lg">
					<div className="flex items-start justify-between gap-2">
						<div>
							<p className="text-sm font-semibold">Need help?</p>
							<p className="text-muted-foreground mt-1 text-xs">
								Ask the SLMC assistant about LOA requests, appointments, or
								medication.
							</p>
						</div>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => setOpen(false)}
							aria-label="Close"
						>
							<X />
						</Button>
					</div>
					<Link
						href={PORTAL_ROUTES.chatbot}
						className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-3 py-2 text-xs font-medium"
					>
						Open chat
					</Link>
				</div>
			) : (
				<Button
					onClick={() => setOpen(true)}
					size="lg"
					className="rounded-full shadow-lg"
					aria-label="Open chatbot"
				>
					<Bell className="size-4" />
					<span className="ml-2">Help</span>
				</Button>
			)}
		</div>
	)
}
