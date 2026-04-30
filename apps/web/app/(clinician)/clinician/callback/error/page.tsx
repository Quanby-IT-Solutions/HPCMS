import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/alert"

const REASONS: Record<string, { title: string; description: string }> = {
	"authorization-rejected": {
		title: "Authorization rejected",
		description: "The EMR's authorization server denied the request.",
	},
	"missing-callback-params": {
		title: "Missing callback parameters",
		description: "The authorization server did not return the expected code and state.",
	},
	"state-mismatch": {
		title: "Security check failed",
		description:
			"The state token did not match — the launch may have been tampered with or the cookie expired. Re-launch from the EMR.",
	},
	"launch-context-lost": {
		title: "Launch context lost",
		description:
			"The PKCE verifier or issuer cookie is missing. Re-launch from the EMR.",
	},
	"token-exchange-failed": {
		title: "Token exchange failed",
		description:
			"The PCMS backend could not validate the launch. Contact your administrator if this persists.",
	},
}

type SearchParams = Promise<{ reason?: string; detail?: string }>

export default async function ClinicianCallbackErrorPage({
	searchParams,
}: {
	searchParams: SearchParams
}) {
	const { reason, detail } = await searchParams
	const fallback = {
		title: "Launch failed",
		description: "An unexpected error occurred during the SMART callback.",
	}
	const meta = reason ? (REASONS[reason] ?? fallback) : fallback

	return (
		<main className="mx-auto flex min-h-screen w-full min-w-[360px] max-w-[480px] flex-col gap-3 p-4">
			<header>
				<h1 className="text-base font-semibold">PCMS Clinician Launch</h1>
			</header>
			<Alert variant="destructive">
				<AlertTitle>{meta.title}</AlertTitle>
				<AlertDescription>
					<p>{meta.description}</p>
					{detail ? (
						<p className="text-muted-foreground mt-2 break-words font-mono text-[10px]">
							{detail}
						</p>
					) : null}
				</AlertDescription>
			</Alert>
			<p className="text-muted-foreground text-xs">
				Close this sidebar and re-launch PCMS from the patient chart in your EMR.
			</p>
		</main>
	)
}
