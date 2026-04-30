import { ClipboardList, ShieldCheck, Users } from "@/core/components/icons"
import {
	StaffShell,
	type StaffShellNavGroup,
} from "@/app/(staff)/staff-shell"

const ADMIN_ROLES = ["tenant_admin", "system_admin"] as const

const NAV_GROUPS: StaffShellNavGroup[] = [
	{
		label: "Cases (deprecated)",
		items: [
			{
				href: "/agent/cases",
				label: "Open in Case Agent",
				icon: <ClipboardList className="size-4" />,
			},
		],
	},
	{
		label: "Admin",
		items: [
			{
				href: "/staff/admin/users",
				label: "Users",
				icon: <Users className="size-4" />,
			},
			{
				href: "/staff/admin/audit",
				label: "Audit Log",
				icon: <ShieldCheck className="size-4" />,
			},
		],
	},
]

export default function StaffAdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<StaffShell
			title="Admin Console"
			subtitle="System / Tenant Admin"
			navGroups={NAV_GROUPS}
			allowedRoles={ADMIN_ROLES}
		>
			{children}
		</StaffShell>
	)
}
