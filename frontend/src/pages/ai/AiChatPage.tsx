import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { useAiChat } from '@/hooks/useAiChat';
import { formatTime } from '@/utils/formatDate';
import { cn } from '@/lib/utils';

const SUGGESTED_QUESTIONS = [
  "What's my account balance?",
  'How do I transfer money?',
  'Explain my recent transactions',
  'What is a SAVINGS account?',
];

function TypingIndicator() {
  return (
    <div className="flex gap-1 px-2 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-muted animate-pulse-dot"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

export default function AiChatPage() {
  const user = useAuthStore((s) => s.user);
  const { messages, isLoading, sendMessage, initWelcome } = useAiChat(user?.name ?? 'there');
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initWelcome();
  }, [initWelcome]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const message = text ?? input;
    if (!message.trim()) return;
    setInput('');
    await sendMessage(message);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <Header title="Maya — AI Banking Assistant" subtitle="Ask anything about your finances" />

      <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-lg font-bold text-white">
          M
        </div>
        <div>
          <p className="font-semibold">Maya</p>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Online
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-border bg-background/50 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
          >
            {msg.role === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                M
              </div>
            )}
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
                msg.role === 'user'
                  ? 'bg-primary text-white'
                  : 'border border-border bg-card text-foreground'
              )}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p className="mt-1 text-[10px] opacity-60">{formatTime(msg.timestamp)}</p>
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary hover:text-foreground"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
              M
            </div>
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          placeholder="Ask Maya anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={isLoading}
          className="flex-1"
        />
        <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
