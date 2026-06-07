import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as transactionsApi from '@/api/transactions';
import type { DepositPayload, TransferPayload, WithdrawPayload } from '@/types';

export function useTransactions(accountId: string, page = 0, size = 10) {
  return useQuery({
    queryKey: ['transactions', accountId, page, size],
    queryFn: () => transactionsApi.getTransactions(accountId, page, size),
    enabled: !!accountId,
  });
}

export function useDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DepositPayload) => transactionsApi.deposit(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['accounts', variables.accountId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', variables.accountId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Deposit successful!');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Deposit failed');
    },
  });
}

export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WithdrawPayload) => transactionsApi.withdraw(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['accounts', variables.accountId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', variables.accountId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Withdrawal successful!');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    },
  });
}

export function useTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TransferPayload) => transactionsApi.transfer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Transfer completed successfully!');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Transfer failed');
    },
  });
}
