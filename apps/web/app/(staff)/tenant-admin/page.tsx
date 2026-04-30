import { redirect } from "next/navigation"

import { TENANT_ADMIN_ROUTES } from "@/features/tenant-admin/lib/tenant-admin-routes"

export default function TenantAdminHome() {
	redirect(TENANT_ADMIN_ROUTES.audit)
}
