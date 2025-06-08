"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface ChatButtonProps {
  onClick: () => void
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg hover:scale-105 transition-transform"
      size="lg"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Open chat</span>
    </Button>
  )
} 