import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useAuth } from '../hooks/useAuth'
import BottomNavigation from '../components/layout/BottomNavigation'
import { 
  LogOut, 
  CheckCircle2, 
  Activity, 
  Calendar, 
  Users,
  Dumbbell,
  ChevronRight,
  User as UserIcon,
  Loader2
} from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { logout } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user !== null) {
      setLoading(false)
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-purple-200/60">Загрузка профиля...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Ошибка</h1>
          <p className="text-purple-200/60 mb-6">Не удалось загрузить профиль</p>
          <button onClick={() => window.location.href = '/login'} className="btn-primary w-full">
            Войти
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 pb-24 md:pb-8">
      {/* Top Bar */}
      <div className="pt-12 px-6 pb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Добро пожаловать, <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                {user?.name || 'Тренер'}
              </span>
            </h1>
            <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-white text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'T'}
            </span>
          </div>
        </div>
      </div>

      <main className="px-6 max-w-5xl mx-auto space-y-6">

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="w-full mt-4 flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900/40 border border-purple-500/10 text-slate-400 font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5" />
          Выйти из системы
        </button>
      </main>

      <BottomNavigation />
    </div>
  )
}

export default Dashboard