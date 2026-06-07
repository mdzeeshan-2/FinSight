import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AccountCard } from '@/components/common/AccountCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccounts, useCreateAccount } from '@/hooks/useAccounts';
import type { AccountType } from '@/types';

export default function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts();
  const createAccount = useCreateAccount();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<AccountType>('SAVINGS');

  const handleCreate = async () => {
    await createAccount.mutateAsync({ type: selectedType });
    setModalOpen(false);
  };

  return (
    <div>
      <Header
        title="My Accounts"
        subtitle="Manage your bank accounts"
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Account
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : accounts?.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} variant="premium" />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No accounts yet"
          description="Create your first account to get started"
        />
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
            <DialogDescription>Choose the type of account you want to open</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {(['SAVINGS', 'CURRENT'] as AccountType[]).map((type) => (
              <label
                key={type}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                  selectedType === type
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-card-hover'
                }`}
              >
                <input
                  type="radio"
                  name="accountType"
                  checked={selectedType === type}
                  onChange={() => setSelectedType(type)}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">{type}</p>
                  <p className="text-sm text-muted">
                    {type === 'SAVINGS'
                      ? 'Earn interest on your savings with zero minimum balance'
                      : 'For daily transactions and business payments'}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <Button onClick={handleCreate} loading={createAccount.isPending} className="w-full">
            Create Account
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
