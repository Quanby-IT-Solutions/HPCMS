export function PortalFooter() {
	return (
		<footer className="border-t">
			<div className="text-muted-foreground mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:justify-between">
				<p>
					&copy; {new Date().getFullYear()} St. Luke&apos;s Medical Center · Patient
					Portal
				</p>
				<p>For medical emergencies, call your local hotline.</p>
			</div>
		</footer>
	)
}
