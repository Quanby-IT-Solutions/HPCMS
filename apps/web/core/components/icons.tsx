import { cn } from "@/core/lib/utils"

type IconProps = { className?: string }

export function AlertCircle({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<line x1="12" x2="12" y1="8" y2="12" />
			<line x1="12" x2="12.01" y1="16" y2="16" />
		</svg>
	)
}

export function AlertTriangle({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
			<line x1="12" x2="12" y1="9" y2="13" />
			<line x1="12" x2="12.01" y1="17" y2="17" />
		</svg>
	)
}

export function CheckCircle({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
			<path d="m9 11 3 3L22 4" />
		</svg>
	)
}

export function ChevronLeft({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="m15 18-6-6 6-6" />
		</svg>
	)
}

export function Download({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="7 10 12 15 17 10" />
			<line x1="12" x2="12" y1="15" y2="3" />
		</svg>
	)
}

export function FileText({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
			<path d="M14 2v4a2 2 0 0 0 2 2h4" />
			<line x1="8" x2="16" y1="13" y2="13" />
			<line x1="8" x2="14" y1="17" y2="17" />
			<line x1="8" x2="10" y1="9" y2="9" />
		</svg>
	)
}

export function Loader2({ className }: IconProps) {
	return (
		<svg className={cn("size-4 animate-spin", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
		</svg>
	)
}

export function PlusCircle({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<line x1="12" x2="12" y1="8" y2="16" />
			<line x1="8" x2="16" y1="12" y2="12" />
		</svg>
	)
}

export function RotateCcw({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
			<path d="M3 3v5h5" />
		</svg>
	)
}

export function ShieldCheck({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
			<path d="m9 12 2 2 4-4" />
		</svg>
	)
}

export function Upload({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="17 8 12 3 7 8" />
			<line x1="12" x2="12" y1="3" y2="15" />
		</svg>
	)
}

export function X({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	)
}

export function Bell({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
			<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
		</svg>
	)
}

export function ExternalLink({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M15 3h6v6" />
			<path d="M10 14 21 3" />
			<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
		</svg>
	)
}

export function Filter({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
		</svg>
	)
}

export function Users({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	)
}

export function ClipboardList({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
			<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
			<path d="M12 11h4" />
			<path d="M12 16h4" />
			<path d="M8 11h.01" />
			<path d="M8 16h.01" />
		</svg>
	)
}

export function ChevronDown({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="m6 9 6 6 6-6" />
		</svg>
	)
}

export function UserPlus({ className }: IconProps) {
	return (
		<svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<line x1="19" x2="19" y1="8" y2="14" />
			<line x1="22" x2="16" y1="11" y2="11" />
		</svg>
	)
}
