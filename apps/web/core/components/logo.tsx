"use client"

import * as React from "react"
import type { Route } from "next"
import Link from "next/link"
import Image from "next/image"

import { Button, buttonVariants, type ButtonVariants } from "@/core/components/ui/button"
import { cn } from "@/core/lib/utils"

export interface LogoIconProps extends React.ComponentPropsWithoutRef<"div"> {
	size?: number
}

export const LogoIcon = React.memo(
	({ size = 24, className, ...props }: LogoIconProps) => {
		return (
			<div className={cn("relative shrink-0", className)} style={{ width: size, height: size }} {...props}>
				<Image
					src="/logo/stlukes.png"
					alt="St. Luke's Logo"
					fill
					className="object-contain"
				/>
			</div>
		)
	}
)
LogoIcon.displayName = "LogoIcon"

export interface LogoProps {
	text?: string
	href?: Route<string>
	showIcon?: boolean
	size?: ButtonVariants["size"]
	variant?: ButtonVariants["variant"]
	className?: string
}

export function Logo({
	text = "Turbo Template",
	href,
	size = "lg",
	variant = "link",
	showIcon = true,
	className,
}: LogoProps) {
	const content = (
		<>
			{showIcon && <LogoIcon size={32} data-icon="inline-start" />}
			{text}
		</>
	)

	if (href) {
		return (
			<Link
				className={cn(buttonVariants({ size, variant }), "text-foreground", className)}
				href={href}
			>
				{content}
			</Link>
		)
	}

	return (
		<Button size={size} variant={variant} className={cn("text-foreground", className)}>
			{content}
		</Button>
	)
}
