// src/hooks/useSessionRefresh.ts

import { useEffect, useRef } from 'react'
import { useAuthStore } from '../stores/authStore'
import { refreshSession } from '../api/authApi'

export const useSessionRefresh = () => {
  const { setAuth, clearAuth, isAuthenticated } = useAuthStore()
  const hasRestored = useRef(false)

  useEffect(() => {
    const restoreSession = async () => {
      console.log('🔄 restoreSession started', { isAuthenticated, hasRestored: hasRestored.current })
      
      if (isAuthenticated || hasRestored.current) {
        console.log('⏭️ Skipping restore (already authenticated or restored)')
        return
      }
      
      hasRestored.current = true

      try {
        console.log('📡 Calling /refresh...')
        const data = await refreshSession()
        console.log('✅ Refresh response:', data)
        
        setAuth(data.accessToken, {
          id: data.userId,
          email: data.email,
          name: data.name,
          emailVerified: data.emailVerified
        })
        
        console.log('🎉 Session restored for:', data.email)
      } catch (error: any) {
        console.log('❌ Refresh failed:', error.response?.status, error.response?.data)
        clearAuth()
      }
    }

    restoreSession()
  }, [setAuth, clearAuth, isAuthenticated])
}