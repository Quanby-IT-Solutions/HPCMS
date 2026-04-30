interface DenseInfoRowProps {
	label: string
	value: React.ReactNode
	sub?: React.ReactNode
}

export function DenseInfoRow({ label, value, sub }: DenseInfoRowProps) {
	return (
		<div className="flex items-baseline justify-between gap-3 py-1.5 first:pt-0 last:pb-0">
			<dt className="text-muted-foreground shrink-0 text-xs">{label}</dt>
			<dd className="flex-1 text-right text-xs">
				<div className="text-foreground font-medium">{value}</div>
				{sub ? <div className="text-muted-foreground mt-0.5 text-[10px]">{sub}</div> : null}
			</dd>
		</div>
	)
}
