import {
	Bell,
	ClipboardList,
	FileText,
	Filter,
	UserPlus,
	Users,
} from "@/core/components/icons"
import {
	StaffShell,
	type StaffShellNavGroup,
} from "@/app/(staff)/staff-shell"

import { AGENT_ALLOWED_ROLES, AGENT_ROUTES } from "./agent-routes"

const NAV_GROUPS: StaffShellNavGroup[] = [
	{
		label: "Inbox",
		items: [
			{ href: AGENT_ROUTES.inbox, label: "Unified Inbox", icon: <Bell className="size-4" /> },
			{
				href: AGENT_ROUTES.communicationsSearch,
				label: "Search",
				icon: <Filter className="size-4" />,
			},
		],
	},
	{
		label: "Cases",
		items: [
			{
				href: AGENT_ROUTES.cases,
				label: "Case Queue",
				icon: <ClipboardList className="size-4" />,
			},
			{
				href: AGENT_ROUTES.playbooks,
				label: "Playbooks",
				icon: <FileText className="size-4" />,
			},
		],
	},
	{
		label: "Patients",
		items: [
			{ href: AGENT_ROUTES.patients, label: "Search", icon: <UserPlus className="size-4" /> },
		],
	},
	{
		label: "Claims",
		items: [
			{
				href: AGENT_ROUTES.claims,
				label: "Aging Dashboard",
				icon: <ClipboardList className="size-4" />,
			},
			{
				href: AGENT_ROUTES.claimPayers,
				label: "Payers",
				icon: <Users className="size-4" />,
			},
		],
	},
]

export default function AgentLayout({ children }: { children: React.ReactNode }) {
	return (
		<StaffShell
			title="Case Agent"
			subtitle="Multi-channel case workspace"
			navGroups={NAV_GROUPS}
			allowedRoles={AGENT_ALLOWED_ROLES}
		>
			{children}
		</StaffShell>
	)
}
