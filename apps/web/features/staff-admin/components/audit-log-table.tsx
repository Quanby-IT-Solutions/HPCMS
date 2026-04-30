"use client"

import { useRouter, useSearchParams } from "next/navigation"

import type { AuditLog } from "@repo/contracts"

import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { useAuditLogsQuery } from "../api/admin.hooks"

export function AuditLogTable() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const page = Number(searchParams.get("page") ?? "1")

	const { data, isLoading } = useAuditLogsQuery({ page })

	function setPage(p: number) {
		const params = new URLSearchParams(searchParams.toString())
		params.set("page", String(p))
		router.push(`?${params.toString()}`)
	}

	if (isLoading) {
		return (
			<div className="flex flex-col gap-2">
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className="h-12 w-full" />
				))}
			</div>
		)
	}

	const items = data?.items ?? []
	const total = data?.total ?? 0
	const limit = data?.limit ?? 20
	const totalPages = Math.max(1, Math.ceil(total / limit))

	return (
		<div className="flex flex-col gap-4">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Date</TableHead>
						<TableHead>Actor</TableHead>
						<TableHead>Action</TableHead>
						<TableHead>Target Type</TableHead>
						<TableHead>Target ID</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.length === 0 ? (
						<TableRow>
							<TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
								No audit logs found
							</TableCell>
						</TableRow>
					) : (
						items.map((log: AuditLog) => (
							<TableRow key={log.id}>
								<TableCell className="text-muted-foreground text-xs whitespace-nowrap">
									{new Date(log.createdAt).toLocaleString()}
								</TableCell>
								<TableCell className="font-mono text-xs">
									{log.actorUserId ? `${log.actorUserId.slice(0, 10)}…` : "system"}
								</TableCell>
								<TableCell className="text-sm">{log.actionKey}</TableCell>
								<TableCell className="text-xs">{log.targetType}</TableCell>
								<TableCell className="font-mono text-xs">{log.targetId}</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-sm">
						{total} total &middot; page {page} of {totalPages}
					</span>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							disabled={page <= 1}
							onClick={() => setPage(page - 1)}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={page >= totalPages}
							onClick={() => setPage(page + 1)}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
