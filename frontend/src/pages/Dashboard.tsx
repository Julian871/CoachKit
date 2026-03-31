import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useAuth } from '../hooks/useAuth'
import { 
  LogOut, 
  CheckCircle2, 
  Activity, 
  Calendar, 
  Users,
  Dumbbell,
  ChevronRight,
  User as UserIcon,
  Loader2,
  LayoutDashboardIcon,
  Home
} from 'lucide-react'

const Dashboard = () => {
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
        {/* Verification Status Card */}
        <div className="glass-card rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="text-green-400 w-7 h-7" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Аккаунт подтверждён</h3>
            <p className="text-slate-400 text-sm">Все функции разблокированы</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-3xl p-6 space-y-2">
            <Users className="text-purple-400 w-6 h-6 mb-2" />
            <div className="text-3xl font-bold text-white leading-none">0</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Активных клиентов</div>
          </div>
          <div className="glass-card rounded-3xl p-6 space-y-2">
            <Dumbbell className="text-purple-400 w-6 h-6 mb-2" />
            <div className="text-3xl font-bold text-white leading-none">0</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Шаблонов тренировок</div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-bold text-white">Недавняя активность</h2>
          </div>
          
          <div className="glass-card rounded-2xl p-8 text-center">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Пока нет активности</p>
            <p className="text-slate-600 text-xs mt-1">Начните добавлять клиентов и тренировки</p>
          </div>
        </section>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="w-full mt-4 flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900/40 border border-purple-500/10 text-slate-400 font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5" />
          Выйти из системы
        </button>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-slate-900/80 backdrop-blur-xl border-t border-purple-500/10 flex items-center justify-around px-6 md:hidden">
        <div className="flex flex-col items-center gap-1 text-slate-500">
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-medium">Календарь</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-500">
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-medium">Клиенты</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-500">
          <UserIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium">Профиль</span>
        </div>
      </nav>
    </div>
  )
}

export default Dashboard