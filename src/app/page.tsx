'use client';

import { useState, useRef, useEffect } from 'react';
import { Clock, MessageSquare, NewspaperIcon, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { UserIcon, BotIcon } from "@/components/ui/icons"
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

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
    icon: Clock
  },
  {
    id: 'hackernews',
    name: 'Hacker News Top Stories',
    description: 'Fetches the top 3 current stories from Hacker News',
    example: 'What are the top stories on Hacker News?',
    icon: NewspaperIcon
  }
]

// Add proper types for the markdown components
const markdownComponents: Components = {
  h1: ({children, ...props}) => <h1 className="text-2xl font-bold mb-4" {...props}>{children}</h1>,
  h2: ({children, ...props}) => <h2 className="text-xl font-bold mb-3" {...props}>{children}</h2>,
  h3: ({children, ...props}) => <h3 className="text-lg font-bold mb-2" {...props}>{children}</h3>,
  p: ({children, ...props}) => <p className="mb-2" {...props}>{children}</p>,
  ul: ({children, ...props}) => <ul className="list-disc pl-4 mb-2" {...props}>{children}</ul>,
  ol: ({children, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props}>{children}</ol>,
  li: ({children, ...props}) => <li className="mb-1" {...props}>{children}</li>,
  code: ({node, inline, className, children, ...props}: any) => {
    return inline ? (
      <code className="bg-muted px-1 py-0.5 rounded text-foreground" {...props}>
        {children}
      </code>
    ) : (
      <code className="block bg-muted p-2 rounded text-foreground font-medium" {...props}>
        {children}
      </code>
    );
  },
  blockquote: ({children, ...props}) => 
    <blockquote className="border-l-4 border-primary pl-4 italic" {...props}>{children}</blockquote>
};

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Hello! I can help you with various tasks. Try out the tools in the sidebar!'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            {
              role: 'user',
              content: input
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('Error:', data.error);
        return;
      }
      
      if (data.choices && data.choices[0]) {
        setMessages(prev => [...prev, 
          { role: 'user', content: input },
          { role: 'assistant', content: data.choices[0].message.content }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <TooltipProvider>
      <div className="grid h-[100dvh] md:grid-cols-[280px_1fr]">
        <aside className="border-r bg-muted/40 flex flex-col overflow-hidden">
          <div className="border-b px-4 py-2 flex-none">
            <h2 className="text-lg font-semibold">Available Tools</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="p-4 space-y-4">
              {tools.map((tool) => (
                <div key={tool.id} className="bg-card rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <tool.icon className="h-5 w-5" />
                    <h3 className="font-semibold">{tool.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{tool.description}</p>
                  <div className="bg-muted p-2 rounded-md">
                    <code className="text-xs">{tool.example}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
        
        <main className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-auto p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar>
                      <AvatarFallback>
                        <BotIcon className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 max-w-[80%]",
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <ReactMarkdown
                        className="prose dark:prose-invert prose-sm max-w-none"
                        components={markdownComponents}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>
                  {message.role === 'user' && (
                    <Avatar>
                      <AvatarFallback>
                        <UserIcon className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start gap-3">
                  <Avatar>
                    <AvatarFallback>
                      <BotIcon className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <footer className="border-t p-4 flex-none bg-background">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="min-h-[60px]"
                disabled={loading}
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </footer>
        </main>
      </div>
    </TooltipProvider>
  );
} 