"use client"

import { UserProfilePage } from "@/features/staff-admin/components/user-profile-page"

export default function UserDetailPage({ params }: { params: { id: string } }) {
	return (
		<div className="max-w-3xl">
			<UserProfilePage userId={params.id} />
		</div>
	)
}
