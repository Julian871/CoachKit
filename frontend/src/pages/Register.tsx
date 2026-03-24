import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { User, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { register, isRegistering } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    
    // Валидация перед отправкой
    if (formData.name.length < 2) {
      setErrorMessage('Имя должно содержать минимум 2 символа')
      return
    }
    
    if (formData.name.length > 30) {
      setErrorMessage('Имя должно содержать максимум 30 символов')
      return
    }
    
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage('Введите корректный email адрес')
      return
    }
    
    if (formData.password.length < 8) {
      setErrorMessage('Пароль должен содержать минимум 8 символов')
      return
    }
    
    register(formData, {
      onSuccess: () => {
        navigate('/verify-email-sent', { state: { email: formData.email } })
      },
      onError: (error: any) => {
        const status = error.response?.status
        const message = error.response?.data?.message
        
        if (status === 409) {
          setErrorMessage('Пользователь с таким email уже существует')
        } else if (status === 400) {
          setErrorMessage('Неверный формат данных. Проверьте введённые поля')
        } else if (status === 429) {
          setErrorMessage('Слишком много попыток. Попробуйте позже')
        } else if (message) {
          setErrorMessage(message)
        } else {
          setErrorMessage('Ошибка регистрации. Попробуйте позже')
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
          <h2 className="text-2xl font-bold mb-2">Регистрация</h2>
          <p className="text-purple-200/60">Присоединяйтесь к нашей платформе</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">ИМЯ</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Татьяна"
                className="input-field pl-12"
                required
                minLength={2}
                maxLength={30}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1 ml-1">От 2 до 30 символов</p>
          </div>

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
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">ПАРОЛЬ</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="минимум 8 символов"
                className="input-field pl-12 pr-12"
                required
                minLength={8}
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
            <p className="text-xs text-slate-500 mt-1 ml-1">Минимум 8 символов</p>
          </div>

          <button
            type="submit"
            disabled={isRegistering}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isRegistering ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Регистрация...
              </>
            ) : (
              <>
                Зарегистрироваться
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-white font-semibold hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register