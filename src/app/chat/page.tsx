'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { Send, Loader2, Trash2, Bot, User } from 'lucide-react';

export default function ChatPage() {
  const { chatMessages, addChatMessage, clearChat, phrases, _hasHydrated } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput('');
    addChatMessage('user', message);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          phrases: phrases.map((p) => ({ phrase: p.phrase, translation: p.translation })),
          history: chatMessages.slice(-20).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to get response');
      }

      const data = await res.json();
      addChatMessage('assistant', data.reply);
    } catch (err) {
      addChatMessage(
        'assistant',
        err instanceof Error ? `Error: ${err.message}` : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!_hasHydrated) {
    return <div className="p-8 text-text-muted pulse-gentle">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen page-enter">
      {/* Header */}
      <div className="border-b border-border px-5 md:px-8 py-4 md:py-5 flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Practice Chat</h1>
          <p className="text-text-muted text-sm mt-0.5">
            {phrases.length > 0
              ? `Conversing with ${phrases.length} phrases in context`
              : 'Add phrases to your library for contextual conversation'}
          </p>
        </div>
        {chatMessages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-2 text-text-muted text-sm hover:text-danger transition-colors"
          >
            <Trash2 size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-5">
              <Bot size={28} className="text-text-muted" />
            </div>
            <p className="text-text-secondary font-medium mb-1">Start a conversation</p>
            <p className="text-text-muted text-sm max-w-sm">
              The AI will use your common phrases to guide the conversation,
              helping you practice in realistic scenarios.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {chatMessages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i === chatMessages.length - 1 ? 0.1 : 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} className="text-secondary" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-accent/15 text-text-primary rounded-br-md'
                      : 'bg-card border border-border text-text-primary rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-text-muted text-[10px] mt-1.5">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} className="text-accent" />
                  </div>
                )}
              </motion.div>
            ))}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-secondary" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 size={16} className="animate-spin text-text-muted" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 md:px-8 py-4 shrink-0">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-accent text-white font-semibold px-5 py-3 rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
