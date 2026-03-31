import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mail, LogIn, ChevronLeft } from 'lucide-react'

const ForgotPasswordSent = () => {
  const location = useLocation()
  const email = location.state?.email || 'ваш email'

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Mail className="w-10 h-10 text-purple-400" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Проверьте почту</h1>
        <p className="text-purple-200/60 mb-6">
          Мы отправили код для сброса пароля на <br />
          <span className="text-white font-medium">{email}</span>
        </p>

        <div className="space-y-3">
          <Link 
  to="/reset-password" 
  state={{ email: email }}
  className="btn-primary w-full flex items-center justify-center gap-2"
>
  Ввести код
</Link>

          <Link to="/login" className="btn-secondary w-full flex items-center justify-center gap-2">
            <LogIn className="w-5 h-5" />
            Вернуться к входу
          </Link>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          Не нашли письмо? Проверьте папку "Спам"
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordSent