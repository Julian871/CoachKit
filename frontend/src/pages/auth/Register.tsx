import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { User, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const [touched, setTouched] = useState<{ name: boolean; email: boolean; password: boolean }>({
    name: false,
    email: false,
    password: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { register, isRegistering } = useAuth()
  const navigate = useNavigate()

  // Валидация поля
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        if (value.length < 2) return 'Имя должно содержать минимум 2 символа'
        if (value.length > 30) return 'Имя должно содержать максимум 30 символов'
        return ''
      case 'email':
        if (!value.includes('@') || !value.includes('.')) return 'Введите корректный email адрес'
        return ''
      case 'password':
        if (value.length < 8) return 'Пароль должен содержать минимум 8 символов'
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
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password)
    }
    
    setErrors(newErrors)
    setTouched({ name: true, email: true, password: true })
    
    if (newErrors.name || newErrors.email || newErrors.password) {
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
          setErrors(prev => ({ ...prev, email: 'Пользователь с таким email уже существует' }))
          setTouched(prev => ({ ...prev, email: true }))
        } else if (status === 400) {
          setServerError('Неверный формат данных. Проверьте введённые поля')
        } else if (status === 429) {
          setServerError('Слишком много попыток. Попробуйте позже')
        } else if (message) {
          setServerError(message)
        } else {
          setServerError('Ошибка регистрации. Попробуйте позже')
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
          <h2 className="text-2xl font-bold mb-2">Регистрация</h2>
          <p className="text-purple-200/60">Присоединяйтесь к нашей платформе</p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">ИМЯ</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                placeholder="Татьяна"
                className={getInputClassName('name')}
                required
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {touched.name && errors.name && (
              <p className="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
            {!touched.name && (
              <p className="text-xs text-slate-500 mt-1 ml-1">От 2 до 30 символов</p>
            )}
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">ПАРОЛЬ</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="минимум 8 символов"
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
            {touched.password && errors.password ? (
              <p className="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-1 ml-1">Минимум 8 символов</p>
            )}
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