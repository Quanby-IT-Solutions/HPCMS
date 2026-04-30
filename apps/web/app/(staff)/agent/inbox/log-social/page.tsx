import { SocialInquiryForm } from "@/features/agent-inbox/components/social-inquiry-form"

export default function LogSocialPage() {
	return (
		<div className="flex flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">Capture social inquiry</h1>
				<p className="text-muted-foreground text-sm">
					Adds a social-media post (Facebook, X, Instagram) into the inbox feed for triage.
				</p>
			</header>
			<SocialInquiryForm />
		</div>
	)
}
