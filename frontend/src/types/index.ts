export type AccountType = 'SAVINGS' | 'CURRENT';

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER_IN' | 'TRANSFER_OUT';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface TokenRefreshResponse {
  token: string;
  refreshToken: string;
}

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  type: AccountType;
  balance: number;
  formattedBalance: string;
  createdAt: string;
}

export interface Balance {
  accountId: string;
  balance: number;
  formattedBalance: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  formattedAmount: string;
  description: string;
  balanceAfter: number;
  formattedBalanceAfter: string;
  createdAt: string;
}

export interface AccountSummary {
  accountNumber: string;
  type: AccountType;
  balance: number;
  formattedBalance: string;
}

export interface MonthlySpending {
  month: string;
  income: number;
  expenses: number;
}

export interface Dashboard {
  totalBalance: number;
  formattedTotalBalance: string;
  totalAccounts: number;
  monthlyIncome: number;
  formattedMonthlyIncome: string;
  monthlyExpenses: number;
  formattedMonthlyExpenses: string;
  recentTransactions: Transaction[];
  accountSummaries: AccountSummary[];
  spendingData: MonthlySpending[];
}

export interface ChatResponse {
  reply: string;
  conversationId: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CreateAccountPayload {
  type: AccountType;
}

export interface DepositPayload {
  accountId: string;
  amount: number;
  description?: string;
}

export interface WithdrawPayload {
  accountId: string;
  amount: number;
  description?: string;
}

export interface TransferPayload {
  fromAccountId: string;
  toAccountNumber: string;
  amount: number;
  description?: string;
}

export interface ChatPayload {
  message: string;
  conversationId?: string;
}
