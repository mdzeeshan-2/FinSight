import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { TransactionItem } from '@/components/common/TransactionItem';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccounts } from '@/hooks/useAccounts';
import { useDashboard } from '@/hooks/useDashboard';

export default function TransactionsPage() {
  const { data: dashboard, isLoading } = useDashboard();
  const { data: accounts } = useAccounts();

  const accountNumberMap = new Map(
    accounts?.map((a) => [a.id, a.accountNumber]) ?? []
  );

  return (
    <div>
      <Header
        title="Transactions"
        subtitle="Recent activity across all accounts"
        action={
          <Button asChild>
            <Link to="/transfer">New Transfer</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : dashboard?.recentTransactions?.length ? (
            dashboard.recentTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                accountNumber={accountNumberMap.get(tx.accountId)}
              />
            ))
          ) : (
            <EmptyState
              title="No transactions yet"
              description="Deposits and transfers will show up here"
            />
          )}
        </CardContent>
      </Card>

      {accounts && accounts.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-4 text-lg font-semibold">View by Account</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <Button key={account.id} asChild variant="outline" className="h-auto justify-start p-4">
                <Link to={`/accounts/${account.id}`}>
                  <div className="text-left">
                    <p className="font-mono text-sm">{account.accountNumber}</p>
                    <p className="text-xs text-muted">{account.type} · {account.formattedBalance}</p>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
