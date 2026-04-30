import { Badge } from "@/core/components/ui/badge"
import { AlertTriangle } from "@/core/components/icons"

export interface ClinicianHeaderPatient {
	fullName: string
	mrn: string
	age: number
	sex: "M" | "F" | "Other" | "Unknown"
	hasAllergies: boolean
}

export function ClinicianHeader({ patient }: { patient: ClinicianHeaderPatient }) {
	return (
		<header className="bg-card sticky top-0 z-10 flex flex-col gap-1 border-b px-4 py-3">
			<div className="flex items-start justify-between gap-2">
				<h1 className="text-foreground truncate text-base font-semibold leading-tight">
					{patient.fullName}
				</h1>
				{patient.hasAllergies ? (
					<Badge variant="destructive" className="shrink-0">
						<AlertTriangle className="size-3" />
						<span>Allergies</span>
					</Badge>
				) : null}
			</div>
			<dl className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
				<div className="flex items-center gap-1">
					<dt className="sr-only">MRN</dt>
					<dd>
						MRN <span className="text-foreground font-medium">{patient.mrn}</span>
					</dd>
				</div>
				<div aria-hidden className="text-muted-foreground/50">
					·
				</div>
				<div className="flex items-center gap-1">
					<dt className="sr-only">Age</dt>
					<dd>
						<span className="text-foreground font-medium">{patient.age}</span>y
					</dd>
				</div>
				<div aria-hidden className="text-muted-foreground/50">
					·
				</div>
				<div className="flex items-center gap-1">
					<dt className="sr-only">Sex</dt>
					<dd className="text-foreground font-medium">{patient.sex}</dd>
				</div>
			</dl>
		</header>
	)
}
