import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TransactionItem } from '@/components/common/TransactionItem';
import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/useDashboard';
import { useAccounts } from '@/hooks/useAccounts';
import { formatCurrency } from '@/utils/formatCurrency';

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  loading,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        {loading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted">{title}</p>
              <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
              <p className="mt-1 text-xs text-muted">{subtitle}</p>
            </div>
            <div className={`rounded-lg p-2 ${color} bg-opacity-20`} style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useDashboard();
  const { data: accounts } = useAccounts();

  const accountNumberMap = new Map(
    accounts?.map((a) => [a.id, a.accountNumber]) ?? []
  );

  return (
    <div>
      <Header title="Dashboard" subtitle="Overview of your finances" />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={dashboard?.formattedTotalBalance ?? '₹0.00'}
          subtitle="across all accounts"
          icon={Wallet}
          color="text-accent"
          loading={isLoading}
        />
        <StatCard
          title="Monthly Income"
          value={dashboard?.formattedMonthlyIncome ?? '₹0.00'}
          subtitle="this month"
          icon={TrendingUp}
          color="text-accent"
          loading={isLoading}
        />
        <StatCard
          title="Monthly Expenses"
          value={dashboard?.formattedMonthlyExpenses ?? '₹0.00'}
          subtitle="this month"
          icon={TrendingDown}
          color="text-destructive"
          loading={isLoading}
        />
        <StatCard
          title="Total Accounts"
          value={String(dashboard?.totalAccounts ?? 0)}
          subtitle="active accounts"
          icon={CreditCard}
          color="text-primary"
          loading={isLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dashboard?.spendingData ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#64748B" />
                    <YAxis stroke="#64748B" tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8 }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#10B981" name="Income" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/transactions">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
              ) : dashboard?.recentTransactions?.length ? (
                dashboard.recentTransactions.map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    accountNumber={accountNumberMap.get(tx.accountId)}
                  />
                ))
              ) : (
                <EmptyState title="No transactions yet" description="Make a deposit to get started" />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Accounts</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link to="/accounts">+ New</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard?.accountSummaries?.length ? (
                dashboard.accountSummaries.map((summary) => (
                  <div
                    key={summary.accountNumber}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-mono text-sm">{summary.accountNumber.replace(/(.{4}).*(.{4})/, 'FS****$2')}</p>
                      <p className="text-xs text-muted">{summary.type}</p>
                    </div>
                    <p className="font-semibold text-accent">{summary.formattedBalance}</p>
                  </div>
                ))
              ) : (
                <EmptyState title="No accounts" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="success" className="h-auto flex-col gap-1 py-4">
                  <Link to="/accounts">
                    <ArrowDownToLine className="h-5 w-5" />
                    Deposit
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto flex-col gap-1 border-amber-500/50 py-4 text-amber-400">
                  <Link to="/accounts">
                    <ArrowUpFromLine className="h-5 w-5" />
                    Withdraw
                  </Link>
                </Button>
                <Button asChild variant="default" className="h-auto flex-col gap-1 py-4">
                  <Link to="/transfer">
                    <Send className="h-5 w-5" />
                    Transfer
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="h-auto flex-col gap-1 border-purple-500/30 py-4 text-purple-400">
                  <Link to="/ai-chat">
                    <Sparkles className="h-5 w-5" />
                    Chat with Maya
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
