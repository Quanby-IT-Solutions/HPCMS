/**
 * Tiny dependency-free markdown renderer for KB articles. Supports:
 *  - # / ## / ### headings
 *  - paragraphs (blank-line separated)
 *  - **bold** and *italic*
 *  - [link](url) — only http/https/relative
 *  - ordered (1.) and unordered (- *) lists
 *  - inline `code`
 *
 * NOT a full CommonMark implementation. Backend-rendered HTML can replace this
 * once the backend ships sanitized markdown.
 */
export function renderMarkdown(src: string): string {
	const escape = (s: string) =>
		s
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")

	function inline(line: string): string {
		// inline code
		let out = escape(line).replace(/`([^`]+)`/g, '<code class="bg-muted rounded px-1 py-0.5 text-[0.9em]">$1</code>')
		// bold
		out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
		// italic
		out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>")
		// links — only http/https or starts with /
		out = out.replace(
			/\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]+)\)/g,
			(_, label, href) =>
				`<a href="${href}" class="text-primary hover:underline">${label}</a>`
		)
		return out
	}

	const lines = src.split(/\r?\n/)
	const html: string[] = []
	let i = 0

	while (i < lines.length) {
		const line = lines[i] ?? ""
		const trimmed = line.trim()

		if (trimmed.length === 0) {
			i++
			continue
		}

		const heading = /^(#{1,3})\s+(.*)/.exec(trimmed)
		if (heading) {
			const level = heading[1]!.length
			const text = inline(heading[2] ?? "")
			const cls =
				level === 1
					? "mt-6 mb-3 text-2xl font-bold"
					: level === 2
						? "mt-5 mb-2 text-xl font-semibold"
						: "mt-4 mb-2 text-base font-semibold"
			html.push(`<h${level} class="${cls}">${text}</h${level}>`)
			i++
			continue
		}

		// unordered list
		if (/^[-*]\s+/.test(trimmed)) {
			const items: string[] = []
			while (i < lines.length && /^[-*]\s+/.test((lines[i] ?? "").trim())) {
				const m = /^[-*]\s+(.*)/.exec((lines[i] ?? "").trim())
				items.push(`<li>${inline(m?.[1] ?? "")}</li>`)
				i++
			}
			html.push(`<ul class="my-3 list-disc pl-6">${items.join("")}</ul>`)
			continue
		}

		// ordered list
		if (/^\d+\.\s+/.test(trimmed)) {
			const items: string[] = []
			while (i < lines.length && /^\d+\.\s+/.test((lines[i] ?? "").trim())) {
				const m = /^\d+\.\s+(.*)/.exec((lines[i] ?? "").trim())
				items.push(`<li>${inline(m?.[1] ?? "")}</li>`)
				i++
			}
			html.push(`<ol class="my-3 list-decimal pl-6">${items.join("")}</ol>`)
			continue
		}

		// paragraph
		const paraLines: string[] = [trimmed]
		i++
		while (
			i < lines.length &&
			(lines[i] ?? "").trim().length > 0 &&
			!/^(#{1,3}\s|[-*]\s|\d+\.\s)/.test((lines[i] ?? "").trim())
		) {
			paraLines.push((lines[i] ?? "").trim())
			i++
		}
		html.push(`<p class="my-2">${inline(paraLines.join(" "))}</p>`)
	}

	return html.join("\n")
}
