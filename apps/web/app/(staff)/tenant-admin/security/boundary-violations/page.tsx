import { requireRole } from "@/features/auth/lib/require-role"
import { TENANT_ADMIN_ALLOWED_ROLES } from "@/features/tenant-admin/lib/tenant-admin-routes"
import { BoundaryViolationsClient } from "./boundary-violations-client"

export default async function Page() {
	await requireRole(TENANT_ADMIN_ALLOWED_ROLES)
	return <BoundaryViolationsClient />
}
