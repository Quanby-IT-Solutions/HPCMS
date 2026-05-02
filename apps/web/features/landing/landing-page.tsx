"use client"

import { useState } from "react"
import { LandingNavbar } from "@/features/landing/landing-navbar"
import { HeroSection } from "@/features/landing/hero-section"
import { ProblemSection } from "@/features/landing/problem-section"
import { ArchitectureSection } from "@/features/landing/architecture-section"
import { ModulesSection } from "@/features/landing/modules-section"
import { FhirSection } from "@/features/landing/fhir-section"
import { SecuritySection } from "@/features/landing/security-section"
import { RoadmapSection } from "@/features/landing/roadmap-section"
import { CtaSection } from "@/features/landing/cta-section"
import { LandingFooter } from "@/features/landing/landing-footer"

export function LandingPage() {
	const [isLight, setIsLight] = useState(false)

	return (
		<div
			className={isLight ? "" : "dark"}
			style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", backgroundColor: "var(--background)", color: "var(--foreground)" }}
		>
			<LandingNavbar isLight={isLight} onToggleTheme={() => setIsLight((v) => !v)} />
			<HeroSection />
			<ProblemSection />
			<ArchitectureSection />
			<ModulesSection />
			<FhirSection />
			<SecuritySection />
			<RoadmapSection />
			<CtaSection />
			<LandingFooter />
		</div>
	)
}
