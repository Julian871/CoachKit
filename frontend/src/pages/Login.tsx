import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { login, isLoggingIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage('Введите корректный email адрес')
      return
    }
    
    if (formData.password.length < 1) {
      setErrorMessage('Введите пароль')
      return
    }
    
    login(formData, {
      onSuccess: () => {
        navigate('/dashboard')
      },
      onError: (error: any) => {
        console.error('Login error:', error)
        
        const status = error.response?.status
        const message = error.response?.data?.message
        
        
        if (status === 401) {
          if (message === "Invalid email or password") {
            setErrorMessage('Неверный email или пароль')
          } else {
            setErrorMessage('Неверный email или пароль')
          }
        } else if (status === 403) {
          if (message === "Email not verified") {
            setErrorMessage('Email не подтверждён. Пожалуйста, проверьте почту и подтвердите аккаунт')
          } else if (message === "Account deactivated") {
            setErrorMessage('Аккаунт деактивирован. Обратитесь в поддержку')
          } else {
            setErrorMessage('Доступ запрещён')
          }
        } else if (status === 429) {
          setErrorMessage('Слишком много попыток. Попробуйте позже')
        } else if (message) {
          setErrorMessage(message)
        } else {
          setErrorMessage('Ошибка входа. Попробуйте позже')
        }
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
            CoachKit
          </h1>
          <h2 className="text-2xl font-bold mb-2">Вход</h2>
          <p className="text-purple-200/60">Добро пожаловать!</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                placeholder="example@coachkit.ru"
                className="input-field pl-12"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-purple-200 ml-1">ПАРОЛЬ</label>
              <Link to="/forgot-password" className="text-sm text-purple-300 hover:underline">
                Забыли пароль?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input-field pl-12 pr-12"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoggingIn ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Вход...
              </>
            ) : (
              <>
                Войти
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-white font-semibold hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login