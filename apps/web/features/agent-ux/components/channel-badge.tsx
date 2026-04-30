import type { Channel } from "@repo/contracts"

import { Badge } from "@/core/components/ui/badge"
import { Bell, FileText, Filter, Users } from "@/core/components/icons"

const CONFIG: Record<Channel, { label: string; icon: React.ReactNode; tone: string }> = {
	email: {
		label: "Email",
		icon: <FileText className="size-3" />,
		tone: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
	},
	phone: {
		label: "Phone",
		icon: <Bell className="size-3" />,
		tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
	},
	portal_chat: {
		label: "Portal chat",
		icon: <Filter className="size-3" />,
		tone: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30",
	},
	social_media: {
		label: "Social",
		icon: <Users className="size-3" />,
		tone: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
	},
}

const PLATFORM_GLYPH: Record<string, string> = {
	facebook: "FB",
	twitter: "X",
	instagram: "IG",
	other: "•",
}

interface ChannelBadgeProps {
	channel: Channel
	/**
	 * Optional sub-platform indicator (e.g. "facebook", "twitter", "instagram") shown
	 * inline when the channel is social_media. CA-FE-11 ACs require a visible
	 * platform marker on the feed row.
	 */
	platform?: string | null
}

export function ChannelBadge({ channel, platform }: ChannelBadgeProps) {
	const cfg = CONFIG[channel]
	const showPlatform =
		channel === "social_media" && platform && PLATFORM_GLYPH[platform.toLowerCase()]
	return (
		<Badge variant="outline" className={`${cfg.tone} gap-1`}>
			{cfg.icon}
			<span>{cfg.label}</span>
			{showPlatform ? (
				<span className="ml-0.5 rounded bg-white/40 px-1 text-[9px] font-bold tracking-wide dark:bg-black/30">
					{PLATFORM_GLYPH[platform!.toLowerCase()]}
				</span>
			) : null}
		</Badge>
	)
}
