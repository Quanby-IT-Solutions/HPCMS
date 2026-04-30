import { SharedServicePolicyPage } from "@/features/tenant-admin/components/shared-service-policy-page"
import { requireRole } from "@/features/auth/lib/require-role"
import { TENANT_ADMIN_ALLOWED_ROLES } from "@/features/tenant-admin/lib/tenant-admin-routes"

export default async function SharedServicesPage() {
	await requireRole(TENANT_ADMIN_ALLOWED_ROLES)
	return <SharedServicePolicyPage />
}
