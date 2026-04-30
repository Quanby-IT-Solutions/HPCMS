import { FacilityConfigPage } from "@/features/tenant-admin/components/facility-config-page"
import { requireRole } from "@/features/auth/lib/require-role"
import { TENANT_ADMIN_ALLOWED_ROLES } from "@/features/tenant-admin/lib/tenant-admin-routes"

export default async function FacilityPage() {
	await requireRole(TENANT_ADMIN_ALLOWED_ROLES)
	return <FacilityConfigPage />
}
