import api from '@/api/axios';
import type {
  ApiResponse,
  DepositPayload,
  PaginatedResponse,
  Transaction,
  TransferPayload,
  WithdrawPayload,
} from '@/types';

export async function deposit(payload: DepositPayload): Promise<Transaction> {
  const { data } = await api.post<ApiResponse<Transaction>>('/api/transactions/deposit', payload);
  return data.data;
}

export async function withdraw(payload: WithdrawPayload): Promise<Transaction> {
  const { data } = await api.post<ApiResponse<Transaction>>('/api/transactions/withdraw', payload);
  return data.data;
}

export async function transfer(payload: TransferPayload): Promise<Transaction> {
  const { data } = await api.post<ApiResponse<Transaction>>('/api/transactions/transfer', payload);
  return data.data;
}

export async function getTransactions(
  accountId: string,
  page = 0,
  size = 10
): Promise<PaginatedResponse<Transaction>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Transaction>>>(
    `/api/transactions/${accountId}`,
    { params: { page, size, sort: 'createdAt,desc' } }
  );
  return data.data;
}
