import api from '@/api/axios';
import type { Account, ApiResponse, Balance, CreateAccountPayload } from '@/types';

export async function createAccount(payload: CreateAccountPayload): Promise<Account> {
  const { data } = await api.post<ApiResponse<Account>>('/api/accounts', payload);
  return data.data;
}

export async function getAccounts(): Promise<Account[]> {
  const { data } = await api.get<ApiResponse<Account[]>>('/api/accounts');
  return data.data;
}

export async function getAccount(id: string): Promise<Account> {
  const { data } = await api.get<ApiResponse<Account>>(`/api/accounts/${id}`);
  return data.data;
}

export async function getBalance(id: string): Promise<Balance> {
  const { data } = await api.get<ApiResponse<Balance>>(`/api/accounts/${id}/balance`);
  return data.data;
}
