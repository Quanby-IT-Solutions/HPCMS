import {
	AlertTriangle,
	BarChart2,
	BookOpen,
	Briefcase,
	ClipboardList,
	CpuIcon,
	Stethoscope,
	UserPlus,
	Users,
} from "@/core/components/icons"
import { StaffShell, type StaffShellNavGroup } from "@/app/(staff)/staff-shell"

import { SUPERVISOR_ALLOWED_ROLES, SUPERVISOR_ROUTES } from "./supervisor-routes"

const NAV_GROUPS: StaffShellNavGroup[] = [
	{
		label: "Patients",
		items: [
			{ href: SUPERVISOR_ROUTES.patients, label: "Patient Search", icon: <Users className="size-4" /> },
			{ href: SUPERVISOR_ROUTES.patientNew, label: "New Patient", icon: <UserPlus className="size-4" /> },
		],
	},
	{
		label: "Cases",
		items: [
			{ href: SUPERVISOR_ROUTES.cases, label: "Case Queue", icon: <Briefcase className="size-4" /> },
		],
	},
	{
		label: "Incidents",
		items: [
			{ href: SUPERVISOR_ROUTES.incidents, label: "Incidents", icon: <AlertTriangle className="size-4" /> },
		],
	},
	{
		label: "Programs & Devices",
		items: [
			{ href: SUPERVISOR_ROUTES.enrollments, label: "Enrollments", icon: <ClipboardList className="size-4" /> },
			{ href: SUPERVISOR_ROUTES.devices, label: "Devices", icon: <CpuIcon className="size-4" /> },
		],
	},
	{
		label: "Knowledge Base",
		items: [
			{ href: SUPERVISOR_ROUTES.knowledgeBase, label: "Articles", icon: <BookOpen className="size-4" /> },
		],
	},
	{
		label: "AI Insights",
		items: [
			{ href: SUPERVISOR_ROUTES.insights, label: "Trend Alerts", icon: <BarChart2 className="size-4" /> },
		],
	},
	{
		label: "Practitioners",
		items: [
			{ href: SUPERVISOR_ROUTES.practitioners, label: "Directory", icon: <Stethoscope className="size-4" /> },
		],
	},
]

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
	return (
		<StaffShell
			title="Case Supervisor"
			subtitle="Supervisor workspace"
			navGroups={NAV_GROUPS}
			allowedRoles={SUPERVISOR_ALLOWED_ROLES}
		>
			{children}
		</StaffShell>
	)
}
