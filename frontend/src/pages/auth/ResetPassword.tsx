import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle, ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { resetPassword } from '../../api/authApi'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState<{
    email?: string
    code?: string
    newPassword?: string
    confirmPassword?: string
  }>({})
  
  const [touched, setTouched] = useState({
    email: false,
    code: false,
    newPassword: false,
    confirmPassword: false
  })
  
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'email':
        if (!value) return 'Введите email'
        if (!value.includes('@') || !value.includes('.')) return 'Введите корректный email адрес'
        return ''
      case 'code':
        if (!value) return 'Введите код из письма'
        if (value.length !== 6) return 'Код должен состоять из 6 цифр'
        return ''
      case 'newPassword':
        if (!value) return 'Введите новый пароль'
        if (value.length < 8) return 'Пароль должен содержать минимум 8 символов'
        return ''
      case 'confirmPassword':
        if (!value) return 'Подтвердите пароль'
        if (value !== formData.newPassword) return 'Пароли не совпадают'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)
    
    const newErrors = {
      email: validateField('email', formData.email),
      code: validateField('code', formData.code),
      newPassword: validateField('newPassword', formData.newPassword),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword)
    }
    
    setErrors(newErrors)
    setTouched({
      email: true,
      code: true,
      newPassword: true,
      confirmPassword: true
    })
    
    if (newErrors.email || newErrors.code || newErrors.newPassword || newErrors.confirmPassword) {
      return
    }
    
    setIsLoading(true)
    
    try {
      await resetPassword({
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword
      })
      navigate('/reset-password-success')
    } catch (error: any) {
      const status = error.response?.status
      const message = error.response?.data?.message
      
      if (status === 400) {
        setErrors(prev => ({ ...prev, code: 'Неверный код или email' }))
      } else if (status === 429) {
        setServerError('Слишком много попыток. Попробуйте позже')
      } else if (message) {
        setServerError(message)
      } else {
        setServerError('Ошибка сброса пароля. Попробуйте позже')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getInputClassName = (fieldName: string) => {
    const hasError = errors[fieldName as keyof typeof errors] && touched[fieldName as keyof typeof touched]
    const hasEye = fieldName === 'newPassword' || fieldName === 'confirmPassword'
    return `input-field pl-12 ${hasEye ? 'pr-12' : ''} ${
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
          <h2 className="text-2xl font-bold mb-2">Сброс пароля</h2>
          <p className="text-purple-200/60">
            Введите код из письма и новый пароль
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field - Readonly */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                className="input-field pl-12 bg-slate-900/30 text-slate-300 cursor-not-allowed"
                required
                value={formData.email}
                readOnly
                disabled
              />
            </div>
            {formData.email && (
              <p className="text-xs text-purple-300/60 mt-1 ml-1">
                Код отправлен на этот email
              </p>
            )}
          </div>

          {/* Code Field */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">КОД ИЗ ПИСЬМА</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                name="code"
                placeholder="123456"
                className={getInputClassName('code')}
                required
                maxLength={6}
                value={formData.code}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {touched.code && errors.code && (
              <p className="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.code}
              </p>
            )}
          </div>

          {/* New Password Field */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">НОВЫЙ ПАРОЛЬ</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                placeholder="минимум 8 символов"
                className={getInputClassName('newPassword')}
                required
                value={formData.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-300 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {touched.newPassword && errors.newPassword ? (
              <p className="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.newPassword}
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-1 ml-1">Минимум 8 символов</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="text-sm font-medium text-purple-200 ml-1 mb-1 block">ПОДТВЕРДИТЕ ПАРОЛЬ</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="повторите пароль"
                className={getInputClassName('confirmPassword')}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Сброс...
              </>
            ) : (
              <>
                Сбросить пароль
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/forgot-password" 
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Запросить код заново
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword