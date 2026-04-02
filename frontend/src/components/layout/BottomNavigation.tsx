
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Calendar, Users, User as UserIcon, Activity, Dumbbell, Scroll, ScrollText } from 'lucide-react'

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
        <Activity className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => navigate('/calendar')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/calendar') ? 'text-purple-400' : 'text-slate-500 hover:text-purple-400'
        }`}
      >
        <Calendar className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => navigate('/clients')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/clients') ? 'text-purple-400' : 'text-slate-500 hover:text-purple-400'
        }`}
      >
        <Users className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => navigate('/exercises')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/exercises') ? 'text-purple-400' : 'text-slate-500 hover:text-purple-400'
        }`}
      >
        <Dumbbell className="w-6 h-6" />
      </button>

      <button
        onClick={() => navigate('/template')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/template') ? 'text-purple-400' : 'text-slate-500 hover:text-purple-400'
        }`}
      >
        <ScrollText className="w-6 h-6" />
      </button>
    </nav>
  )
}

export default BottomNavigation