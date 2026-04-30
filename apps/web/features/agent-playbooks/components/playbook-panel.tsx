"use client"

import Link from "next/link"

import {
	useCasePlaybookQuery,
	useCompletePlaybookStepMutation,
} from "@/features/agent-playbooks/api/playbooks.hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Skeleton } from "@/core/components/ui/skeleton"

interface Props {
	caseRef: string
}

export function PlaybookPanel({ caseRef }: Props) {
	const { data, isLoading } = useCasePlaybookQuery(caseRef)
	const complete = useCompletePlaybookStepMutation()

	if (isLoading || !data) {
		return (
			<Card size="sm">
				<CardHeader>
					<CardTitle className="text-xs uppercase tracking-wider">Playbook</CardTitle>
				</CardHeader>
				<CardContent>
					<Skeleton className="h-12 w-full" />
				</CardContent>
			</Card>
		)
	}

	function isStepDone(stepNumber: number): boolean {
		return !!data?.progress.find(p => p.stepNumber === stepNumber)?.completedAt
	}

	function toggle(stepNumber: number) {
		complete.mutate({
			caseRef,
			stepNumber,
			completed: !isStepDone(stepNumber),
		})
	}

	return (
		<Card size="sm">
			<CardHeader>
				<CardTitle className="text-xs uppercase tracking-wider">
					{data.playbook.name}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				{data.playbook.steps.map(step => {
					const done = isStepDone(step.stepNumber)
					return (
						<div key={step.stepNumber} className="flex items-start gap-2">
							<input
								type="checkbox"
								checked={done}
								onChange={() => toggle(step.stepNumber)}
								className="mt-1 size-3.5"
								aria-label={step.title}
							/>
							<div className="flex flex-1 flex-col gap-0.5">
								<span
									className={`text-xs font-medium ${done ? "text-muted-foreground line-through" : ""}`}
								>
									{step.stepNumber}. {step.title}
								</span>
								{step.body ? (
									<span className="text-muted-foreground text-[11px]">{step.body}</span>
								) : null}
								{step.deepLink ? (
									<Link
										href={step.deepLink}
										className="text-primary text-[11px] hover:underline"
									>
										Open tool →
									</Link>
								) : null}
							</div>
						</div>
					)
				})}
				<Link
					href="/agent/playbooks"
					className="text-primary mt-2 text-[11px] hover:underline"
				>
					View playbook library →
				</Link>
			</CardContent>
		</Card>
	)
}
