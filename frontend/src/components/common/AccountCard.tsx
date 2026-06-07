import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { maskAccountNumber } from '@/utils/formatCurrency';
import type { Account } from '@/types';

interface AccountCardProps {
  account: Account;
  variant?: 'default' | 'premium';
  showActions?: boolean;
}

export function AccountCard({ account, variant = 'default', showActions = true }: AccountCardProps) {
  const badgeVariant = account.type === 'SAVINGS' ? 'default' : 'warning';

  if (variant === 'premium') {
    return (
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-lg tracking-wider text-foreground">
                {maskAccountNumber(account.accountNumber)}
              </p>
              <Badge variant={badgeVariant} className="mt-2">
                {account.type}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Balance</p>
              <p className="text-2xl font-bold text-accent">{account.formattedBalance}</p>
            </div>
          </div>
          {showActions && (
            <div className="mt-6 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to={`/accounts/${account.id}`}>View Details</Link>
              </Button>
              <Button asChild variant="secondary" size="sm" className="flex-1">
                <Link to={`/accounts/${account.id}`}>Transactions</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-colors hover:bg-card-hover">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-sm text-muted">{maskAccountNumber(account.accountNumber)}</p>
            <Badge variant={badgeVariant} className="mt-1">
              {account.type}
            </Badge>
          </div>
          <p className="text-lg font-semibold text-accent">{account.formattedBalance}</p>
        </div>
      </CardContent>
    </Card>
  );
}
