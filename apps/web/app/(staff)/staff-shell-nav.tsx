"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/core/lib/utils"

import type { StaffShellNavGroup } from "@/app/(staff)/staff-shell"

interface Props {
	navGroups: StaffShellNavGroup[]
}

function isActive(pathname: string, href: string): boolean {
	if (pathname === href) return true
	// Treat /agent/cases as active when on /agent/cases/[id], etc.
	return pathname.startsWith(`${href}/`)
}

export function StaffShellNav({ navGroups }: Props) {
	const pathname = usePathname()

	return (
		<nav className="flex flex-col gap-3 p-3">
			{navGroups.map(group => (
				<div key={group.label} className="flex flex-col gap-1">
					<p className="text-muted-foreground mb-1 px-2 text-xs font-semibold uppercase tracking-wider">
						{group.label}
					</p>
					{group.items.map(item => {
						const active = isActive(pathname, item.href)
						return (
							<Link
								key={item.href}
								href={item.href}
								aria-current={active ? "page" : undefined}
								className={cn(
									"flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
									active
										? "bg-accent text-accent-foreground"
										: "hover:bg-accent hover:text-accent-foreground"
								)}
							>
								{item.icon ? (
									<span
										className={cn(
											active ? "text-foreground" : "text-muted-foreground"
										)}
									>
										{item.icon}
									</span>
								) : null}
								<span>{item.label}</span>
							</Link>
						)
					})}
				</div>
			))}
		</nav>
	)
}
