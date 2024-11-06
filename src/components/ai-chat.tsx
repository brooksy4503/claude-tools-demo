'use client'

import * as React from "react"
import { MessageSquare, Send } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const tools = [
  {
    id: 'sentiment',
    name: 'Sentiment Analysis',
    description: 'Analyzes the sentiment of text',
    example: 'Check sentiment: I love this product!',
    icon: MessageSquare
  },
  {
    id: 'wordcount',
    name: 'Word Counter',
    description: 'Counts the number of words in text',
    example: 'Count words: The quick brown fox jumps over the lazy dog',
    icon: MessageSquare
  },
  {
    id: 'datetime',
    name: 'Current DateTime',
    description: 'Gets the current date and time',
    example: 'What time is it?',
    icon: MessageSquare
  },
  {
    id: 'hackernews',
    name: 'Hacker News Top Stories',
    description: 'Fetches the top 3 current stories from Hacker News',
    example: 'What are the top stories on Hacker News?',
    icon: MessageSquare
  }
]

export function AiChat() {
  const [messages, setMessages] = React.useState([
    {
      role: 'assistant',
      content: 'Hello! I can help you with various tasks. Try out the tools in the sidebar!'
    }
  ])
  const [input, setInput] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')
  }

  return (
    <div className="grid h-screen md:grid-cols-[280px_1fr]">
      <div className="flex flex-col h-screen">
        <main className="flex-1 overflow-auto p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </main>
        <footer className="border-t p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-4">
            <Textarea
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[60px]"
            />
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </footer>
      </div>
    </div>
  )
}