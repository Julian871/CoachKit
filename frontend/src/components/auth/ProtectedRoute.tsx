import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useEffect, useState } from 'react'

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Ждём восстановления сессии (даём время на вызов /refresh)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)  // ← увеличил до 1.5 секунд

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Если авторизация уже есть — сразу убираем загрузку
    if (isAuthenticated === true) {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-purple-200/60">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute