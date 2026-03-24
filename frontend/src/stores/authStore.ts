import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
  emailVerified: boolean
}

interface AuthState {
  accessToken: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  updateEmailVerified: (status: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  setAuth: (token, user) => set({ 
    accessToken: token, 
    user: { ...user, emailVerified: user.emailVerified ?? false }, 
    isAuthenticated: true 
  }),
  clearAuth: () => set({ accessToken: null, user: null, isAuthenticated: false }),
  updateEmailVerified: (status) => set((state) => ({
    user: state.user ? { ...state.user, emailVerified: status } : null
  })),
}))