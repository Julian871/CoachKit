import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => navigate('/verify-email-sent'),
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.accessToken, {
        id: data.userId,
        email: data.email,
        name: data.name,
        emailVerified: data.emailVerified
      });
      navigate('/dashboard');
    },
  });

  const logout = () => {
    clearAuth();
    navigate('/login');
  };

  return {
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
  };
};