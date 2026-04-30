import { DpaDashboardClient } from "@/features/tenant-admin/components/dpa-dashboard-client"
import { requireRole } from "@/features/auth/lib/require-role"
import { TENANT_ADMIN_ALLOWED_ROLES } from "@/features/tenant-admin/lib/tenant-admin-routes"

export default async function CompliancePage() {
	await requireRole(TENANT_ADMIN_ALLOWED_ROLES)
	return <DpaDashboardClient />
}
