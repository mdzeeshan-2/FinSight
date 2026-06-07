import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { AmountDisplay, isIncomeType } from '@/components/common/AmountDisplay';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatDate';
import { maskAccountNumber } from '@/utils/formatCurrency';
import type { Transaction } from '@/types';

interface TransactionItemProps {
  transaction: Transaction;
  accountNumber?: string;
}

export function TransactionItem({ transaction, accountNumber }: TransactionItemProps) {
  const income = isIncomeType(transaction.type);

  const Icon = transaction.type.includes('TRANSFER')
    ? ArrowLeftRight
    : income
      ? ArrowDownLeft
      : ArrowUpRight;

  const typeBadgeVariant = income ? 'success' : 'destructive';

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-card-hover">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          income ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{transaction.description}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
          {accountNumber && <span>{maskAccountNumber(accountNumber)}</span>}
          <span>{formatDate(transaction.createdAt)}</span>
        </div>
      </div>
      <div className="text-right">
        <AmountDisplay
          amount={transaction.amount}
          formattedAmount={transaction.formattedAmount}
          type={transaction.type}
        />
        <Badge variant={typeBadgeVariant} className="mt-1">
          {transaction.type.replace('_', ' ')}
        </Badge>
      </div>
    </div>
  );
}
