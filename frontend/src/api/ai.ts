import api from '@/api/axios';
import type { ApiResponse, ChatPayload, ChatResponse } from '@/types';

export async function sendMessage(payload: ChatPayload): Promise<ChatResponse> {
  const { data } = await api.post<ApiResponse<ChatResponse>>('/api/ai/chat', payload);
  return data.data;
}
