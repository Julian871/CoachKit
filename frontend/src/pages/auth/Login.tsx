import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { login, isLoggingIn } = useAuth()
  const navigate = useNavigate()

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'email':
        if (!value) return 'Введите email'
        if (!value.includes('@') || !value.includes('.')) return 'Введите корректный email адрес'
        return ''
      case 'password':
        if (!value) return 'Введите пароль'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)
    
    const newErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password)
    }
    
    setErrors(newErrors)
    setTouched({ email: true, password: true })
    
    if (newErrors.email || newErrors.password) {
      return
    }
    
    login(formData, {
      onSuccess: () => {
        navigate('/dashboard')
      },
      onError: (error: any) => {
        const status = error.response?.status
        const message = error.response?.data?.message
        
        if (status === 401) {
          setErrors({
            email: 'Неверный email или пароль',
            password: 'Неверный email или пароль'
          })
        } else if (status === 403) {
          if (message === 'Email not verified') {
            setServerError('Email не подтверждён. Пожалуйста, проверьте почту и подтвердите аккаунт')
          } else if (message === 'Account deactivated') {
            setServerError('Аккаунт деактивирован. Обратитесь в поддержку')
          } else {
            setServerError('Доступ запрещён')
          }
        } else if (status === 429) {
          setServerError('Слишком много попыток. Попробуйте позже')
        } else if (message) {
          setServerError(message)
        } else {
          setServerError('Ошибка входа. Попробуйте позже')
        }
      }
    })
  }

  const getInputClassName = (fieldName: string) => {
    const hasError = errors[fieldName as keyof typeof errors] && touched[fieldName as keyof typeof touched]
    return `input-field pl-12 ${fieldName === 'password' ? 'pr-12' : ''} ${
      hasError ? 'border-red-500 focus:border-red-500 ring-red-500/30' : ''
    }`
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

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="example@coachkit.ru"
                className={getInputClassName('email')}
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {touched.email && errors.email && (
              <p className="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
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
                name="password"
                placeholder="••••••••"
                className={getInputClassName('password')}
                required
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
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