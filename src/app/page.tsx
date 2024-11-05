'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl text-center font-bold mb-6">Claude Tools Demo</h1>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6 min-h-[300px] max-h-[500px] overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-4 ${msg.role === 'assistant' ? 'pl-4' : 'pr-4'}`}>
              <div className="font-bold mb-1">{msg.role === 'assistant' ? 'Claude' : 'You'}</div>
              <div className="bg-white rounded p-3 shadow whitespace-pre-wrap">
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="pl-4 mb-4">
              <div className="font-bold mb-1">Claude</div>
              <div className="bg-white rounded p-3 shadow">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Claude to analyze text sentiment or count words... (Shift+Enter for new line)"
            className="flex-1 p-2 border rounded resize-none min-h-[70px]"
            disabled={loading}
            rows={1}
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </main>
  );
} 