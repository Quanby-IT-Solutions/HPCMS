"use client"

import * as React from "react"
import { Search01Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/core/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu"
import { Input } from "@/core/components/ui/input"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"

interface Column<TRow> {
	key: string
	header: string
	render: (row: TRow) => React.ReactNode
	sortable?: boolean
}

interface RowAction<TRow> {
	label: string
	onClick: (row: TRow) => void
	variant?: "default" | "destructive"
}

interface AdminDataTableProps<TRow extends { id: string | number }> {
	columns: Column<TRow>[]
	rows: TRow[]
	totalCount?: number
	page?: number
	pageSize?: number
	onPageChange?: (page: number) => void
	searchValue?: string
	onSearchChange?: (value: string) => void
	rowActions?: RowAction<TRow>[]
	isLoading?: boolean
	emptyMessage?: string
}

type SortDir = "asc" | "desc"

export function AdminDataTable<TRow extends { id: string | number }>({
	columns,
	rows,
	totalCount,
	page = 1,
	pageSize = 10,
	onPageChange,
	searchValue,
	onSearchChange,
	rowActions,
	isLoading,
	emptyMessage = "No results found.",
}: AdminDataTableProps<TRow>) {
	const [sortKey, setSortKey] = React.useState<string | null>(null)
	const [sortDir, setSortDir] = React.useState<SortDir>("asc")

	function handleSort(key: string) {
		if (sortKey === key) {
			setSortDir(prev => (prev === "asc" ? "desc" : "asc"))
		} else {
			setSortKey(key)
			setSortDir("asc")
		}
	}

	const sortedRows = React.useMemo(() => {
		if (!sortKey) return rows
		const col = columns.find(c => c.key === sortKey)
		if (!col?.sortable) return rows
		return [...rows].sort((a, b) => {
			const aVal = String((a as Record<string, unknown>)[sortKey] ?? "")
			const bVal = String((b as Record<string, unknown>)[sortKey] ?? "")
			const cmp = aVal.localeCompare(bVal)
			return sortDir === "asc" ? cmp : -cmp
		})
	}, [rows, sortKey, sortDir, columns])

	const totalPages = totalCount !== undefined ? Math.ceil(totalCount / pageSize) : undefined

	return (
		<div className="flex flex-col gap-3">
			{onSearchChange && (
				<div className="relative w-full max-w-sm">
					<HugeiconsIcon
						icon={Search01Icon}
						strokeWidth={2}
						className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2"
					/>
					<Input
						className="pl-8"
						placeholder="Search…"
						value={searchValue ?? ""}
						onChange={e => onSearchChange(e.target.value)}
					/>
				</div>
			)}

			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map(col => (
								<TableHead key={col.key}>
									{col.sortable ? (
										<button
											type="button"
											onClick={() => handleSort(col.key)}
											className="hover:text-foreground inline-flex items-center gap-1 font-medium transition-colors"
										>
											{col.header}
											<span className="text-muted-foreground text-xs">
												{sortKey === col.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
											</span>
										</button>
									) : (
										col.header
									)}
								</TableHead>
							))}
							{rowActions && <TableHead className="w-10" />}
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							Array.from({ length: 5 }).map((_, i) => (
								<TableRow key={i}>
									{columns.map(col => (
										<TableCell key={col.key}>
											<Skeleton className="h-4 w-full" />
										</TableCell>
									))}
									{rowActions && (
										<TableCell>
											<Skeleton className="size-8" />
										</TableCell>
									)}
								</TableRow>
							))
						) : sortedRows.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={columns.length + (rowActions ? 1 : 0)}
									className="text-muted-foreground py-8 text-center"
								>
									{emptyMessage}
								</TableCell>
							</TableRow>
						) : (
							sortedRows.map(row => (
								<TableRow key={row.id}>
									{columns.map(col => (
										<TableCell key={col.key}>{col.render(row)}</TableCell>
									))}
									{rowActions && (
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger
													render={
														<Button variant="ghost" size="icon-sm" aria-label="Row actions" />
													}
												>
													<HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													{rowActions.map(action => (
														<DropdownMenuItem
															key={action.label}
															variant={action.variant === "destructive" ? "destructive" : "default"}
															onClick={() => action.onClick(row)}
														>
															{action.label}
														</DropdownMenuItem>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									)}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{totalPages !== undefined && onPageChange && (
				<div className="flex items-center justify-between px-1">
					<p className="text-muted-foreground text-sm">
						Page {page} of {totalPages}
					</p>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							disabled={page <= 1}
							onClick={() => onPageChange(page - 1)}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={page >= totalPages}
							onClick={() => onPageChange(page + 1)}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
