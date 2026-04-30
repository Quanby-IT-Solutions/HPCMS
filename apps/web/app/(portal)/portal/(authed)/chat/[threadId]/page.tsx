import Link from "next/link"

import { ChevronLeft } from "@/core/components/icons"
import { ThreadView } from "@/features/portal-chat/components/thread-view"

interface Props {
	params: Promise<{ threadId: string }>
}

export default async function ChatThreadPage({ params }: Props) {
	const { threadId } = await params
	return (
		<div className="flex flex-col gap-4">
			<Link
				href="/portal/chat"
				className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground -ml-2 w-fit"
			>
				<ChevronLeft className="mr-1 size-4" />
				Back to messages
			</Link>
			<ThreadView threadId={threadId} />
		</div>
	)
}
