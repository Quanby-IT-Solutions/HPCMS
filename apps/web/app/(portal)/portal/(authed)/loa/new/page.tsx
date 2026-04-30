import { LoaForm } from "@/features/portal-loa/components/loa-form"

export default function LoaNewPage() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-bold">Submit LOA Request</h1>
				<p className="text-muted-foreground mt-1 text-sm">
					Complete the form below to submit a Letter of Authorization for your medical
					records.
				</p>
			</div>
			<LoaForm />
		</div>
	)
}
