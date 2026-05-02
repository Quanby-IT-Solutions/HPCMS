"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

function ChatBubbleIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
		</svg>
	)
}

function CloseIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	)
}

function BotIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 8V4H8" />
			<rect width="16" height="12" x="4" y="8" rx="2" />
			<path d="M2 14h2" />
			<path d="M20 14h2" />
			<path d="M15 13v2" />
			<path d="M9 13v2" />
		</svg>
	)
}

function ArrowUpIcon({ className }: { className?: string }) {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
			<path d="m5 12 7-7 7 7" />
			<path d="M12 19V5" />
		</svg>
	)
}

type Message = {
	id: string
	text: string
	sender: "bot" | "user"
}

export function ChatbotWidget() {
	const [open, setOpen] = useState(false)
	const [input, setInput] = useState("")
	const [messages, setMessages] = useState<Message[]>([
		{ id: "1", text: "Hi there! I'm the SLMC Assistant. How can I help you today?", sender: "bot" }
	])
	const [isTyping, setIsTyping] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages, isTyping])

	const handleSend = (text: string) => {
		if (!text.trim()) return
		const newMsg: Message = { id: Date.now().toString(), text, sender: "user" }
		setMessages((prev) => [...prev, newMsg])
		setInput("")
		
		setIsTyping(true)
		setTimeout(() => {
			setIsTyping(false)
			setMessages((prev) => [
				...prev, 
				{ id: (Date.now() + 1).toString(), text: "I can help with that. Could you please provide your Case ID or more details?", sender: "bot" }
			])
		}, 1500)
	}

	const suggestions = [
		"Track my LOA",
		"Find a doctor",
		"Billing help",
		"Schedule appointment"
	]

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{ type: "spring", stiffness: 400, damping: 30 }}
						style={{ originX: 1, originY: 1 }}
						className="bg-card border-border shadow-2xl mb-4 flex w-full flex-col overflow-hidden rounded-2xl border sm:h-[500px] sm:w-[360px]"
					>
						{/* Header */}
						<div className="bg-primary text-primary-foreground flex items-center justify-between px-4 py-3">
							<div className="flex items-center gap-2">
								<BotIcon className="size-5" />
								<span className="font-semibold">SLMC Assistant</span>
							</div>
							<button 
								onClick={() => setOpen(false)}
								className="text-primary-foreground/80 hover:text-primary-foreground focus:outline-none"
							>
								<CloseIcon className="size-5" />
							</button>
						</div>

						{/* Messages Area */}
						<div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
							<AnimatePresence initial={false}>
								{messages.map((msg) => (
									<motion.div
										key={msg.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
									>
										<div
											className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
												msg.sender === "user" 
													? "bg-primary text-primary-foreground rounded-tr-sm" 
													: "bg-secondary text-secondary-foreground rounded-tl-sm"
											}`}
										>
											{msg.text}
										</div>
									</motion.div>
								))}
							</AnimatePresence>
							
							{isTyping && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="flex w-full justify-start"
								>
									<div className="bg-secondary text-secondary-foreground flex max-w-[85%] items-center gap-1 rounded-2xl rounded-tl-sm px-4 py-3">
										<motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, times: [0, 0.5, 1] }} className="bg-muted-foreground size-1.5 rounded-full" />
										<motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, times: [0, 0.5, 1], delay: 0.2 }} className="bg-muted-foreground size-1.5 rounded-full" />
										<motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, times: [0, 0.5, 1], delay: 0.4 }} className="bg-muted-foreground size-1.5 rounded-full" />
									</div>
								</motion.div>
							)}
							<div ref={messagesEndRef} />
						</div>

						{/* Quick Actions */}
						<div className="no-scrollbar flex overflow-x-auto px-4 pb-3">
							<div className="flex gap-2">
								{suggestions.map((suggestion) => (
									<motion.button
										key={suggestion}
										whileHover={{ scale: 1.03 }}
										whileTap={{ scale: 0.97 }}
										onClick={() => handleSend(suggestion)}
										className="bg-secondary text-secondary-foreground whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium"
									>
										{suggestion}
									</motion.button>
								))}
							</div>
						</div>

						{/* Input Area */}
						<div className="border-border border-t p-3">
							<form 
								onSubmit={(e) => {
									e.preventDefault()
									handleSend(input)
								}}
								className="bg-background focus-within:ring-ring border-border flex items-center rounded-full border px-1 py-1 focus-within:ring-2 focus-within:ring-offset-0"
							>
								<input
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder="Type your message..."
									className="placeholder:text-muted-foreground flex-1 bg-transparent px-3 py-1.5 text-sm focus:outline-none"
								/>
								<button
									type="submit"
									disabled={!input.trim()}
									className="bg-primary text-primary-foreground disabled:bg-primary/50 flex size-8 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed"
								>
									<ArrowUpIcon className="size-4" />
								</button>
							</form>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.button
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 25 }}
				whileHover={{ scale: 1.08, boxShadow: "0px 10px 25px -5px var(--primary)" }}
				whileTap={{ scale: 0.95 }}
				onClick={() => setOpen(!open)}
				className="bg-primary text-primary-foreground shadow-xl relative flex size-[60px] items-center justify-center rounded-full"
				aria-label={open ? "Close chat" : "Open chat"}
			>
				<AnimatePresence mode="wait">
					<motion.div
						key={open ? "close" : "chat"}
						initial={{ opacity: 0, rotate: open ? -90 : 90, scale: 0.5 }}
						animate={{ opacity: 1, rotate: 0, scale: 1 }}
						exit={{ opacity: 0, rotate: open ? 90 : -90, scale: 0.5 }}
						transition={{ duration: 0.2 }}
						className="absolute"
					>
						{open ? <CloseIcon className="size-6" /> : <ChatBubbleIcon className="size-6" />}
					</motion.div>
				</AnimatePresence>
			</motion.button>
		</div>
	)
}
