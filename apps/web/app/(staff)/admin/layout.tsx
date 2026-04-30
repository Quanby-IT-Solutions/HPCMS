import {
	Building,
	CpuIcon,
	Database,
	GitBranch,
	Lock,
	Shield,
	Tag,
	Users,
} from "@/core/components/icons"
import { StaffShell, type StaffShellNavGroup } from "@/app/(staff)/staff-shell"

import { ADMIN_ALLOWED_ROLES, ADMIN_ROUTES } from "@/features/staff-admin/lib/admin-routes"

const NAV_GROUPS: StaffShellNavGroup[] = [
	{
		label: "Users",
		items: [
			{ href: ADMIN_ROUTES.users, label: "Users", icon: <Users className="size-4" /> },
		],
	},
	{
		label: "Access",
		items: [
			{ href: ADMIN_ROUTES.roles, label: "Roles", icon: <Shield className="size-4" /> },
			{ href: ADMIN_ROUTES.security, label: "Security", icon: <Lock className="size-4" /> },
			{ href: ADMIN_ROUTES.dataSegregation, label: "Data Segregation", icon: <Lock className="size-4" /> },
		],
	},
	{
		label: "Facilities",
		items: [
			{ href: ADMIN_ROUTES.tenants, label: "Tenants", icon: <Building className="size-4" /> },
		],
	},
	{
		label: "Case Configuration",
		items: [
			{ href: ADMIN_ROUTES.caseTypes, label: "Case Types", icon: <Tag className="size-4" /> },
			{ href: ADMIN_ROUTES.routingRules, label: "Routing Rules", icon: <GitBranch className="size-4" /> },
			{ href: ADMIN_ROUTES.aiTriage, label: "AI Triage", icon: <CpuIcon className="size-4" /> },
		],
	},
	{
		label: "Integrations",
		items: [
			{ href: ADMIN_ROUTES.fhirSettings, label: "FHIR Settings", icon: <Database className="size-4" /> },
		],
	},
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<StaffShell
			title="System Admin"
			subtitle="Admin workspace"
			navGroups={NAV_GROUPS}
			allowedRoles={ADMIN_ALLOWED_ROLES}
		>
			{children}
		</StaffShell>
	)
}
