import { ThreadsList } from "@/features/portal-chat/components/threads-list"

export default function PortalChatListPage() {
	return (
		<div className="flex flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">Secure messages</h1>
				<p className="text-muted-foreground text-sm">
					Conversations with the SLMC care team. New messages refresh automatically.
				</p>
			</header>
			<ThreadsList />
		</div>
	)
}
