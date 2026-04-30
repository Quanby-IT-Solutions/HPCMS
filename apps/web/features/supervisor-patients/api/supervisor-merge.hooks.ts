"use client"

import { useMutation } from "@tanstack/react-query"

import { orpc } from "@/services/orpc/client"

export function useMergePatientsMutation() {
	return useMutation(orpc.supervisor.patients.merge.mutationOptions())
}
