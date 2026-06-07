import { cn } from '@/lib/utils';
import type { TransactionType } from '@/types';

interface AmountDisplayProps {
  amount: number;
  formattedAmount?: string;
  type?: TransactionType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const incomeTypes: TransactionType[] = ['DEPOSIT', 'TRANSFER_IN'];

export function AmountDisplay({
  amount,
  formattedAmount,
  type,
  className,
  size = 'md',
}: AmountDisplayProps) {
  const isPositive = type ? incomeTypes.includes(type) : amount >= 0;
  const display = formattedAmount ?? `₹${amount.toFixed(2)}`;

  const sizeClass = {
    sm: 'text-sm',
    md: 'text-base font-semibold',
    lg: 'text-2xl font-bold',
  }[size];

  return (
    <span
      className={cn(
        sizeClass,
        isPositive ? 'text-accent' : 'text-destructive',
        className
      )}
    >
      {isPositive && type ? '+' : ''}
      {!isPositive && type ? '-' : ''}
      {display.replace(/^[+-]/, '')}
    </span>
  );
}

export function isIncomeType(type: TransactionType): boolean {
  return incomeTypes.includes(type);
}
