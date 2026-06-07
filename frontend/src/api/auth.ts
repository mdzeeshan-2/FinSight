import api from '@/api/axios';
import type {
  ApiResponse,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  TokenRefreshResponse,
  User,
} from '@/types';

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', payload);
  return data.data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', payload);
  return data.data;
}

export async function refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
  const { data } = await api.post<ApiResponse<TokenRefreshResponse>>(
    '/api/auth/refresh',
    {},
    { headers: { Authorization: `Bearer ${refreshToken}` } }
  );
  return data.data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<ApiResponse<User>>('/api/auth/me');
  return data.data;
}
