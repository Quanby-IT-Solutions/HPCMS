"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import type { SupervisorKbArticle } from "@repo/contracts"

import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Textarea } from "@/core/components/ui/textarea"
import {
	useKbCategoryListQuery,
	useKbCreateArticleMutation,
	useKbGetArticleQuery,
	useKbPublishMutation,
	useKbUpdateArticleMutation,
} from "@/features/supervisor-kb/api/supervisor-kb.hooks"

interface Props {
	articleId?: string
}

export function ArticleEditor({ articleId }: Props) {
	const router = useRouter()
	const { data: categories } = useKbCategoryListQuery()
	const { data: existingArticle, isLoading: articleLoading } = useKbGetArticleQuery(articleId)
	const create = useKbCreateArticleMutation()
	const update = useKbUpdateArticleMutation()
	const publish = useKbPublishMutation()

	const [title, setTitle] = useState("")
	const [categoryId, setCategoryId] = useState("")
	const [tags, setTags] = useState("")
	const [body, setBody] = useState("")
	const [savedId, setSavedId] = useState(articleId ?? "")
	const [initialised, setInitialised] = useState(!articleId)

	useEffect(() => {
		if (articleId && existingArticle && !initialised && existingArticle.id === articleId) {
			setTitle(existingArticle.title)
			setCategoryId(existingArticle.categoryId ?? "")
			setTags(existingArticle.tags.join(", "))
			setBody(existingArticle.bodyMarkdown)
			setInitialised(true)
		}
	}, [articleId, existingArticle, initialised])

	async function handleSaveDraft() {
		if (!title.trim() || !body.trim()) return
		const tagArr = tags.split(",").map(t => t.trim()).filter(Boolean)
		try {
			if (savedId && savedId !== "new") {
				await update.mutateAsync({ id: savedId, title, categoryId: categoryId || undefined, tags: tagArr, bodyMarkdown: body })
				toast.success("Draft saved")
			} else {
				const result = await create.mutateAsync({ title, categoryId: categoryId || undefined, tags: tagArr, bodyMarkdown: body })
				setSavedId(result.id)
				toast.success("Draft created")
				router.replace(SUPERVISOR_ROUTES.kbArticleEdit(result.id))
			}
		} catch (err) {
			toast.error("Save failed", { description: (err as Error).message })
		}
	}

	async function handlePublish() {
		if (!savedId || savedId === "new") {
			await handleSaveDraft()
		}
		if (!savedId) return
		try {
			await publish.mutateAsync({ id: savedId })
			toast.success("Article published")
		} catch (err) {
			toast.error("Publish failed", { description: (err as Error).message })
		}
	}

	const isPending = create.isPending || update.isPending || publish.isPending

	if (articleId && articleLoading && !initialised) {
		return <div className="flex flex-col gap-3 max-w-3xl"><div className="h-8 w-48 rounded bg-muted animate-pulse" /><div className="h-64 w-full rounded bg-muted animate-pulse" /></div>
	}

	return (
		<div className="flex max-w-3xl flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">{savedId && savedId !== "new" ? "Edit Article" : "New Article"}</h1>
			</header>
			<div className="flex flex-col gap-1.5">
				<Label>Title</Label>
				<Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Article title…" />
			</div>
			<div className="grid grid-cols-2 gap-3">
				<div className="flex flex-col gap-1.5">
					<Label>Category</Label>
					<Select value={categoryId} onValueChange={v => setCategoryId(v ?? "")}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							{(categories ?? []).map(c => (
								<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label>Tags (comma-separated)</Label>
					<Input value={tags} onChange={e => setTags(e.target.value)} placeholder="loa, guide, faq" />
				</div>
			</div>
			<div className="flex flex-col gap-1.5">
				<Label>Body (Markdown)</Label>
				<Textarea
					value={body}
					onChange={e => setBody(e.target.value)}
					rows={18}
					className="font-mono text-sm"
					placeholder="# Article title&#10;&#10;Write your article content here…"
				/>
				<span className="text-muted-foreground text-[10px]">{body.length} characters</span>
			</div>
			{articleId && articleId !== "new" && (
				<div className="rounded-md border p-3">
					<h3 className="font-semibold text-xs mb-1">Publication History</h3>
					<p className="text-xs text-muted-foreground">
						{existingArticle?.publishedAt
							? `Published ${new Date(existingArticle.publishedAt).toLocaleString()} by ${existingArticle.createdBy}`
							: "Not yet published."}
					</p>
				</div>
			)}
			<div className="flex gap-2">
				<Button onClick={handleSaveDraft} disabled={!title.trim() || !body.trim() || isPending} variant="outline">
					{create.isPending || update.isPending ? "Saving…" : "Save draft"}
				</Button>
				<Button onClick={handlePublish} disabled={!title.trim() || !body.trim() || isPending}>
					{publish.isPending ? "Publishing…" : "Publish"}
				</Button>
			</div>
		</div>
	)
}
