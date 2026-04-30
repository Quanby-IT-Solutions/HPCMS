"use client"

import * as React from "react"
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/core/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Spinner } from "@/core/components/ui/spinner"

interface WizardStep {
	title: string
	validator?: () => boolean
	content: React.ReactNode
}

interface AdminWizardProps {
	steps: WizardStep[]
	onFinish: () => void
	isFinishing?: boolean
}

export function AdminWizard({ steps, onFinish, isFinishing }: AdminWizardProps) {
	const [currentIndex, setCurrentIndex] = React.useState(0)

	const currentStep = steps[currentIndex]
	const isFirst = currentIndex === 0
	const isLast = currentIndex === steps.length - 1
	const canProceed = currentStep?.validator ? currentStep.validator() : true

	function goNext() {
		if (!isLast && canProceed) {
			setCurrentIndex(prev => prev + 1)
		}
	}

	function goBack() {
		if (!isFirst) {
			setCurrentIndex(prev => prev - 1)
		}
	}

	return (
		<Card>
			<CardHeader className="border-b">
				<CardTitle>{currentStep?.title}</CardTitle>
				<div className="mt-3 flex items-center gap-2">
					{steps.map((step, index) => {
						const isCompleted = index < currentIndex
						const isCurrent = index === currentIndex
						return (
							<React.Fragment key={index}>
								<div className="flex items-center gap-1.5">
									<div
										className={[
											"flex size-6 items-center justify-center rounded-full text-xs font-semibold transition-colors",
											isCompleted
												? "bg-primary text-primary-foreground"
												: isCurrent
													? "bg-primary text-primary-foreground ring-primary/30 ring-2"
													: "bg-muted text-muted-foreground",
										].join(" ")}
									>
										{isCompleted ? (
											<HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4" />
										) : (
											<span>{index + 1}</span>
										)}
									</div>
									<span
										className={[
											"text-sm font-medium",
											isCurrent ? "text-foreground" : "text-muted-foreground",
										].join(" ")}
									>
										{step.title}
									</span>
								</div>
								{index < steps.length - 1 && (
									<div
										className={[
											"h-px flex-1",
											isCompleted ? "bg-primary" : "bg-border",
										].join(" ")}
									/>
								)}
							</React.Fragment>
						)
					})}
				</div>
			</CardHeader>

			<CardContent className="py-6">{currentStep?.content}</CardContent>

			<CardFooter className="flex justify-between">
				<Button variant="outline" onClick={goBack} disabled={isFirst}>
					Back
				</Button>
				{isLast ? (
					<Button onClick={onFinish} disabled={!canProceed || isFinishing}>
						{isFinishing && <Spinner className="mr-1.5" />}
						Finish
					</Button>
				) : (
					<Button onClick={goNext} disabled={!canProceed}>
						Next
					</Button>
				)}
			</CardFooter>
		</Card>
	)
}
