"use client"

import Link from "next/link"
import { useState } from "react"

import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { useKbArticleListQuery } from "@/features/supervisor-kb/api/supervisor-kb.hooks"

const STATUS_STYLES: Record<string, string> = {
	draft: "bg-yellow-100 text-yellow-700",
	published: "bg-green-100 text-green-700",
	archived: "bg-slate-100 text-slate-600",
}

export function ArticlesListPage() {
	const [statusFilter, setStatusFilter] = useState<string>("")
	const [tagFilter, setTagFilter] = useState<string>("")
	const { data, isLoading } = useKbArticleListQuery({
		...(statusFilter ? { status: statusFilter } : {}),
		...(tagFilter.trim() ? { tag: tagFilter.trim() } : {}),
	})

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<header>
					<h1 className="text-2xl font-bold">Knowledge Base</h1>
					<p className="text-muted-foreground text-sm">Author and manage articles.</p>
				</header>
				<div className="flex gap-2">
					<Link href={SUPERVISOR_ROUTES.kbCategories}>
						<Button variant="outline" size="sm">Categories</Button>
					</Link>
					<Link href={SUPERVISOR_ROUTES.kbArticleEdit("new")}>
						<Button size="sm">New Article</Button>
					</Link>
				</div>
			</div>

			<div className="flex gap-2">
				<Select value={statusFilter} onValueChange={v => setStatusFilter(v ?? "")}>
					<SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
					<SelectContent>
						<SelectItem value="">All</SelectItem>
						<SelectItem value="draft">Draft</SelectItem>
						<SelectItem value="published">Published</SelectItem>
						<SelectItem value="archived">Archived</SelectItem>
					</SelectContent>
				</Select>
				<Input
					value={tagFilter}
					onChange={e => setTagFilter(e.target.value)}
					placeholder="Filter by tag…"
					className="h-9 w-40 text-sm"
				/>
			</div>

			{isLoading ? (
				<div className="flex flex-col gap-2">
					{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Tags</TableHead>
							<TableHead>Updated</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{(data?.rows ?? []).map(a => (
							<TableRow key={a.id}>
								<TableCell className="font-medium">{a.title}</TableCell>
								<TableCell className="text-sm">{a.categoryName ?? "—"}</TableCell>
								<TableCell>
									<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[a.status]}`}>
										{a.status}
									</span>
								</TableCell>
								<TableCell className="text-xs">{a.tags.join(", ") || "—"}</TableCell>
								<TableCell className="text-xs tabular-nums">{new Date(a.updatedAt).toLocaleDateString()}</TableCell>
								<TableCell>
									<div className="flex gap-1">
										<Link href={SUPERVISOR_ROUTES.kbArticleEdit(a.id)}>
											<Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
										</Link>
										<Link href={SUPERVISOR_ROUTES.kbArticlePreview(a.id)}>
											<Button variant="ghost" size="sm" className="h-7 text-xs">Preview</Button>
										</Link>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	)
}
