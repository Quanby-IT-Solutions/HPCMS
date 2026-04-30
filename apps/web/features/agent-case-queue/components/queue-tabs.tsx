"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "@/core/components/ui/tabs"

export function QueueTabs() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const tab = searchParams.get("tab") ?? "mine"

	function setTab(value: string) {
		const params = new URLSearchParams(searchParams.toString())
		params.set("tab", value)
		params.delete("page")
		router.push(`?${params.toString()}`)
	}

	return (
		<Tabs value={tab} onValueChange={setTab}>
			<TabsList>
				<TabsTrigger value="mine">My Cases</TabsTrigger>
				<TabsTrigger value="team">Team</TabsTrigger>
				<TabsTrigger value="all_open">All Open</TabsTrigger>
			</TabsList>
		</Tabs>
	)
}
