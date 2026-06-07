import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as authApi from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import type { LoginPayload, RegisterPayload } from '@/types';

export function useAuth() {
  const navigate = useNavigate();
  const { token, user, setAuth, logout: clearAuth, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const profile = await authApi.getMe();
        useAuthStore.setState({ user: profile });
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, [token, clearAuth]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await authApi.login(payload);
      setAuth(response.token, response.refreshToken, response.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    },
    [navigate, setAuth]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await authApi.register(payload);
      setAuth(response.token, response.refreshToken, response.user);
      toast.success(`Welcome to FinSight, ${response.user.name}!`);
      navigate('/dashboard');
    },
    [navigate, setAuth]
  );

  const logout = useCallback(() => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login');
  }, [clearAuth, navigate]);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: isAuthenticated(),
    login,
    register,
    logout,
  };
}
