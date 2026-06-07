export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ACCOUNTS: '/accounts',
  ACCOUNT_DETAIL: '/accounts/:id',
  TRANSACTIONS: '/transactions',
  TRANSFER: '/transfer',
  AI_CHAT: '/ai-chat',
} as const;

export const MAX_TRANSACTION_AMOUNT = 1_000_000;
