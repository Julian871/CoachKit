import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1/auth',
  withCredentials: true,
})

export const registerUser = async (data: any) => {
  const response = await api.post('/register', data);
  return response.data;
};

export const loginUser = async (data: any) => {
  const response = await api.post('/login', data);
  return response.data;
};

export const verifyEmail = async (email: string, code: string) => {
  const response = await api.get('/verify-email', { params: { email, code } })
  return response.data
}

export const resendVerification = async (email: string) => {
  const response = await api.post('/resend-verification', { email })
  return response.data
}

export const forgotPassword = async (email: string) => {
  const response = await api.post('/forgot-password', { email })
  return response.data
}

export const resetPassword = async (data: { email: string; code: string; newPassword: string }) => {
  const response = await api.post('/reset-password', data)
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get('/me')
  return response.data
}

export const refreshSession = async () => {
  const response = await api.post('/refresh')
  return response.data
}


