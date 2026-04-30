import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/alert"

const REASONS: Record<string, { title: string; description: string }> = {
	"missing-launch-params": {
		title: "Missing launch parameters",
		description:
			"This URL must be opened from your EMR with iss and launch query parameters. Re-launch PCMS from the patient chart inside your EMR.",
	},
	"discovery-failed": {
		title: "Could not reach EMR",
		description:
			"The EMR's SMART configuration endpoint did not respond. Verify the iss URL and try again.",
	},
}

type SearchParams = Promise<{ reason?: string; detail?: string }>

export default async function ClinicianLaunchErrorPage({
	searchParams,
}: {
	searchParams: SearchParams
}) {
	const { reason, detail } = await searchParams
	const fallback = {
		title: "Launch failed",
		description: "An unexpected error occurred during the SMART launch.",
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
		</main>
	)
}
