import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, LogIn } from 'lucide-react'

const ResetPasswordSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Пароль изменён!</h1>
        <p className="text-purple-200/60 mb-6">
          Ваш пароль успешно обновлён. Теперь вы можете войти с новым паролем.
        </p>

        <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2">
          <LogIn className="w-5 h-5" />
          Войти
        </Link>
      </div>
    </div>
  )
}

export default ResetPasswordSuccess