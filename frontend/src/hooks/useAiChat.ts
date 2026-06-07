import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import * as aiApi from '@/api/ai';
import type { ChatMessage } from '@/types';

export function useAiChat(userName: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const initWelcome = useCallback(() => {
    if (initialized) return;
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hi ${userName}! 👋 I'm Maya, your FinSight banking assistant. I can help you understand your accounts, explain transactions, answer banking questions, and more. What can I help you with today?`,
        timestamp: new Date(),
      },
    ]);
    setInitialized(true);
  }, [initialized, userName]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await aiApi.sendMessage({
          message: trimmed,
          conversationId,
        });

        setConversationId(response.conversationId);

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.reply,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to get response from Maya');
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, isLoading]
  );

  return {
    messages,
    isLoading,
    sendMessage,
    initWelcome,
  };
}
