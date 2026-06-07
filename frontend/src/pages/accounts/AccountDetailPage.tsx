import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowDownToLine, ArrowUpFromLine, Send } from 'lucide-react';
import { AccountCard } from '@/components/common/AccountCard';
import { AmountDisplay, isIncomeType } from '@/components/common/AmountDisplay';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccount } from '@/hooks/useAccounts';
import { useDeposit, useTransactions, useWithdraw } from '@/hooks/useTransactions';
import { formatDate } from '@/utils/formatDate';
import { MAX_TRANSACTION_AMOUNT } from '@/utils/constants';
import type { TransactionType } from '@/types';

type FilterType = 'ALL' | TransactionType;

export default function AccountDetailPage() {
  const { id = '' } = useParams();
  const { data: account, isLoading } = useAccount(id);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const { data: transactionsPage, isLoading: txLoading } = useTransactions(id, page, 10);

  const deposit = useDeposit();
  const withdraw = useWithdraw();

  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setAmount('');
    setDescription('');
  };

  const handleDeposit = async () => {
    if (!account) return;
    await deposit.mutateAsync({
      accountId: account.id,
      amount: parseFloat(amount),
      description: description || undefined,
    });
    setDepositOpen(false);
    resetForm();
  };

  const handleWithdraw = async () => {
    if (!account) return;
    await withdraw.mutateAsync({
      accountId: account.id,
      amount: parseFloat(amount),
      description: description || undefined,
    });
    setWithdrawOpen(false);
    resetForm();
  };

  const filteredTransactions =
    transactionsPage?.content.filter((tx) => filter === 'ALL' || tx.type === filter) ?? [];

  const withdrawError =
    account && amount && parseFloat(amount) > account.balance
      ? 'Amount exceeds available balance'
      : '';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!account) {
    return <EmptyState title="Account not found" description="This account does not exist" />;
  }

  return (
    <div>
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/accounts">
          <ArrowLeft className="h-4 w-4" />
          Back to Accounts
        </Link>
      </Button>

      <AccountCard account={account} variant="premium" showActions={false} />

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="success" onClick={() => { resetForm(); setDepositOpen(true); }}>
          <ArrowDownToLine className="h-4 w-4" />
          Deposit
        </Button>
        <Button variant="outline" className="text-amber-400" onClick={() => { resetForm(); setWithdrawOpen(true); }}>
          <ArrowUpFromLine className="h-4 w-4" />
          Withdraw
        </Button>
        <Button asChild variant="default">
          <Link to="/transfer">
            <Send className="h-4 w-4" />
            Transfer
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Transaction History</h2>

        <Tabs value={filter} onValueChange={(v) => { setFilter(v as FilterType); setPage(0); }}>
          <TabsList>
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="DEPOSIT">Deposits</TabsTrigger>
            <TabsTrigger value="WITHDRAWAL">Withdrawals</TabsTrigger>
            <TabsTrigger value="TRANSFER_IN">Transfers</TabsTrigger>
          </TabsList>

          <TabsContent value={filter}>
            {txLoading ? (
              <Skeleton className="mt-4 h-64 w-full" />
            ) : filteredTransactions.length ? (
              <div className="mt-4 overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-card">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-muted">Date</th>
                      <th className="px-4 py-3 text-left font-medium text-muted">Description</th>
                      <th className="px-4 py-3 text-left font-medium text-muted">Type</th>
                      <th className="px-4 py-3 text-right font-medium text-muted">Amount</th>
                      <th className="px-4 py-3 text-right font-medium text-muted">Balance After</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-border/50 hover:bg-card-hover">
                        <td className="px-4 py-3 text-muted">{formatDate(tx.createdAt)}</td>
                        <td className="px-4 py-3">{tx.description}</td>
                        <td className="px-4 py-3">
                          <Badge variant={isIncomeType(tx.type) ? 'success' : 'destructive'}>
                            {tx.type.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <AmountDisplay amount={tx.amount} formattedAmount={tx.formattedAmount} type={tx.type} />
                        </td>
                        <td className="px-4 py-3 text-right text-muted">{tx.formattedBalanceAfter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No transactions" description="Transactions will appear here" />
            )}

            {transactionsPage && transactionsPage.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted">
                  Page {page + 1} of {transactionsPage.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={transactionsPage.last}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit Funds</DialogTitle>
            <DialogDescription>Add money to {account.accountNumber}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                min={1}
                max={MAX_TRANSACTION_AMOUNT}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Salary, refund, etc."
              />
            </div>
            <Button
              className="w-full"
              variant="success"
              loading={deposit.isPending}
              disabled={!amount || parseFloat(amount) <= 0}
              onClick={handleDeposit}
            >
              Confirm Deposit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>Withdraw from {account.accountNumber}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted">
              Available balance: <span className="font-semibold text-accent">{account.formattedBalance}</span>
            </p>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                min={1}
                max={MAX_TRANSACTION_AMOUNT}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
              />
              {withdrawError && <p className="text-sm text-destructive">{withdrawError}</p>}
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ATM withdrawal, payment, etc."
              />
            </div>
            <Button
              className="w-full"
              loading={withdraw.isPending}
              disabled={!amount || parseFloat(amount) <= 0 || !!withdrawError}
              onClick={handleWithdraw}
            >
              Confirm Withdrawal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
