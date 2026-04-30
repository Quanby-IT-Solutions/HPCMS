import { AuditLogPageClient } from "@/features/tenant-admin/components/audit-log-page-client"
import { requireRole } from "@/features/auth/lib/require-role"
import { TENANT_ADMIN_ALLOWED_ROLES } from "@/features/tenant-admin/lib/tenant-admin-routes"

interface Props {
	searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AuditPage({ searchParams }: Props) {
	await requireRole(TENANT_ADMIN_ALLOWED_ROLES)
	const sp = await searchParams
	const s = (key: string) => (Array.isArray(sp[key]) ? sp[key][0] : sp[key]) ?? ""
	return (
		<AuditLogPageClient
			initialActorUserId={s("actorUserId")}
			initialActionType={s("actionType")}
			initialRecordType={s("recordType")}
			initialDateFrom={s("dateFrom")}
			initialDateTo={s("dateTo")}
		/>
	)
}
