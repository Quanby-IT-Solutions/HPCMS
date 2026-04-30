import {
	AlertTriangle,
	BarChart2,
	ClipboardList,
	FileText,
	Lock,
	Shield,
	Activity,
	Globe,
} from "@/core/components/icons"
import { StaffShell, type StaffShellNavGroup } from "@/app/(staff)/staff-shell"

import { TENANT_ADMIN_ALLOWED_ROLES, TENANT_ADMIN_ROUTES } from "@/features/tenant-admin/lib/tenant-admin-routes"

const NAV_GROUPS: StaffShellNavGroup[] = [
	{
		label: "Audit",
		items: [
			{ href: TENANT_ADMIN_ROUTES.audit, label: "Audit Log", icon: <ClipboardList className="size-4" /> },
			{ href: TENANT_ADMIN_ROUTES.auditLogins, label: "Login Events", icon: <Lock className="size-4" /> },
		],
	},
	{
		label: "Compliance",
		items: [
			{ href: TENANT_ADMIN_ROUTES.compliance, label: "DPA Dashboard", icon: <Shield className="size-4" /> },
			{ href: TENANT_ADMIN_ROUTES.phiAccess, label: "PHI Access", icon: <FileText className="size-4" /> },
			{ href: TENANT_ADMIN_ROUTES.handoffs, label: "Handoffs", icon: <BarChart2 className="size-4" /> },
			{ href: TENANT_ADMIN_ROUTES.dpaReport, label: "DPA Report", icon: <FileText className="size-4" /> },
		],
	},
	{
		label: "Security",
		items: [
			{ href: TENANT_ADMIN_ROUTES.boundaryViolations, label: "Boundary Violations", icon: <AlertTriangle className="size-4" /> },
		],
	},
	{
		label: "Operations",
		items: [
			{ href: TENANT_ADMIN_ROUTES.incidents, label: "Incident Ops", icon: <Activity className="size-4" /> },
		],
	},
	{
		label: "Facility",
		items: [
			{ href: TENANT_ADMIN_ROUTES.facility, label: "Facility Config", icon: <Lock className="size-4" /> },
		],
	},
	{
		label: "Services",
		items: [
			{ href: TENANT_ADMIN_ROUTES.sharedServices, label: "Shared Policies", icon: <FileText className="size-4" /> },
			{ href: TENANT_ADMIN_ROUTES.crossFacilityReport, label: "Cross-Facility Reports", icon: <Globe className="size-4" /> },
		],
	},
]

export default function TenantAdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<StaffShell
			title="Tenant Admin"
			subtitle="Tenant workspace"
			navGroups={NAV_GROUPS}
			allowedRoles={TENANT_ADMIN_ALLOWED_ROLES}
		>
			{children}
		</StaffShell>
	)
}
