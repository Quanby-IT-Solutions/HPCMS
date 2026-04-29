import { VerifyEmailHandler } from "@/features/auth/verify-email/components/verify-email-handler"

type PageProps = {
	searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
	const { token } = await searchParams

	return (
		<section className="flex flex-1 flex-col items-center justify-center">
			<div className="w-full max-w-md">
				<VerifyEmailHandler token={token} />
			</div>
		</section>
	)
}
