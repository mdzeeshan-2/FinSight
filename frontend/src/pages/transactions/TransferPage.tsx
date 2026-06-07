import { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccounts } from '@/hooks/useAccounts';
import { useTransfer } from '@/hooks/useTransactions';
import { formatCurrency, maskAccountNumber } from '@/utils/formatCurrency';
import { MAX_TRANSACTION_AMOUNT } from '@/utils/constants';

export default function TransferPage() {
  const { data: accounts } = useAccounts();
  const transfer = useTransfer();

  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);
  const [lastTransfer, setLastTransfer] = useState<{ amount: string; from: string; to: string } | null>(null);

  const fromAccount = accounts?.find((a) => a.id === fromAccountId);

  const summary = useMemo(() => {
    if (!fromAccount || !toAccountNumber || !amount) return null;
    return `You are transferring ${formatCurrency(parseFloat(amount))} from ${maskAccountNumber(fromAccount.accountNumber)} to ${maskAccountNumber(toAccountNumber)}`;
  }, [fromAccount, toAccountNumber, amount]);

  const balanceError =
    fromAccount && amount && parseFloat(amount) > fromAccount.balance
      ? 'Insufficient balance'
      : '';

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAccountId || !toAccountNumber || !amount) return;

    await transfer.mutateAsync({
      fromAccountId,
      toAccountNumber: toAccountNumber.toUpperCase(),
      amount: parseFloat(amount),
      description: description || undefined,
    });

    setLastTransfer({
      amount,
      from: fromAccount?.accountNumber ?? '',
      to: toAccountNumber,
    });
    setSuccess(true);
    setFromAccountId('');
    setToAccountNumber('');
    setAmount('');
    setDescription('');
  };

  if (success && lastTransfer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 animate-bounce">
          <CheckCircle2 className="h-20 w-20 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Transfer Successful!</h2>
        <p className="mt-2 max-w-md text-muted">
          {formatCurrency(parseFloat(lastTransfer.amount))} sent from{' '}
          {maskAccountNumber(lastTransfer.from)} to {maskAccountNumber(lastTransfer.to)}
        </p>
        <Button className="mt-8" onClick={() => setSuccess(false)}>
          Make Another Transfer
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Header title="Transfer Money" subtitle="Send money to another FinSight account" />

      <Card>
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTransfer} className="space-y-5">
            <div className="space-y-2">
              <Label>From Account</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                required
              >
                <option value="">Select account</option>
                {accounts?.map((account) => (
                  <option key={account.id} value={account.id}>
                    {maskAccountNumber(account.accountNumber)} — {account.formattedBalance}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>To Account Number</Label>
              <Input
                placeholder="FS1234567890"
                value={toAccountNumber}
                onChange={(e) => setToAccountNumber(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                min={1}
                max={MAX_TRANSACTION_AMOUNT}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              {balanceError && <p className="text-sm text-destructive">{balanceError}</p>}
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Rent, gift, payment..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {summary && (
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm text-foreground">
                {summary}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={transfer.isPending}
              disabled={!!balanceError || !fromAccountId || !toAccountNumber || !amount}
            >
              Confirm Transfer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
