import api from '@/api/axios';
import type { ApiResponse, Dashboard } from '@/types';

export async function getDashboard(): Promise<Dashboard> {
  const { data } = await api.get<ApiResponse<Dashboard>>('/api/dashboard');
  return data.data;
}
