import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Calendar, Users, User as UserIcon, Activity } from 'lucide-react'

const BottomNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-slate-900/80 backdrop-blur-xl border-t border-purple-500/10 flex items-center justify-around px-6 md:hidden z-50">
      <button
        onClick={() => navigate('/dashboard')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/dashboard') ? 'text-purple-400' : 'text-slate-500 hover:text-purple-400'
        }`}
      >
        {isActive('/dashboard') && <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mb-1" />}
        <Activity className="w-6 h-6" />
        <span className="text-[10px] font-medium">Главная</span>
      </button>
      
      <button
        onClick={() => navigate('/calendar')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/calendar') ? 'text-purple-400' : 'text-slate-500 hover:text-purple-400'
        }`}
      >
        <Calendar className="w-6 h-6" />
        <span className="text-[10px] font-medium">Календарь</span>
      </button>
      
      <button
        onClick={() => navigate('/clients')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/clients') ? 'text-purple-400' : 'text-slate-500 hover:text-purple-400'
        }`}
      >
        <Users className="w-6 h-6" />
        <span className="text-[10px] font-medium">Клиенты</span>
      </button>
      
      <button
        onClick={() => navigate('/profile')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/profile') ? 'text-purple-400' : 'text-slate-500 hover:text-purple-400'
        }`}
      >
        <UserIcon className="w-6 h-6" />
        <span className="text-[10px] font-medium">Профиль</span>
      </button>
    </nav>
  )
}

export default BottomNavigation